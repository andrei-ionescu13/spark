import { useFormik } from "formik";
import * as Yup from "yup";
import { FC } from "react";
import { Box, FormHelperText, Grid, Link, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { AlertDialog, AlertDialogProps } from "@/components/alert-dialog";
import { TextInput } from "@/components/text-input";
import { useUpdateOperatingSystem } from "@/api/operating-systems";
import { OperatingSystem } from "@/types/operating-sistem";

interface OperatingSystemDuplicateDialogProps
  extends Omit<AlertDialogProps, "title" | "onSubmit" | "isLoading"> {
  OperatingSystem: OperatingSystem;
}

const ToastSuccess = (id: string) => (
  <Box>
    <Typography variant="body1" color="textPrimary">
      OperatingSystem updated
    </Typography>
  </Box>
);

export const OperatingSystemUpdateDialog: FC<
  OperatingSystemDuplicateDialogProps
> = (props) => {
  const { onClose, OperatingSystem, ...rest } = props;
  const queryClient = useQueryClient();
  const updateOperatingSystem = useUpdateOperatingSystem(
    OperatingSystem._id,
    () => queryClient.invalidateQueries({ queryKey: ["operatingSystems"] })
  );

  const formik = useFormik({
    initialValues: {
      name: OperatingSystem.name,
      slug: OperatingSystem.slug,
    },
    validationSchema: Yup.object({
      name: Yup.string().required(),
      slug: Yup.string().required(),
    }),
    onSubmit: (values) => {
      updateOperatingSystem.mutate(values, {
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
      title={`Update operatingSystem`}
      isLoading={updateOperatingSystem.isPending}
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
        {updateOperatingSystem.isError && (
          <Grid item xs={12}>
            <FormHelperText error>
              {updateOperatingSystem.error?.message}
            </FormHelperText>
          </Grid>
        )}
      </Grid>
    </AlertDialog>
  );
};
