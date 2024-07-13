import type { FC } from 'react';
import { Box, Checkbox, TableCell } from '@mui/material';
import { ActionsItem } from '@/components/actions-menu';
import { AlertDialog } from '@/components/alert-dialog';
import { ActionsIconButton } from '@/components/icon-actions';
import { Trash as TrashIcon } from '@/icons/trash';
import { Pencil as PencilIcon } from '@/icons/pencil';
import { useDialog } from '@/hooks/useDialog';
import { DataTableRow } from '@/components/data-table-row';
import { PlatformDialog } from './platform-dialog';
import { useQueryClient } from '@tanstack/react-query';
import { useDeletePlatform } from '@/api/platforms';
import Image from 'next/image';

interface PlatformsTableRowProps {
  platform: any;
  onSelect: () => void;
  selected: boolean;
}

export const PlatformsTableRow: FC<PlatformsTableRowProps> = (props) => {
  const { platform, selected, onSelect } = props;
  const queryClient = useQueryClient();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] = useDialog(false);
  const [updateDialogOpen, handleOpenUpdateDialog, handleCloseUpdateDialog] = useDialog(false);
  const deletePlatform = useDeletePlatform(() => queryClient.invalidateQueries({ queryKey: ['platforms'] }));

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

  const handleDeletePlatform = () => {
    deletePlatform.mutate(platform._id, {
      onSuccess: () => {
        handleCloseDeleteDialog()
      }
    })
  }

  return (
    <>
      {updateDialogOpen && (
        <PlatformDialog
          open
          onClose={handleCloseUpdateDialog}
          mode="edit"
          platform={platform}
        />
      )}
      <AlertDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        title={`Delete user ${platform._id}`}
        content="Are you sure you want to permanently delete this platform?"
        onSubmit={handleDeletePlatform}
        isLoading={deletePlatform.isPending}
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
                src={platform.logo.url}
                priority
                alt={platform.name}
                layout='fill'
                objectFit="contain"
              />
            </Box>
            {platform.name}
          </Box>
        </TableCell>
        <TableCell align="right">
          <ActionsIconButton items={actionItems} />
        </TableCell>
      </DataTableRow>
    </>
  );
};