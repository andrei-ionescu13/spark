import { ActionsItem } from '@/components/actions-menu';
import { AlertDialog } from '@/components/alert-dialog';
import { DataTableRow } from '@/components/data-table-row';
import { ActionsIconButton } from '@/components/icon-actions';
import { Checkbox, TableCell } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import type { FC } from 'react';
import { useDialog } from '../../../hooks/useDialog';
import { Pencil as PencilIcon } from '../../../icons/pencil';
import { Trash as TrashIcon } from '../../../icons/trash';
import { useDeleteGenre, useUpdateGenre } from './api';
import { GenreDialog } from './genre-dialog';

interface UsersTableRowProps {
  genre: any;
  onSelect: () => void;
  selected: boolean;
}

export const GenresTableRow: FC<UsersTableRowProps> = (props) => {
  const { genre, selected, onSelect } = props;
  const queryClient = useQueryClient();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog();
  const [updateDialogOpen, handleOpenUpdateDialog, handleCloseUpdateDialog] =
    useDialog();
  const deleteGenre = useDeleteGenre(() =>
    queryClient.invalidateQueries({ queryKey: ['genres'] })
  );
  const updateGenre = useUpdateGenre(() =>
    queryClient.invalidateQueries({ queryKey: ['genres'] })
  );

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

  const handleDeleteGenre = () => {
    deleteGenre.mutate(genre._id, {
      onSuccess: () => {
        handleCloseDeleteDialog();
      },
    });
  };

  const handleUpdateGenre = (values: { name: string; slug: string }) => {
    updateGenre.mutate(
      { id: genre._id, body: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['genres'] });
          handleCloseUpdateDialog();
        },
      }
    );
  };

  return (
    <>
      <GenreDialog
        open={updateDialogOpen}
        onClose={handleCloseUpdateDialog}
        genre={genre}
        isPending={updateGenre.isPending}
        onSubmit={handleUpdateGenre}
      />
      <AlertDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        title={`Delete genre ${genre.id}`}
        content="Are you sure you want to permanently delete this genre?"
        onSubmit={handleDeleteGenre}
        isLoading={deleteGenre.isPending}
      />
      <DataTableRow selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            onChange={onSelect}
            checked={selected}
          />
        </TableCell>
        <TableCell>{genre.name}</TableCell>
        <TableCell align="right">
          <ActionsIconButton items={actionItems} />
        </TableCell>
      </DataTableRow>
    </>
  );
};
