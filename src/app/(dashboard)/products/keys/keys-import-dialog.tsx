import { Box, FormHelperText, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import type { ChangeEvent, FC } from 'react';
import { useRef } from 'react';
import * as Yup from 'yup';
import { AlertDialog } from '../../../components/alert-dialog';
import { Button } from '../../../components/button';
import { Link } from '../../../components/link';
import { buildFormData } from '../../../utils/build-form-data';
import { useImportKeys } from '../api';

interface KeysImportDialogProps {
  open: boolean;
  onClose: () => void;
}

export const KeysImportDialog: FC<KeysImportDialogProps> = (props) => {
  const { open, onClose } = props;
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const importKeys = useImportKeys();

  const initialValues: { keys?: File } = {
    keys: undefined,
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      keys: Yup.mixed().required('File required'),
    }),
    onSubmit: (values) => {
      const formData = buildFormData(values);

      importKeys.mutate(formData, {
        onSuccess: () => {
          onClose();
          queryClient.invalidateQueries({ queryKey: ['keys'] });
        },
      });
    },
  });

  const handleSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0] && !event.target.files?.[0]) {
      return;
    }

    if (event.target.files[0]?.type !== 'application/json') {
      formik.setFieldError('keys', 'the file should be a json file');
      return;
    }

    formik.setFieldValue('keys', event.target.files[0]);
  };

  return (
    <AlertDialog
      open={open}
      onClose={onClose}
      title="Import keys"
      onSubmit={formik.handleSubmit}
      isLoading={importKeys.isPending}
      maxWidth="sm"
      fullWidth
      sx={{
        input: {
          display: 'none',
        },
      }}
    >
      <Box
        sx={{
          display: 'grid',
          placeItems: 'center',
          gap: 1,
        }}
      >
        <Typography
          color="textPrimary"
          variant="body1"
        >
          Please import a file (
          <Link
            color="textSecondary"
            variant="body1"
            href="https://res.cloudinary.com/desubtoqp/image/upload/v1655918415/products/Untitled_arihfo.png"
            target="_blank"
          >
            check format
          </Link>
          )
        </Typography>
        <input
          type="file"
          name="keys"
          onChange={handleSelectFile}
          ref={inputRef}
        />
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            inputRef.current?.click();
          }}
        >
          Import
        </Button>
        {!!formik.values.keys && (
          <Typography
            color="textPrimary"
            textAlign="center"
            variant="body2"
          >
            {formik.values.keys?.name}
            <br />
            <Typography
              color="textPrimary"
              textAlign="center"
              variant="subtitle1"
              component="span"
            >
              Loaded
            </Typography>
          </Typography>
        )}
        {!!formik.errors.keys && (
          <FormHelperText error>{formik.errors.keys}</FormHelperText>
        )}
      </Box>
    </AlertDialog>
  );
};
