import { Button } from '@/components/button';
import { ImageDropzone } from '@/components/image-dropzone';
import { TextInput } from '@/components/text-input';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  Typography,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import type { FC } from 'react';
import * as Yup from 'yup';
import { buildFormData } from '../../../utils/build-form-data';
import { useCreatePublisher } from './api';

interface CreatePublisherDialogProps {
  open: boolean;
  onClose: any;
}

export const CreatePublisherDialog: FC<CreatePublisherDialogProps> = (
  props
) => {
  const { open, onClose } = props;
  const queryClient = useQueryClient();
  const createPublisher = useCreatePublisher(() =>
    queryClient.invalidateQueries({ queryKey: ['publishers'] })
  );

  const handleSubmit = (formData: FormData) => {
    createPublisher.mutate(formData, {
      onSuccess: onClose,
    });
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      slug: '',
      logo: undefined,
    },
    validationSchema: Yup.object({
      name: Yup.string().max(255).required(),
      slug: Yup.string().max(255),
      logo: Yup.mixed().required('File is required'),
    }),
    onSubmit: (values) => {
      const formData = buildFormData(values);
      handleSubmit(formData);
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Add publisher</DialogTitle>
      <DialogContent sx={{ py: '24px !important' }}>
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            xs={12}
          >
            <TextInput
              size="small"
              error={!!formik.touched.name && !!formik.errors.name}
              helperText={formik.touched.name && (formik.errors.name as string)}
              fullWidth
              id="name"
              label="Publisher"
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
              size="small"
              error={!!formik.touched.slug && !!formik.errors.slug}
              helperText={formik.touched.slug && (formik.errors.slug as string)}
              fullWidth
              id="slug"
              label="Slug"
              name="slug"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.slug}
            />
          </Grid>
          <Grid
            item
            xs={12}
          >
            <Typography
              color="textPrimary"
              variant="subtitle2"
            >
              Logo
            </Typography>
            <ImageDropzone
              file={formik.values.logo}
              onDrop={(file: any) => formik.setFieldValue('logo', file)}
            />
            {!!formik.touched.logo && !!formik.errors.logo && (
              <FormHelperText error>
                {formik.errors.logo as string}
              </FormHelperText>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="text"
          color="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={() => {
            formik.handleSubmit();
          }}
          variant="contained"
          isLoading={createPublisher.isPending}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};
