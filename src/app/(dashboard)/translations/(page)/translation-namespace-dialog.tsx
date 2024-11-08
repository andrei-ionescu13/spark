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
import { useCreateNamespace, useUpdateNamespaceName } from './api';

interface TranslationNamespaceDialogProps {
  namespace?: any;
  open: boolean;
  onClose: () => void;
  mode?: 'edit' | 'create';
}

export const TranslationNamespaceDialog: FC<TranslationNamespaceDialogProps> = (
  props
) => {
  const { namespace, open, onClose, mode = 'create' } = props;
  const queryClient = useQueryClient();
  const createNamespace = useCreateNamespace(() =>
    queryClient.invalidateQueries({ queryKey: ['namespaces'] })
  );
  const updateNamespaceName = useUpdateNamespaceName(() =>
    queryClient.invalidateQueries({ queryKey: ['namespaces'] })
  );

  const formik = useFormik({
    initialValues: {
      name: namespace?.name || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      if (mode === 'create') {
        createNamespace.mutate(values, {
          onSuccess: () => {
            onClose();
          },
        });

        return;
      }
      updateNamespaceName.mutate(
        { id: namespace?._id, name: values.name },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
    >
      <DialogTitle>
        {`${mode === 'create' ? 'Add' : 'Edit'} translation group`}
      </DialogTitle>
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
          isLoading={createNamespace.isPending || updateNamespaceName.isPending}
        >
          {mode === 'create' ? 'Add' : 'Edit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
