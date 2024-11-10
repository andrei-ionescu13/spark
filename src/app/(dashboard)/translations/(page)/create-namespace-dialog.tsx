import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import type { FC } from 'react';
import * as Yup from 'yup';
import { Button } from '../../../components/button';
import { TextInput } from '../../../components/text-input';
import { useCreateNamespace } from './api';

interface CreateNamespaceDialogProps {
  open: boolean;
  onClose: () => void;
}

export const CreateNamespaceDialog: FC<CreateNamespaceDialogProps> = (
  props
) => {
  const { open, onClose } = props;
  const queryClient = useQueryClient();
  const createNamespace = useCreateNamespace(() =>
    queryClient.invalidateQueries({ queryKey: ['namespaces'] })
  );

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      createNamespace.mutate(values, {
        onSuccess: () => {
          onClose();
        },
      });
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
    >
      <DialogTitle>Add namespace</DialogTitle>
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
              error={!!formik.touched.name && !!formik.errors.name}
              fullWidth
              helperText={formik.touched.name && (formik.errors.name as string)}
              label="Name"
              name="name"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              size="small"
              value={formik.values.name}
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
          variant="contained"
          color="primary"
          onClick={() => formik.handleSubmit()}
          isLoading={createNamespace.isPending}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};
