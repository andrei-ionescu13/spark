import { Box, FormHelperText, Grid, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { FC } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import {
  AlertDialog,
  AlertDialogProps,
} from '../../../components/alert-dialog';
import { TextInput } from '../../../components/text-input';
import { Developer } from '../../../types/developer';
import { useUpdateDeveloper } from './api';

interface DeveloperDuplicateDialogProps
  extends Omit<AlertDialogProps, 'title' | 'onSubmit' | 'isLoading'> {
  developer: Developer;
}

const ToastSuccess = (id: string) => (
  <Box>
    <Typography
      variant="body1"
      color="textPrimary"
    >
      Developer updated
    </Typography>
  </Box>
);

export const DeveloperUpdateDialog: FC<DeveloperDuplicateDialogProps> = (
  props
) => {
  const { onClose, developer, ...rest } = props;
  const queryClient = useQueryClient();
  const updateDeveloper = useUpdateDeveloper(developer._id, () =>
    queryClient.invalidateQueries({ queryKey: ['developers'] })
  );

  const formik = useFormik({
    initialValues: {
      name: developer.name,
      slug: developer.slug,
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
      isLoading={updateDeveloper.isPending}
      {...rest}
    >
      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          xs={12}
        >
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
        <Grid
          item
          xs={12}
        >
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
          <Grid
            item
            xs={12}
          >
            <FormHelperText error>
              {updateDeveloper.error?.message}
            </FormHelperText>
          </Grid>
        )}
      </Grid>
    </AlertDialog>
  );
};
