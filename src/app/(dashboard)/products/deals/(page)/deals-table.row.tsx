import { ActionsItem } from '@/components/actions-menu';
import { AlertDialog } from '@/components/alert-dialog';
import { DataTableRow } from '@/components/data-table-row';
import { ActionsIconButton } from '@/components/icon-actions';
import { Label } from '@/components/label';
import Link from '@/components/link';
import { useDialog } from '@/hooks/useDialog';
import { EyeOff } from '@/icons/eye-off';
import { Trash } from '@/icons/trash';
import { Deal } from '@/types/deal';
import { getStatusFromInterval } from '@/utils/get-status-from-interval';
import { Checkbox, colors, TableCell, useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import type { FC } from 'react';
import { useDeactivateDeal, useDeleteDeal } from '../api';

interface DealsTableRowProps {
  deal: Deal;
  onSelect: () => void;
  selected: boolean;
}

export const DealsTableRow: FC<DealsTableRowProps> = (props) => {
  const { deal, selected, onSelect } = props;
  const theme = useTheme();
  const queryClient = useQueryClient();
  const deleteDeal = useDeleteDeal();
  const deactivateDeal = useDeactivateDeal();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog(false);
  const [
    deactivateDialogOpen,
    handleOpenDeactivateDialog,
    handleCloseDeactivateDialog,
  ] = useDialog(false);
  const status = getStatusFromInterval(deal.startDate, deal.endDate);

  const mappedColors = {
    scheduled: colors.grey[500],
    active: theme.palette.success.main,
    expired: theme.palette.error.main,
  };

  const actionItems: ActionsItem[] = [
    {
      label: 'Deactivate',
      icon: EyeOff,
      onClick: handleOpenDeactivateDialog,
    },
    {
      label: 'Delete',
      icon: Trash,
      onClick: handleOpenDeleteDialog,
      color: 'error',
    },
  ];

  const handleDeleteDeal = (): void => {
    deleteDeal.mutate(deal._id, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['deals'] });
        handleCloseDeleteDialog();
      },
    });
  };

  const handleDeactivateDeal = (): void => {
    deactivateDeal.mutate(deal._id, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['deals'] });
        handleCloseDeactivateDialog();
      },
    });
  };

  return (
    <>
      <AlertDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        title={`Delete deal`}
        content="Are you sure you want to delete this deal?"
        onSubmit={handleDeleteDeal}
        isLoading={deleteDeal.isPending}
      />
      <AlertDialog
        open={deactivateDialogOpen}
        onClose={handleCloseDeactivateDialog}
        title={`Deactivate deal`}
        content="Are you sure you want to deactivate this deal?"
        onSubmit={handleDeactivateDeal}
        isLoading={deactivateDeal.isPending}
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
            href={`/products/deals/${deal._id}`}
            underline="hover"
          >
            {deal.title}
          </Link>
        </TableCell>
        <TableCell>{deal.products.length}</TableCell>
        <TableCell>
          {format(new Date(deal.startDate), 'dd.MM.yyyy hh:mm')}
        </TableCell>
        <TableCell>
          {deal.endDate && format(new Date(deal.endDate), 'dd.MM.yyyy hh:mm')}
        </TableCell>
        <TableCell>
          <Label color={mappedColors[status]}>{status}</Label>
        </TableCell>
        <TableCell align="right">
          <ActionsIconButton items={actionItems} />
        </TableCell>
      </DataTableRow>
    </>
  );
};
