import { useCreatePlatform, useUpdatePlatform } from '@/api/platforms';
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
import { ImageUpdate } from '../[id]/(page)/product-cover';

interface PlatformDialogProps {
  open: boolean;
  onClose: any;
  mode?: 'create' | 'edit';
  platform?: any;
}

export const PlatformDialog: FC<PlatformDialogProps> = (props) => {
  const { open, onClose, platform, mode = 'create' } = props;
  const queryClient = useQueryClient();
  const createPlatform = useCreatePlatform(() =>
    queryClient.invalidateQueries({ queryKey: ['platforms'] })
  );
  const updatePlatform = useUpdatePlatform(() =>
    queryClient.invalidateQueries({ queryKey: ['platforms'] })
  );

  const formik = useFormik({
    initialValues: {
      name: platform?.name || '',
      logo: platform?.logo.url || undefined,
    },
    validationSchema: Yup.object({
      name: Yup.string().max(255).required(),
      logo: Yup.mixed().required('File is required'),
    }),
    onSubmit: (values) => {
      const formData = buildFormData(values);

      if (mode === 'create') {
        createPlatform.mutate(formData, {
          onSuccess: () => {
            onClose();
          },
        });
        return;
      }

      if (platform) {
        updatePlatform.mutate(
          { id: platform._id, body: formData },
          {
            onSuccess: () => {
              onClose();
            },
          }
        );
      }
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{mode === 'create' ? 'Add' : 'Update'} platform</DialogTitle>
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
            {mode === 'edit' ? (
              <ImageUpdate
                url={formik.values.logo}
                alt=""
                onFileSelect={(file: any) => {
                  formik.setFieldValue('logo', file);
                }}
              />
            ) : (
              <ImageDropzone
                file={formik.values.logo}
                onDrop={(file: any) => formik.setFieldValue('logo', file)}
              />
            )}

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
          isLoading={createPlatform.isPending || updatePlatform.isPending}
        >
          {mode === 'create' ? 'Add' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
