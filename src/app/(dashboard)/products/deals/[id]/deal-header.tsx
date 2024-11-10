'use client';

import { ActionsItem } from '@/components/actions-menu';
import { AlertDialog } from '@/components/alert-dialog';
import { Label } from '@/components/label';
import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { EyeOff } from '@/icons/eye-off';
import { Trash } from '@/icons/trash';
import { Deal } from '@/types/deal';
import { getStatusFromInterval } from '@/utils/get-status-from-interval';
import { colors, Skeleton, useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { id } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useDeactivateDeal, useDeleteDeal } from '../api';
import { useGetDealQuery } from './api';

interface DealsHeaderProps {}

export const DealHeader: FC<DealsHeaderProps> = () => {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const router = useRouter();
  const { data: deal, isLoading } = useGetDealQuery();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog(false);
  const [
    deactivateDialogOpen,
    handleOpenDeactivateDialog,
    handleCloseDeactivateDialog,
  ] = useDialog(false);
  const deleteDeal = useDeleteDeal();
  const deactivateDeal = useDeactivateDeal();

  const status = deal && getStatusFromInterval(deal.startDate, deal?.endDate);

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

  const handleDeletePromoCode = (deal: Deal): void => {
    deleteDeal.mutate(deal._id, {
      onSuccess: () => {
        router.push('/products/deals');
      },
    });
  };

  const handleDeactivatePromoCode = (deal: Deal): void => {
    deactivateDeal.mutate(deal._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['deal', id],
        });
        handleCloseDeactivateDialog();
      },
    });
  };

  return (
    <>
      <PageHeader
        actions={actionItems}
        backHref="/products/deals"
        backLabel="Deals"
        title={deal && `Deal ${deal.title}`}
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
      {deal && (
        <>
          <AlertDialog
            open={deleteDialogOpen}
            onClose={handleCloseDeleteDialog}
            title={`Delete deal`}
            content="Are you sure you want to delete this deal?"
            onSubmit={() => {
              handleDeletePromoCode(deal);
            }}
            isLoading={deleteDeal.isPending}
          />
          <AlertDialog
            open={deactivateDialogOpen}
            onClose={handleCloseDeactivateDialog}
            title={`Deactivate deal`}
            content="Are you sure you want to deactivate this deal?"
            onSubmit={() => {
              handleDeactivatePromoCode(deal);
            }}
            isLoading={deactivateDeal.isPending}
          />
        </>
      )}
    </>
  );
};
