import { useDialog } from '@/hooks/useDialog';
import { Checkbox, colors, TableCell, useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import type { FC } from 'react';
import { ActionsItem } from '../../../components/actions-menu';
import { AlertDialog } from '../../../components/alert-dialog';
import { DataTableRow } from '../../../components/data-table-row';
import { ActionsIconButton } from '../../../components/icon-actions';
import { Label } from '../../../components/label';
import { Link } from '../../../components/link';
import { Pencil as PencilIcon } from '../../../icons/pencil';
import { Trash as TrashIcon } from '../../../icons/trash';
import { Upload as UploadIcon } from '../../../icons/upload';
import type { Product } from '../../../types/products';
import { formatDate } from '../../../utils/format-date';
import { useDeleteProduct } from '../api';

interface ProductTableRow {
  product: Product;
  onSelect: () => void;
  selected: boolean;
}

export const ProductTableRow: FC<ProductTableRow> = (props) => {
  const { product, selected, onSelect } = props;
  const theme = useTheme();
  const queryClient = useQueryClient();
  const deleteProduct = useDeleteProduct(() =>
    queryClient.invalidateQueries({ queryKey: ['products'] })
  );
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog(false);

  const mappedColors = {
    draft: colors.grey[500],
    published: theme.palette.success.main,
    archived: theme.palette.error.main,
  };

  const actionItems: ActionsItem[] = [
    {
      label: 'Edit',
      icon: PencilIcon,
      href: `/product/${product._id}/edit`,
    },
    {
      label: 'Publish',
      icon: UploadIcon,
      onClick: () => {},
    },
    {
      label: 'Delete',
      icon: TrashIcon,
      onClick: handleOpenDeleteDialog,
      color: 'error',
    },
  ];

  const handleDeleteProduct = (): void => {
    deleteProduct.mutate(product._id, {
      onSuccess: () => {
        handleCloseDeleteDialog();
      },
    });
  };

  return (
    <>
      <AlertDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        title={`Delete product ${product._id}`}
        content="Are you sure you want to permanently delete this product?"
        onSubmit={handleDeleteProduct}
        isLoading={deleteProduct.isPending}
      />
      <DataTableRow selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            onChange={onSelect}
            checked={selected}
          />
        </TableCell>
        <TableCell>
          <Link
            color="textPrimary"
            variant="body1"
            underline="hover"
            href={`/products/${product._id}`}
          >
            {product._id}
          </Link>
        </TableCell>
        <TableCell>
          <Link
            underline="hover"
            href={`/products/${product._id}`}
          >
            {product.title}
          </Link>
        </TableCell>
        <TableCell>{formatDate(product.createdAt)}</TableCell>
        <TableCell>
          <Label color={mappedColors[product.status]}>{product.status}</Label>
        </TableCell>
        <TableCell align="right">
          <ActionsIconButton items={actionItems} />
        </TableCell>
      </DataTableRow>
    </>
  );
};
