import type { FC, ReactNode } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Divider,
  Tab,
  Tabs,
  useTheme,
  colors
} from '@mui/material';
import type { ActionsItem } from '@/components/actions-menu';
import { AlertDialog } from '@/components/alert-dialog';
import { Link } from '@/components/link';
import { PageHeader } from '@/components/page-header';
import { Upload as UploadIcon } from '@/icons/upload';
import { Key as KeyIcon } from '@/icons/key';
import { Trash as TrashIcon } from '@/icons/trash';
import { useDialog } from '@/hooks/useDialog';
import { ProductAddKeyDialog } from './product/product-add-key-dialog';
import { useDeleteProduct } from '@/api/products';
import { ProductImportKeysDialog } from './product/product-import-keys-dialog';
import type { Product, ProductStatus } from '@/types/products';
import { Label } from '../label';

interface Tab {
  label: string;
  href: string;
  pathname: string;
}

interface ProductLayoutProps {
  children: ReactNode;
  product: Product;
  isLoading?: boolean;
}

export const ProductLayout: FC<ProductLayoutProps> = (props) => {
  const { isLoading = false, product, children } = props;
  const theme = useTheme();
  const router = useRouter();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] = useDialog(false);
  const [addKeyDialogOpen, handleOpenAddKeyDialog, handleCloseAddKeyDialog] = useDialog(false);
  const [importKeysDialogOpen, handleOpenImportKeysDialog, handleCloseImportKeysDialog] = useDialog(false);
  const deleteProduct = useDeleteProduct();
  const { _id: id, title } = product;

  const tabs: Tab[] = [
    {
      label: 'General',
      href: `/products/${id}`,
      pathname: '/products/[id]',

    },
    {
      label: 'Keys',
      href: `/products/${id}/keys`,
      pathname: '/products/[id]/keys',
    },
    {
      label: 'Reviews',
      href: `/products/${id}/reviews`,
      pathname: '/products/[id]/reviews',
    },
  ]

  const actionItems: ActionsItem[] = [
    {
      label: 'Add key',
      icon: KeyIcon,
      onClick: handleOpenAddKeyDialog,
    },
    {
      label: 'Import keys',
      icon: UploadIcon,
      onClick: handleOpenImportKeysDialog,
    },
    {
      label: 'Delete',
      icon: TrashIcon,
      onClick: handleOpenDeleteDialog,
      color: 'error'
    }
  ]

  const handleDeleteProduct = (): void => {
    deleteProduct.mutate(id, {
      onSuccess: () => {
        handleCloseDeleteDialog();
        router.push('/products');
      }
    })
  }

  const mappedColors: Record<ProductStatus, string> = {
    draft: colors.grey[500],
    published: theme.palette.success.main,
    archived: theme.palette.error.main
  }

  return (
    <>
      {!!id && (
        <>
          <AlertDialog
            open={deleteDialogOpen}
            onClose={handleCloseDeleteDialog}
            title={`Delete product ${id}`}
            content="Are you sure you want to permanently delete this product?"
            onSubmit={handleDeleteProduct}
            isLoading={deleteProduct.isLoading}
          />
        </>
      )}
      <ProductImportKeysDialog
        open={importKeysDialogOpen}
        onClose={handleCloseImportKeysDialog}
      />
      {addKeyDialogOpen && (
        <ProductAddKeyDialog
          open
          onClose={handleCloseAddKeyDialog}
          productId={id}
        />
      )}
      <Head>
        <title>Product</title>
      </Head>
      <Box sx={{ py: 3 }} >
        <Container maxWidth="lg">
          <PageHeader
            title={title}
            backHref="/products"
            backLabel="Products"
            actions={actionItems}
            isActionsLoading={isLoading}
            isTitleLoading={isLoading}
          >
            <Label color={mappedColors[product.status]}>
              {product.status}
            </Label>
          </PageHeader>
          <Tabs value={tabs.findIndex((tab) => tab.pathname === router.pathname)}>
            {tabs.map((tab) => (
              <Tab
                underline="none"
                component={Link}
                key={tab.label}
                href={tab.href}
                label={tab.label}
              />
            ))}
          </Tabs>
          <Divider sx={{ mb: 3 }} />
          {children}
        </Container>
      </Box>
    </>
  );
};