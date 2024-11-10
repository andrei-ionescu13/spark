import { Button } from '@/components/button';
import { TextInput } from '@/components/text-input';
import { Platform } from '@/types/platforms';
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
import { useUpdatePlatform } from './api';

interface UpdatePlatformDialogProps {
  open: boolean;
  onClose: any;
  platform: Platform;
}

export const UpdatePlatformDialog: FC<UpdatePlatformDialogProps> = (props) => {
  const { open, onClose, platform } = props;
  const queryClient = useQueryClient();

  const updatePlatform = useUpdatePlatform(() =>
    queryClient.invalidateQueries({ queryKey: ['platforms'] })
  );

  const handleUpdatePlatform = (formData: FormData) => {
    updatePlatform.mutate(
      { id: platform._id, body: formData },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const formik = useFormik({
    initialValues: {
      name: platform?.name,
      logo: platform?.logo.url,
    },
    validationSchema: Yup.object({
      name: Yup.string().max(255).required(),
      logo: Yup.mixed().required('File is required'),
    }),
    onSubmit: (values) => {
      const formData = buildFormData(values);
      handleUpdatePlatform(formData);
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Update platform</DialogTitle>
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
              label="Platform"
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
          isLoading={updatePlatform.isPending}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};
