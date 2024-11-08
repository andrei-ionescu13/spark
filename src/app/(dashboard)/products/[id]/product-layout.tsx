'use client';
import {
  Box,
  colors,
  Container,
  Divider,
  Skeleton,
  Tab,
  Tabs,
  useTheme,
} from '@mui/material';
import { useParams, usePathname, useRouter } from 'next/navigation';
import type { FC, ReactNode } from 'react';
import type { ActionsItem } from '../../../components/actions-menu';
import { AlertDialog } from '../../../components/alert-dialog';
import { Label } from '../../../components/label';
import { Link } from '../../../components/link';
import { PageHeader } from '../../../components/page-header';
import { useDialog } from '../../../hooks/useDialog';
import { Key as KeyIcon } from '../../../icons/key';
import { Trash as TrashIcon } from '../../../icons/trash';
import { Upload as UploadIcon } from '../../../icons/upload';
import type { ProductStatus } from '../../../types/products';
import { useDeleteProduct } from '../api';
import { useGetProduct } from './api';
import { ProductAddKeyDialog } from './keys/product-add-key-dialog';
import { ProductImportKeysDialog } from './keys/product-import-keys-dialog';

interface Tab {
  label: string;
  href: string;
}

interface ProductLayoutProps {
  children: ReactNode;
}

export const ProductLayout: FC<ProductLayoutProps> = (props) => {
  const { children } = props;
  const router = useRouter();
  const { data: product, isLoading } = useGetProduct();
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  const pathname = usePathname();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog(false);
  const [addKeyDialogOpen, handleOpenAddKeyDialog, handleCloseAddKeyDialog] =
    useDialog(false);
  const [
    importKeysDialogOpen,
    handleOpenImportKeysDialog,
    handleCloseImportKeysDialog,
  ] = useDialog(false);
  const deleteProduct = useDeleteProduct();
  const { title } = product || {};

  const tabs: Tab[] = [
    {
      label: 'General',
      href: `/products/${id}`,
    },
    {
      label: 'Keys',
      href: `/products/${id}/keys`,
    },
    {
      label: 'Reviews',
      href: `/products/${id}/reviews`,
    },
  ];

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
      color: 'error',
    },
  ];

  const handleDeleteProduct = (): void => {
    if (!id) return;

    deleteProduct.mutate(id, {
      onSuccess: () => {
        handleCloseDeleteDialog();
        router.push('/products');
      },
    });
  };

  const mappedColors: Record<ProductStatus, string> = {
    draft: colors.grey[500],
    published: theme.palette.success.main,
    archived: theme.palette.error.main,
  };

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
            isLoading={deleteProduct.isPending}
          />
        </>
      )}
      <ProductImportKeysDialog
        open={importKeysDialogOpen}
        onClose={handleCloseImportKeysDialog}
      />
      {addKeyDialogOpen && id && (
        <ProductAddKeyDialog
          open
          onClose={handleCloseAddKeyDialog}
          productId={id}
        />
      )}
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <PageHeader
            title={title}
            backHref="/products"
            backLabel="Products"
            actions={actionItems}
            isLoading={isLoading}
          >
            {product && (
              <Label color={mappedColors[product.status]}>
                {product.status}
              </Label>
            )}
            {isLoading && (
              <Skeleton
                variant="rounded"
                width={80}
                height={21}
              />
            )}
          </PageHeader>
          <Tabs value={tabs.findIndex((tab) => tab.href === pathname)}>
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
