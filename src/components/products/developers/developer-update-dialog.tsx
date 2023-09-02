import { useFormik } from "formik";
import * as Yup from "yup";
import { FC } from "react";
import { Box, FormHelperText, Grid, Link, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";
import { AlertDialog, AlertDialogProps } from "@/components/alert-dialog";
import { TextInput } from "@/components/text-input";
import { useUpdateDeveloper } from "@/api/developers";
import { Developer } from "@/types/developer";

interface DeveloperDuplicateDialogProps
  extends Omit<AlertDialogProps, "title" | "onSubmit" | "isLoading"> {
  Developer: Developer;
}

const ToastSuccess = (id: string) => (
  <Box>
    <Typography variant="body1" color="textPrimary">
      Developer updated
    </Typography>
  </Box>
);

export const DeveloperUpdateDialog: FC<DeveloperDuplicateDialogProps> = (
  props
) => {
  const { onClose, Developer, ...rest } = props;
  const queryClient = useQueryClient();
  const updateDeveloper = useUpdateDeveloper(Developer._id, () =>
    queryClient.invalidateQueries("developers")
  );

  const formik = useFormik({
    initialValues: {
      name: Developer.name,
      slug: Developer.slug,
    },
    validationSchema: Yup.object({
      name: Yup.string().required(),
      slug: Yup.string().required(),
    }),
    onSubmit: (values) => {
      updateDeveloper.mutate(values, {
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
      title={`Update developer`}
      isLoading={updateDeveloper.isLoading}
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
        {updateDeveloper.isError && (
          <Grid item xs={12}>
            <FormHelperText error>
              {updateDeveloper.error?.message}
            </FormHelperText>
          </Grid>
        )}
      </Grid>
    </AlertDialog>
  );
};
