import type { FC } from 'react';
import { Checkbox, colors, TableCell, Typography, useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import type { ActionsItem } from '@/components/actions-menu';
import { AlertDialog } from '@/components/alert-dialog';
import { ActionsIconButton } from '@/components/icon-actions';
import { Link } from '@/components/link';
import { Trash as TrashIcon } from '@/icons/trash';
import { EyeOff as EyeOffIcon } from '@/icons/eye-off';
import { useDialog } from '@/hooks/useDialog';
import { Label } from '@/components/label';
import { DataTableRow } from '@/components/data-table-row';
import { format } from 'date-fns';
import { useDeactivatePromoCode, useDeletePromoCode } from '@/api/promo-codes';
import type { PromoCode } from '@/types/promo-code';
import { getStatusFromInterval } from '@/utils/get-status-from-interval';

interface PromoCodeTableRowProps {
  promoCode: PromoCode;
  onSelect: () => void;
  selected: boolean;
}

export const PromoCodeTableRow: FC<PromoCodeTableRowProps> = (props) => {
  const { promoCode, selected, onSelect } = props;
  const theme = useTheme()
  const queryClient = useQueryClient();
  const deletePromoCode = useDeletePromoCode(() => queryClient.invalidateQueries({ queryKey: ['promo-codes'] }))
  const deactivatePromoCode = useDeactivatePromoCode(() => queryClient.invalidateQueries({ queryKey: ['promo-codes'] }))
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] = useDialog(false);
  const [deactivateDialogOpen, handleOpenDeactivateDialog, handleCloseDeactivateDialog] = useDialog(false);
  const status = getStatusFromInterval(promoCode.startDate, promoCode.endDate);

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

  const handleDeletePromoCode = (): void => {
    deletePromoCode.mutate(promoCode._id, {
      onSuccess: () => {
        handleCloseDeleteDialog()
      }
    })
  }

  const handleDeactivatePromoCode = (): void => {
    deactivatePromoCode.mutate(promoCode._id, {
      onSuccess: () => {
        handleCloseDeactivateDialog()
      }
    })
  }

  const descriptionValue = `${promoCode.value}${promoCode.type === 'amount' ? '$' : '%'} off ${promoCode.productSelection === 'general' ? 'general' : promoCode.products?.length === 1 ? promoCode.products[0].title : `${promoCode.products?.length} products`}`
  const descriptionUser = promoCode.userSelection === 'general' ? 'general' : promoCode.users?.length === 1 ? promoCode.users?.[0].email : `${promoCode.users?.length} users`
  const description = `${descriptionValue} • ${descriptionUser}`;

  return (
    <>
      <AlertDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        title={`Delete promoCode`}
        content="Are you sure you want to delete this promoCode?"
        onSubmit={handleDeletePromoCode}
        isLoading={deletePromoCode.isPending}
      />
      <AlertDialog
        open={deactivateDialogOpen}
        onClose={handleCloseDeactivateDialog}
        title={`Deactivate promoCode`}
        content="Are you sure you want to deactivate this promoCode?"
        onSubmit={handleDeactivatePromoCode}
        isLoading={deactivatePromoCode.isPending}
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
            underline="hover"
            href={`/promo-codes/${promoCode._id}`}
          >
            {promoCode.code}
          </Link>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {description}
          </Typography>
        </TableCell>
        <TableCell>
          {format(new Date(promoCode.startDate), 'dd.MM.yyyy hh:mm')}
        </TableCell>
        <TableCell>
          {promoCode.endDate && format(new Date(promoCode.endDate), 'dd.MM.yyyy hh:mm')}
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