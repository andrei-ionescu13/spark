import { useCreateFeature } from '@/api/features';
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

interface FeatureCreateDialogProps
  extends Omit<AlertDialogProps, 'title' | 'onSubmit' | 'isLoading'> {}

const ToastSuccess = () => (
  <Box>
    <Typography
      variant="body1"
      color="textPrimary"
    >
      Feature created
    </Typography>
  </Box>
);

export const FeatureCreateDialog: FC<FeatureCreateDialogProps> = (props) => {
  const { onClose, ...rest } = props;
  const queryClient = useQueryClient();
  const createFeature = useCreateFeature(() =>
    queryClient.invalidateQueries({ queryKey: ['features'] })
  );

  const formik = useFormik({
    initialValues: {
      name: '',
      slug: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required(),
      slug: Yup.string(),
    }),
    onSubmit: (values) => {
      createFeature.mutate(values, {
        onSuccess: () => {
          onClose();
          toast.success(ToastSuccess());
        },
      });
    },
  });

  return (
    <AlertDialog
      onSubmit={formik.handleSubmit}
      onClose={onClose}
      title={`Create feature`}
      isLoading={createFeature.isPending}
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
            info="If a slug is not provided, one will be generated"
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
        {createFeature.error?.message && (
          <Grid
            item
            xs={12}
          >
            <FormHelperText error>
              {createFeature.error?.message}
            </FormHelperText>
          </Grid>
        )}
      </Grid>
    </AlertDialog>
  );
};
