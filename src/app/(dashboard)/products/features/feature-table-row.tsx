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
import { Feature } from '../../../types/feature';
import { useDeleteFeature } from './api';
import { FeatureUpdateDialog } from './feature-update-dialog';

interface FeaturesTableRowProps {
  feature: Feature;
  onSelect: () => void;
  selected: boolean;
}

export const FeaturesTableRow: FC<FeaturesTableRowProps> = (props) => {
  const { feature, selected, onSelect } = props;
  const queryClient = useQueryClient();

  const [openDeleteDialog, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog();
  const [updateDialogOpen, handleOpenUpdateDialog, handleCloseUpdateDialog] =
    useDialog();

  const deleteFeature = useDeleteFeature(() =>
    queryClient.invalidateQueries({ queryKey: ['features'] })
  );

  const handleDeleteFeature = () => {
    deleteFeature.mutate(feature._id, {
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
        <FeatureUpdateDialog
          Feature={feature}
          open
          onClose={handleCloseUpdateDialog}
        />
      )}
      <AlertDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        title="Delete feature"
        content="Are you sure you want to delete this feature?"
        onSubmit={handleDeleteFeature}
        isLoading={deleteFeature.isPending}
      />
      <DataTableRow
        key={feature._id}
        selected={selected}
      >
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            onChange={onSelect}
            checked={selected}
          />
        </TableCell>
        <TableCell>{feature.name}</TableCell>
        <TableCell>{feature.slug}</TableCell>
        <TableCell align="right">
          <ActionsIconButton items={actionItems} />
        </TableCell>
      </DataTableRow>
    </>
  );
};
