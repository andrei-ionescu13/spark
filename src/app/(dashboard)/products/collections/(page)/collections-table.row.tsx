import { ActionsItem } from '@/components/actions-menu';
import { AlertDialog } from '@/components/alert-dialog';
import { DataTableRow } from '@/components/data-table-row';
import { ActionsIconButton } from '@/components/icon-actions';
import { Label } from '@/components/label';
import Link from '@/components/link';
import { useDialog } from '@/hooks/useDialog';
import { EyeOff } from '@/icons/eye-off';
import { Trash } from '@/icons/trash';
import { Collection } from '@/types/collection';
import { getStatusFromInterval } from '@/utils/get-status-from-interval';
import { Checkbox, colors, TableCell, useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import type { FC } from 'react';
import { useDeactivateCollection, useDeleteCollection } from '../api';

interface CollectionsTableRowProps {
  collection: Collection;
  onSelect: () => void;
  selected: boolean;
}

export const CollectionsTableRow: FC<CollectionsTableRowProps> = (props) => {
  const { collection, selected, onSelect } = props;
  const theme = useTheme();
  const queryClient = useQueryClient();
  const deleteCollection = useDeleteCollection();
  const deactivateCollection = useDeactivateCollection();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog(false);
  const [
    deactivateDialogOpen,
    handleOpenDeactivateDialog,
    handleCloseDeactivateDialog,
  ] = useDialog(false);
  const status = getStatusFromInterval(
    collection.startDate,
    collection.endDate
  );

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

  const handleDeleteCollection = (): void => {
    deleteCollection.mutate(collection._id, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['collections'] });
        handleCloseDeleteDialog();
      },
    });
  };

  const handleDeactivateCollection = (): void => {
    deactivateCollection.mutate(collection._id, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['collections'] });
        handleCloseDeactivateDialog();
      },
    });
  };

  return (
    <>
      <AlertDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        title={`Delete collection`}
        content="Are you sure you want to delete this collection?"
        onSubmit={handleDeleteCollection}
        isLoading={deleteCollection.isPending}
      />
      <AlertDialog
        open={deactivateDialogOpen}
        onClose={handleCloseDeactivateDialog}
        title={`Deactivate collection`}
        content="Are you sure you want to deactivate this collection?"
        onSubmit={handleDeactivateCollection}
        isLoading={deactivateCollection.isPending}
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
            href={`/products/collections/${collection._id}`}
            underline="hover"
          >
            {collection.title}
          </Link>
        </TableCell>
        <TableCell>{collection.products.length}</TableCell>
        <TableCell>
          {format(new Date(collection.startDate), 'dd.MM.yyyy hh:mm')}
        </TableCell>
        <TableCell>
          {collection.endDate &&
            format(new Date(collection.endDate), 'dd.MM.yyyy hh:mm')}
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
