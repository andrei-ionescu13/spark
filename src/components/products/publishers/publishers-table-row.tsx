import type { FC } from 'react';
import { Box, Checkbox, TableCell } from '@mui/material';
import { ActionsItem } from '@/components/actions-menu';
import { AlertDialog } from '@/components/alert-dialog';
import { ActionsIconButton } from '@/components/icon-actions';
import { Trash as TrashIcon } from '@/icons/trash';
import { Pencil as PencilIcon } from '@/icons/pencil';
import { useDialog } from '@/hooks/useDialog';
import { DataTableRow } from '@/components/data-table-row';
import { PublisherDialog } from './publisher-dialog';
import { useQueryClient } from '@tanstack/react-query';
import { useDeletePublisher } from '@/api/publishers';
import Image from 'next/image';

interface PublishersTableRowProps {
  publisher: any;
  onSelect: () => void;
  selected: boolean;
}

export const PublishersTableRow: FC<PublishersTableRowProps> = (props) => {
  const { publisher, selected, onSelect } = props;
  const queryClient = useQueryClient();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] = useDialog(false);
  const [updateDialogOpen, handleOpenUpdateDialog, handleCloseUpdateDialog] = useDialog(false);
  const deletePublisher = useDeletePublisher();

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
      color: 'error'
    }
  ]

  const handleDeletePublisher = () => {
    deletePublisher.mutate(publisher._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['publishers'] });
        handleCloseDeleteDialog()
      }
    })
  }

  return (
    <>
      {updateDialogOpen && (
        <PublisherDialog
          open
          onClose={handleCloseUpdateDialog}
          mode="edit"
          publisher={publisher}
        />
      )}
      <AlertDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        title={`Delete user ${publisher._id}`}
        content="Are you sure you want to permanently delete this publisher?"
        onSubmit={handleDeletePublisher}
        isLoading={deletePublisher.isPending}
      />
      <DataTableRow selected={selected} >
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            onChange={onSelect}
            checked={selected}
          />
        </TableCell>
        <TableCell>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Box sx={{ width: 64, position: 'relative', pb: 5 }} >
              <Image
                src={publisher.logo.url}
                priority
                alt={publisher.name}
                layout='fill'
                objectFit="contain"
              />
            </Box>
            {publisher.name}
          </Box>
        </TableCell>
        <TableCell align="right">
          <ActionsIconButton items={actionItems} />
        </TableCell>
      </DataTableRow>
    </>
  );
};