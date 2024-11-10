import { Button } from '@/components/button';
import { TextInput } from '@/components/text-input';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material';
import { useFormik } from 'formik';
import type { FC } from 'react';
import * as Yup from 'yup';
import { Genre } from '../../../types/genres';

interface GenreDialogProps {
  open: boolean;
  onClose: any;
  genre?: Genre;
  isPending: boolean;
  onSubmit: (values: { name: string; slug: string }) => void;
}

export const GenreDialog: FC<GenreDialogProps> = (props) => {
  const { open, onClose, genre, isPending, onSubmit } = props;

  const formik = useFormik({
    initialValues: {
      name: genre?.name || '',
      slug: genre?.slug || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().max(255).required(),
      slug: Yup.string().max(255),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{!genre ? 'Add' : 'Update'} genre</DialogTitle>
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
              label="Genre"
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
          isLoading={isPending}
          onClick={() => {
            formik.handleSubmit();
          }}
          variant="contained"
        >
          {!genre ? 'Add' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
