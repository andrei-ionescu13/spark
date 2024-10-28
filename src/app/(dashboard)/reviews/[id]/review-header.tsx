import { useDeleteReview } from '@/api/reviews';
import { AlertDialog } from '@/components/alert-dialog';
import { Label } from '@/components/label';
import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { Trash } from '@/icons/trash';
import { Review } from '@/types/review';
import { colors, Skeleton, useTheme } from '@mui/material';
import router from 'next/router';
import type { FC } from 'react'

interface ReviewHeaderProps {
  review?: Review;
  isLoading: boolean;
}

interface Status {
  label: string;
  value: string;
}

export const ReviewHeader: FC<ReviewHeaderProps> = (props) => {
  const { review, isLoading } = props;
  const theme = useTheme();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog();
  const deleteReview = useDeleteReview();
  const handleDeleteReview = (review: Review): void => {
    deleteReview.mutate(review._id, {
      onSuccess: () => {
        router.push("/reviews");
      },
    });
  };
  const mappedColors: Record<Status["value"], string> = {
    unpublished: colors.grey[500],
    published: theme.palette.success.main,
    flagged: theme.palette.error.main,
  };

  return (
    <>
      <PageHeader
        backHref="/review"
        backLabel="Reviews"
        title={"Review"}
        action={{
          icon: Trash,
          color: "error",
          label: "Delete",
          onClick: handleOpenDeleteDialog,
        }}
      >
        {review && <Label color={mappedColors[review.status]}>{review.status}</Label>}
        {isLoading && (<Skeleton variant="rounded" width={80} height={21} />)}
      </PageHeader>
      {!!review && (
        <AlertDialog
          open={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          title="Delete review"
          content="Are you sure you want to delete this review?"
          onSubmit={() => { handleDeleteReview(review) }}
          isLoading={deleteReview.isPending}
        />
      )}
    </>
  )
};
