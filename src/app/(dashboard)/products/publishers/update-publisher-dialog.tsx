import { Button } from '@/components/button';
import { TextInput } from '@/components/text-input';
import { Publisher } from '@/types/publishers';
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
import { ImageUpdate } from '../../../components/image-update';
import { buildFormData } from '../../../utils/build-form-data';
import { useUpdatePublisher } from './api';

interface UpdatePublisherDialogProps {
  open: boolean;
  onClose: any;
  publisher: Publisher;
}

export const UpdatePublisherDialog: FC<UpdatePublisherDialogProps> = (
  props
) => {
  const { open, onClose, publisher } = props;
  const queryClient = useQueryClient();

  const updatePublisher = useUpdatePublisher(() =>
    queryClient.invalidateQueries({ queryKey: ['publishers'] })
  );

  const handleUpdatePublisher = (formData: FormData) => {
    updatePublisher.mutate(
      { id: publisher._id, body: formData },
      {
        onSuccess: onClose,
      }
    );
  };

  const formik = useFormik({
    initialValues: {
      name: publisher?.name,
      slug: publisher?.slug,
      logo: publisher?.logo.url,
    },
    validationSchema: Yup.object({
      name: Yup.string().max(255).required(),
      slug: Yup.string().max(255),
      logo: Yup.mixed().required('File is required'),
    }),
    onSubmit: (values) => {
      const formData = buildFormData(values);
      handleUpdatePublisher(formData);
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Update publisher</DialogTitle>
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
            <ImageUpdate
              url={formik.values.logo}
              alt=""
              onFileSelect={(file: any) => {
                formik.setFieldValue('logo', file);
              }}
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
          isLoading={updatePublisher.isPending}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};
