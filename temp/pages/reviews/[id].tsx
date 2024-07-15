import type { FC } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import type { GetServerSideProps } from "next";
import { toast } from "react-toastify";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  colors,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Rating,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import { AlertDialog } from "../../../src/app/components/alert-dialog";
import { PageHeader } from "../../../src/app/components/page-header";
import { Trash as TrashIcon } from "../../../src/app/icons/trash";
import { useDialog } from "../../../src/app/hooks/useDialog";
import { Link } from "../../../src/app/components/link";
import { dehydrate, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Review as ReviewI } from "../../../src/app/types/review";
import { formatDate } from "../../../src/app/utils/format-date";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "../../../src/app/components/button";
import { useDeleteReview, useUpdateReviewStatus } from "@/api/reviews";
import { appFetch } from "../../../src/app/utils/app-fetch";
import { Label } from "../../../src/app/components/label";
import Image from "next/image";

interface ProductStatusProps {
  review: ReviewI;
}

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

export const ReviewStatus: FC<ProductStatusProps> = (props) => {
  const { review } = props;
  const theme = useTheme();
  const queryClient = useQueryClient();
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
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["reviews", review._id] });
          toast.success("Review updated");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });
    },
  });

  const mappedColors: Record<Status["value"], string> = {
    unpublished: colors.grey[500],
    published: theme.palette.success.main,
    flagged: theme.palette.error.main,
  };

  const isDisabled = review.status === formik.values.status;

  return (
    <Card>
      <CardHeader title="Status" />
      <Divider />
      <CardContent>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "9fr 3fr",
            gap: 1,
          }}
        >
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
          <Button
            fullWidth
            color="primary"
            variant="contained"
            isLoading={updateReviewStatus.isPending}
            disabled={isDisabled}
            onClick={() => {
              formik.handleSubmit();
            }}
          >
            Update
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const getReview =
  (id: string, config: Record<string, any> = {}) =>
    () =>
      appFetch<ReviewI>({
        url: `/reviews/${id}`,
        withAuth: true,
        ...config,
      });

const Review: FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog();
  const { id } = router.query as { id: string };
  const { data: review } = useQuery({
    queryKey: ["reviews", id],
    queryFn: getReview(id)
  });
  const deleteReview = useDeleteReview();

  if (!review) return null;

  const handleDeleteReview = () => {
    deleteReview.mutate(id, {
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
      <AlertDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        title="Delete review"
        content="Are you sure you want to delete this review?"
        onSubmit={handleDeleteReview}
        isLoading={deleteReview.isPending}
      />
      <Head>
        <title>Review</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <PageHeader
            backHref="/review"
            backLabel="Reviews"
            title={"Review"}
            action={{
              icon: TrashIcon,
              color: "error",
              label: "Delete",
              onClick: handleOpenDeleteDialog,
            }}
          >
            <Label color={mappedColors[review.status]}>{review.status}</Label>
          </PageHeader>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Card>
                <Box
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <Rating value={review.rating} readOnly />

                  <Typography color="textSecondary" variant="body2">
                    {formatDate(review.createdAt)}
                  </Typography>
                  <Typography color="textPrimary" variant="body2">
                    {review.content}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ p: 2 }}>
                  <Typography color="textPrimary" variant="body2">
                    {`By ${review.userName} `}(
                    <Link
                      color="primary"
                      variant="inherit"
                      underline="hover"
                      href={`/users/${review.user._id}`}
                    >
                      {review.user.email}
                    </Link>
                    )
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={4} container spacing={2}>
              <Grid item xs={12}>
                <ReviewStatus review={review} />
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    <Typography color="textPrimary" variant="subtitle1">
                      Product details
                    </Typography>
                    <Image
                      src={review.product.cover.url}
                      alt={review.product.title}
                      layout="responsive"
                      width={16}
                      height={9}
                      priority
                    />
                    <Link
                      color="primary"
                      variant="body1"
                      underline="hover"
                      href={`/products/${review.product._id}`}
                    >
                      {review.product.title}
                    </Link>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                      }}
                    >
                      <Rating value={review.product.rating.average} readOnly />
                      <Link
                        color="textSecondary"
                        variant="body2"
                        underline="hover"
                        href={`/products/${review.product._id}/reviews`}
                      >
                        {review.product.reviews.length} reviews
                      </Link>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
  req,
  res,
}) => {
  const { id } = query as { id: string };
  const queryClient = new QueryClient();

  try {
    await queryClient.fetchQuery({
      queryKey: ["reviews", id],
      queryFn: getReview(id, { req, res })
    });
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Review;
