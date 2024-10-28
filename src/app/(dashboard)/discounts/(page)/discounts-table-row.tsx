import type { FC } from 'react';
import { Checkbox, colors, TableCell, Typography, useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import type { ActionsItem } from '../../actions-menu';
import { AlertDialog } from '../../alert-dialog';
import { ActionsIconButton } from '../../icon-actions';
import { Link } from '../../link';
import { Trash as TrashIcon } from '../../../icons/trash';
import { EyeOff as EyeOffIcon } from '../../../icons/eye-off';
import { useDialog } from '../../../hooks/useDialog';
import { Label } from '../../label';
import { DataTableRow } from '../../data-table-row';
import type { Discount } from '../../../types/discounts';
import { format } from 'date-fns';
import { useDeactivateDiscount, useDeleteDiscount } from '@/api/discounts';
import { getStatusFromInterval } from '../../../utils/get-status-from-interval';

interface DiscountsTableRow {
  discount: Discount;
  onSelect: () => void;
  selected: boolean;
}

export const DiscountsTableRow: FC<DiscountsTableRow> = (props) => {
  const { discount, selected, onSelect } = props;
  const theme = useTheme()
  const queryClient = useQueryClient();
  const deleteDiscount = useDeleteDiscount(() => queryClient.invalidateQueries({ queryKey: ['discounts'] }))
  const deactivateDiscount = useDeactivateDiscount(() => queryClient.invalidateQueries({ queryKey: ['discounts'] }))
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] = useDialog(false);
  const [deactivateDialogOpen, handleOpenDeactivateDialog, handleCloseDeactivateDialog] = useDialog(false);
  const status = getStatusFromInterval(discount.startDate, discount.endDate);

  const mappedColors = {
    scheduled: colors.grey[500],
    active: theme.palette.success.main,
    expired: theme.palette.error.main
  }

  const actionItems: ActionsItem[] = [
    {
      label: 'Deactivate',
      icon: EyeOffIcon,
      onClick: handleOpenDeactivateDialog,
    },
    {
      label: 'Delete',
      icon: TrashIcon,
      onClick: handleOpenDeleteDialog,
      color: 'error'
    }
  ]

  const handleDeleteDiscount = (): void => {
    deleteDiscount.mutate(discount._id, {
      onSuccess: () => {
        handleCloseDeleteDialog()
      }
    })
  }

  const handleDeactivateDiscount = (): void => {
    deactivateDiscount.mutate(discount._id, {
      onSuccess: () => {
        handleCloseDeactivateDialog()
      }
    })
  }

  return (
    <>
      <AlertDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        title={`Delete discount`}
        content="Are you sure you want to delete this discount?"
        onSubmit={handleDeleteDiscount}
        isLoading={deleteDiscount.isPending}
      />
      <AlertDialog
        open={deactivateDialogOpen}
        onClose={handleCloseDeactivateDialog}
        title={`Deactivate discount`}
        content="Are you sure you want to deactivate this discount?"
        onSubmit={handleDeactivateDiscount}
        isLoading={deactivateDiscount.isPending}
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
            href={`/discounts/${discount._id}`}
            underline="hover"
          >
            {discount.title}
          </Link>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {`${discount.value}${discount.type === 'amount' ? '$' : '%'} off  ${discount.products.length === 1 ? discount.products[0].title : `${discount.products.length} products`}`}
          </Typography>
        </TableCell>
        <TableCell>
          {format(new Date(discount.startDate), 'dd.MM.yyyy hh:mm')}
        </TableCell>
        <TableCell>
          {discount.endDate && format(new Date(discount.endDate), 'dd.MM.yyyy hh:mm')}
        </TableCell>
        <TableCell>
          <Label color={mappedColors[status]}>
            {status}
          </Label>
        </TableCell>
        <TableCell align="right">
          <ActionsIconButton items={actionItems} />
        </TableCell>
      </DataTableRow>
    </>
  );
};