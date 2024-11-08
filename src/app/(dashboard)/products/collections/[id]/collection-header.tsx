'use client';

import { ActionsItem } from '@/components/actions-menu';
import { AlertDialog } from '@/components/alert-dialog';
import { Label } from '@/components/label';
import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { EyeOff } from '@/icons/eye-off';
import { Trash } from '@/icons/trash';
import { Collection } from '@/types/collection';
import { getStatusFromInterval } from '@/utils/get-status-from-interval';
import { colors, Skeleton, useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { id } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useDeactivateCollection, useDeleteCollection } from '../api';
import { useGetCollectionQuery } from './api';

interface CollectionsHeaderProps {}

export const CollectionHeader: FC<CollectionsHeaderProps> = () => {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const router = useRouter();
  const { data: collection, isLoading } = useGetCollectionQuery();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog(false);
  const [
    deactivateDialogOpen,
    handleOpenDeactivateDialog,
    handleCloseDeactivateDialog,
  ] = useDialog(false);
  const deleteCollection = useDeleteCollection();
  const deactivateCollection = useDeactivateCollection();

  const status =
    collection &&
    getStatusFromInterval(collection.startDate, collection?.endDate);

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

  const handleDeletePromoCode = (collection: Collection): void => {
    deleteCollection.mutate(collection._id, {
      onSuccess: () => {
        router.push('/products/collections');
      },
    });
  };

  const handleDeactivatePromoCode = (collection: Collection): void => {
    deactivateCollection.mutate(collection._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['collection', id],
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
        title={collection && `Collection ${collection.title}`}
        isLoading={isLoading}
      >
        {status && <Label color={mappedColors[status]}>{status}</Label>}
        {isLoading && (
          <Skeleton
            variant="rounded"
            width={80}
            height={21}
          />
        )}
      </PageHeader>
      {collection && (
        <>
          <AlertDialog
            open={deleteDialogOpen}
            onClose={handleCloseDeleteDialog}
            title={`Delete collection`}
            content="Are you sure you want to delete this collection?"
            onSubmit={() => {
              handleDeletePromoCode(collection);
            }}
            isLoading={deleteCollection.isPending}
          />
          <AlertDialog
            open={deactivateDialogOpen}
            onClose={handleCloseDeactivateDialog}
            title={`Deactivate collection`}
            content="Are you sure you want to deactivate this collection?"
            onSubmit={() => {
              handleDeactivatePromoCode(collection);
            }}
            isLoading={deactivateCollection.isPending}
          />
        </>
      )}
    </>
  );
};
