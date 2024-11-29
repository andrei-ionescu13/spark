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
import { Button } from '../../../components/button';
import { TextInput } from '../../../components/text-input';
import { Language, Translation } from '../../../types/translations';
import { useAddNamespaceTranslation } from './api';

interface CreateTranslationsDialogProps {
  open: boolean;
  onClose: () => void;
  namespaceId: string;
  languages: Language[];
}

export const CreateTranslationsDialog: FC<CreateTranslationsDialogProps> = (
  props
) => {
  const { open, onClose, namespaceId, languages } = props;
  const queryClient = useQueryClient();
  const addNamespaceTranslation = useAddNamespaceTranslation(() =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['namespace-translations'] }),
      queryClient.invalidateQueries({ queryKey: ['namespaces'] }),
    ])
  );

  const initialValues: Translation = languages.reduce(
    (acc, { code }) => {
      return {
        ...acc,
        [code]: '',
      };
    },
    { key: '' }
  );

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      addNamespaceTranslation.mutate(
        { id: namespaceId, body: values },
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
      <DialogTitle>Add translations</DialogTitle>
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
              error={!!formik.touched.key && !!formik.errors.key}
              fullWidth
              helperText={formik.touched.key && formik.errors.key}
              label="Key"
              name="key"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              size="small"
              value={formik.values.key}
            />
          </Grid>
          {languages.map((option) => (
            <Grid
              item
              xs={12}
              key={option.code}
            >
              <TextInput
                error={
                  !!formik.touched[option.code] && !!formik.errors[option.code]
                }
                fullWidth
                helperText={
                  formik.touched[option.code] && formik.errors[option.code]
                }
                label={option.name}
                name={option.code}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                size="small"
                value={formik.values[option.code]}
              />
            </Grid>
          ))}
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
          isLoading={addNamespaceTranslation.isPending}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};
