import type { FC } from "react";
import {
  Checkbox,
  colors,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  MenuItem,
  Rating,
  Select,
  TableCell,
  useTheme,
} from "@mui/material";
import { ActionsItem } from "@/components/actions-menu";
import { ActionsIconButton } from "@/components/icon-actions";
import { Link } from "@/components/link";
import { Pencil as PencilIcon } from "@/icons/pencil";
import { Trash as TrashIcon } from "@/icons/trash";
import { Upload as UploadIcon } from "@/icons/upload";
import { Label } from "@/components/label";
import { formatDate } from "@/utils/format-date";
import { DataTableRow } from "@/components/data-table-row";
import { toast } from "react-toastify";
import { useDialog } from "@/hooks/useDialog";
import type { Review } from "@/types/review";
import { useDeleteReview, useUpdateReviewStatus } from "@/api/reviews";
import { Button } from "@/components/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AlertDialog } from "@/components/alert-dialog";

interface Status {
  label: string;
  value: string;
}

const statusOptions: Status[] = [
  {
    label: "Published",
    value: "published",
  },
  {
    label: "Unpublished",
    value: "unpublished",
  },
  {
    label: "Flagged",
    value: "flagged",
  },
];

interface StatusUpdateProps {
  open: boolean;
  onClose: () => void;
  review: Review;
  refetch: any;
}

export const StatusUpdate: FC<StatusUpdateProps> = (props) => {
  const { open, onClose, review, refetch } = props;
  const theme = useTheme();
  const updateReviewStatus = useUpdateReviewStatus(review._id);

  const formik = useFormik({
    initialValues: {
      status: review.status,
    },
    validationSchema: Yup.object({
      status: Yup.string()
        .oneOf(statusOptions.map((status) => status.value))
        .required("Required"),
    }),
    onSubmit: (values) => {
      updateReviewStatus.mutate(values, {
        onSuccess: (status) => {
          refetch();
          onClose();
        },
        onError: (error) => {
          toast.error((error as Error).message);
        },
      });
    },
  });

  const mappedColors: Record<Status["value"], string> = {
    unpublished: colors.grey[500],
    published: theme.palette.success.main,
    flagged: theme.palette.error.main,
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update status</DialogTitle>
      <DialogContent>
        <FormControl
          error={!!formik.touched.status && !!formik.errors.status}
          fullWidth
          size="small"
        >
          <Select
            id="status"
            name="status"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.status}
          >
            {statusOptions.map((status) => (
              <MenuItem value={status.value} key={status.value}>
                <MenuItem color={mappedColors[status.value]}>
                  {status.label}
                </MenuItem>
              </MenuItem>
            ))}
          </Select>
          {!!formik.touched.status && !!formik.errors.status && (
            <FormHelperText>{formik.errors.status}</FormHelperText>
          )}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onClose} variant="text">
          Cancel
        </Button>
        <Button
          autoFocus
          color="primary"
          isLoading={updateReviewStatus.isLoading}
          onClick={() => formik.handleSubmit()}
          variant="contained"
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface RaviewTableRowProps {
  review: Review;
  onSelect: () => void;
  selected: boolean;
  showProduct?: boolean;
  showUser?: boolean;
  refetch: any;
}

export const RaviewTableRow: FC<RaviewTableRowProps> = (props) => {
  const {
    review,
    selected,
    onSelect,
    showProduct = true,
    showUser = true,
    refetch,
  } = props;
  const theme = useTheme();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog();
  const [updateDialogOpen, handleOpenUpdateDialog, handleCloseUpdateDialog] =
    useDialog();
  const deleteReview = useDeleteReview();

  const handleDeleteReview = () => {
    deleteReview.mutate(review._id, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const actionItems: ActionsItem[] = [
    {
      label: "Edit",
      icon: PencilIcon,
      onClick: handleOpenUpdateDialog,
    },
    {
      label: "Delete",
      icon: TrashIcon,
      onClick: handleOpenDeleteDialog,
      color: "error",
    },
  ];

  const mappedColors = {
    published: theme.palette.success.main,
    unpublished: colors.grey[500],
    flagged: theme.palette.error.main,
  };

  return (
    <>
      <AlertDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        title="Delete review"
        content="Are you sure you want to delete this review?"
        onSubmit={handleDeleteReview}
        isLoading={deleteReview.isLoading}
      />
      <StatusUpdate
        open={updateDialogOpen}
        onClose={handleCloseUpdateDialog}
        review={review}
        refetch={refetch}
      />
      <DataTableRow key={review._id} selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox color="primary" onChange={onSelect} checked={selected} />
        </TableCell>
        <TableCell>
          <Link
            color="textPrimary"
            variant="body1"
            underline="hover"
            href={`/reviews/${review._id}`}
          >
            {review._id}
          </Link>
        </TableCell>
        <TableCell>
          <Rating value={review.rating} readOnly />
        </TableCell>
        {showProduct && (
          <TableCell>
            <Link
              color="textPrimary"
              variant="body1"
              underline="hover"
              href={`/products/${review.product._id}`}
            >
              {review.product.title}
            </Link>
          </TableCell>
        )}
        {showUser && (
          <TableCell>
            <Link
              color="textPrimary"
              variant="body1"
              underline="hover"
              href={`/users/${review.user._id}`}
            >
              {review.user.email}
            </Link>
          </TableCell>
        )}
        <TableCell>{formatDate(review.createdAt)}</TableCell>
        <TableCell>
          <Label color={mappedColors[review.status]}>{review.status}</Label>
        </TableCell>
        <TableCell align="right">
          <ActionsIconButton items={actionItems} />
        </TableCell>
      </DataTableRow>
    </>
  );
};
