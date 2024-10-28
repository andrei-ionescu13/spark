import { useUpdateReviewStatus } from '@/api/reviews';
import { Button } from '@/components/button';
import { Review } from '@/types/review';
import { Box, Card, CardContent, CardHeader, colors, Divider, FormControl, FormHelperText, MenuItem, Select, useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import type { FC } from 'react'
import { toast } from 'react-toastify';
import * as Yup from "yup";

interface ReviewStatusProps {
  review: Review;
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


export const ReviewStatus: FC<ReviewStatusProps> = (props) => {
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
