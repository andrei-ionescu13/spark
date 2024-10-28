import { useFormik } from "formik";
import * as Yup from "yup";
import { FC } from "react";
import { Box, FormHelperText, Grid, Link, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { AlertDialog, AlertDialogProps } from "../../../components/alert-dialog";
import { TextInput } from "../../../components/text-input";
import { useUpdateFeature } from "@/api/features";
import { Feature } from "../../../types/feature";

interface FeatureDuplicateDialogProps
  extends Omit<AlertDialogProps, "title" | "onSubmit" | "isLoading"> {
  Feature: Feature;
}

const ToastSuccess = (id: string) => (
  <Box>
    <Typography variant="body1" color="textPrimary">
      Feature updated
    </Typography>
  </Box>
);

export const FeatureUpdateDialog: FC<FeatureDuplicateDialogProps> = (props) => {
  const { onClose, Feature, ...rest } = props;
  const queryClient = useQueryClient();
  const updateFeature = useUpdateFeature(Feature._id, () =>
    queryClient.invalidateQueries({ queryKey: ["features"] })
  );

  const formik = useFormik({
    initialValues: {
      name: Feature.name,
      slug: Feature.slug,
    },
    validationSchema: Yup.object({
      name: Yup.string().required(),
      slug: Yup.string().required(),
    }),
    onSubmit: (values) => {
      updateFeature.mutate(values, {
        onSuccess: ({ name }) => {
          onClose();
          toast.success(ToastSuccess(name));
        },
      });
    },
  });

  return (
    <AlertDialog
      onSubmit={formik.handleSubmit}
      onClose={onClose}
      title={`Update feature`}
      isLoading={updateFeature.isPending}
      {...rest}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextInput
            error={!!formik.touched.name && !!formik.errors.name}
            fullWidth
            helperText={formik.touched.name && (formik.errors.name as string)}
            id="name"
            label="Name"
            name="name"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.name}
          />
        </Grid>
        <Grid item xs={12}>
          <TextInput
            error={!!formik.touched.slug && !!formik.errors.slug}
            fullWidth
            helperText={formik.touched.slug && (formik.errors.slug as string)}
            id="slug"
            label="Slug"
            name="slug"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.slug}
          />
        </Grid>
        {updateFeature.isError && (
          <Grid item xs={12}>
            <FormHelperText error>
              {updateFeature.error?.message}
            </FormHelperText>
          </Grid>
        )}
      </Grid>
    </AlertDialog>
  );
};
