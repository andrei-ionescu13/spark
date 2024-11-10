import { ActionsItem } from '@/components/actions-menu';
import { AlertDialog } from '@/components/alert-dialog';
import { Label } from '@/components/label';
import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { EyeOff } from '@/icons/eye-off';
import { Trash } from '@/icons/trash';
import { Discount } from '@/types/discounts';
import { getStatusFromInterval } from '@/utils/get-status-from-interval';
import { colors, Skeleton, useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { id } from 'date-fns/locale';
import router from 'next/router';
import type { FC } from 'react';
import { useDeactivateDiscount, useDeleteDiscount } from '../api';

interface DiscountHeaderProps {
  discount?: Discount;
  isLoading: boolean;
}

export const DiscountHeader: FC<DiscountHeaderProps> = (props) => {
  const { discount, isLoading } = props;
  const theme = useTheme();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog(false);
  const [
    deactivateDialogOpen,
    handleOpenDeactivateDialog,
    handleCloseDeactivateDialog,
  ] = useDialog(false);
  const deleteDiscount = useDeleteDiscount();
  const deactivateDiscount = useDeactivateDiscount();
  const queryClient = useQueryClient();
  const mappedColors = {
    scheduled: colors.grey[500],
    active: theme.palette.success.main,
    expired: theme.palette.error.main,
  };
  const status =
    discount && getStatusFromInterval(discount.startDate, discount.endDate);
  const actionItems: ActionsItem[] = [
    {
      label: 'Deactivate',
      icon: EyeOff,
      onClick: handleOpenDeactivateDialog,
      disabled: status === 'expired',
    },
    {
      label: 'Delete',
      icon: Trash,
      onClick: handleOpenDeleteDialog,
      color: 'error',
    },
  ];

  const handleDeleteDiscount = (discount: Discount): void => {
    deleteDiscount.mutate(discount._id, {
      onSuccess: () => {
        router.push('/discounts');
      },
    });
  };

  const handleDeactivateDiscount = (discount: Discount): void => {
    deactivateDiscount.mutate(discount._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['discount', id],
        });
        handleCloseDeactivateDialog();
      },
    });
  };

  console.log(discount);
  return (
    <>
      <PageHeader
        actions={actionItems}
        backHref="/discounts"
        backLabel="Discounts"
        title="Discount"
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
      {discount && (
        <>
          <AlertDialog
            open={deleteDialogOpen}
            onClose={handleCloseDeleteDialog}
            title={`Delete discount`}
            content="Are you sure you want to delete this discount?"
            onSubmit={() => {
              handleDeleteDiscount(discount);
            }}
            isLoading={deleteDiscount.isPending}
          />
          <AlertDialog
            open={deactivateDialogOpen}
            onClose={handleCloseDeactivateDialog}
            title={`Deactivate discount`}
            content="Are you sure you want to deactivate this discount?"
            onSubmit={() => {
              handleDeactivateDiscount(discount);
            }}
            isLoading={deactivateDiscount.isPending}
          />
        </>
      )}
    </>
  );
};
