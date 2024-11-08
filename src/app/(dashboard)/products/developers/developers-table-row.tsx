import { Checkbox, TableCell } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import type { FC } from 'react';
import { ActionsItem } from '../../../components/actions-menu';
import { AlertDialog } from '../../../components/alert-dialog';
import { DataTableRow } from '../../../components/data-table-row';
import { ActionsIconButton } from '../../../components/icon-actions';
import { useDialog } from '../../../hooks/useDialog';
import { Pencil as PencilIcon } from '../../../icons/pencil';
import { Trash as TrashIcon } from '../../../icons/trash';
import { Developer } from '../../../types/developer';
import { useDeleteDeveloper } from './api';
import { DeveloperUpdateDialog } from './developer-update-dialog';

interface DevelopersTableRowProps {
  developer: Developer;
  onSelect: () => void;
  selected: boolean;
}

export const DevelopersTableRow: FC<DevelopersTableRowProps> = (props) => {
  const { developer, selected, onSelect } = props;
  const queryClient = useQueryClient();

  const [openDeleteDialog, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog();
  const [updateDialogOpen, handleOpenUpdateDialog, handleCloseUpdateDialog] =
    useDialog();

  const deleteDeveloper = useDeleteDeveloper(() =>
    queryClient.invalidateQueries({ queryKey: ['developers'] })
  );

  const handleDeleteDeveloper = () => {
    deleteDeveloper.mutate(developer._id, {
      onSuccess: () => {
        handleCloseDeleteDialog();
      },
    });
  };

  const actionItems: ActionsItem[] = [
    {
      label: 'Edit',
      icon: PencilIcon,
      onClick: handleOpenUpdateDialog,
    },
    {
      label: 'Delete',
      icon: TrashIcon,
      onClick: handleOpenDeleteDialog,
      color: 'error',
    },
  ];

  return (
    <>
      {updateDialogOpen && (
        <DeveloperUpdateDialog
          developer={developer}
          open
          onClose={handleCloseUpdateDialog}
        />
      )}
      <AlertDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        title="Delete developer"
        content="Are you sure you want to delete this developer?"
        onSubmit={handleDeleteDeveloper}
        isLoading={deleteDeveloper.isPending}
      />
      <DataTableRow
        key={developer._id}
        selected={selected}
      >
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            onChange={onSelect}
            checked={selected}
          />
        </TableCell>
        <TableCell>{developer.name}</TableCell>
        <TableCell>{developer.slug}</TableCell>
        <TableCell align="right">
          <ActionsIconButton items={actionItems} />
        </TableCell>
      </DataTableRow>
    </>
  );
};
