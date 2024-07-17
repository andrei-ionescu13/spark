"use client"

import { ActionsItem } from '@/components/actions-menu';
import { EyeOff } from '@/icons/eye-off';
import { Trash } from '@/icons/trash';
import type { FC } from 'react'
import { useGetCollectionQuery } from '../../api-calls-hooks';
import { colors, useTheme } from '@mui/material';
import { useDeleteCollection, useDeactivateCollection } from '@/api/collections';
import { AlertDialog } from '@/components/alert-dialog';
import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { getStatusFromInterval } from '@/utils/get-status-from-interval';
import { id } from 'date-fns/locale';
import { useQueryClient } from '@tanstack/react-query';
import { Label } from '@/components/label';
import { useRouter } from 'next/navigation';

interface CollectionsHeaderProps {

}

export const CollectionHeader: FC<CollectionsHeaderProps> = () => {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const router = useRouter();
  const { data: collection } = useGetCollectionQuery();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog(false);
  const [
    deactivateDialogOpen,
    handleOpenDeactivateDialog,
    handleCloseDeactivateDialog,
  ] = useDialog(false);
  const deleteCollection = useDeleteCollection();
  const deactivateCollection = useDeactivateCollection();
  if (!collection) return null;

  const status = getStatusFromInterval(
    collection.startDate,
    collection?.endDate
  );

  const mappedColors = {
    scheduled: colors.grey[500],
    active: theme.palette.success.main,
    expired: theme.palette.error.main,
  };

  const actionItems: ActionsItem[] = [
    {
      label: "Deactivate",
      icon: EyeOff,
      onClick: handleOpenDeactivateDialog,
    },
    {
      label: "Delete",
      icon: Trash,
      onClick: handleOpenDeleteDialog,
      color: "error",
    },
  ];

  const handleDeletePromoCode = (): void => {
    deleteCollection.mutate(collection._id, {
      onSuccess: () => {
        router.push("/products/collections");
      },
    });
  };

  const handleDeactivatePromoCode = (): void => {
    deactivateCollection.mutate(collection._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["collection", id]
        });
        handleCloseDeactivateDialog();
      },
    });
  };

  return (
    <>
      <PageHeader
        actions={actionItems}
        backHref="/products/collections"
        backLabel="Collections"
        title="Collection"
      >
        <Label color={mappedColors[status]}>{status}</Label>
      </PageHeader>
      <AlertDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        title={`Delete collection`}
        content="Are you sure you want to delete this collection?"
        onSubmit={handleDeletePromoCode}
        isLoading={deleteCollection.isPending}
      />
      <AlertDialog
        open={deactivateDialogOpen}
        onClose={handleCloseDeactivateDialog}
        title={`Deactivate collection`}
        content="Are you sure you want to deactivate this collection?"
        onSubmit={handleDeactivatePromoCode}
        isLoading={deactivateCollection.isPending}
      />
    </>

  )
};
