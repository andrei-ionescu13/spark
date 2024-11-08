import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  useTheme,
} from '@mui/material';
import { useFormik } from 'formik';
import type { FC } from 'react';
import * as Yup from 'yup';
import { Button } from '../../../components/button';
import type { StatusOption } from '../../../components/status';
import { StatusSelect } from '../../../components/status';
import { Key } from '../../../types/keys';
import { useUpdateKeyStatus } from '../api';

interface KeysUpdateDialogProps {
  open: boolean;
  onClose: any;
  productKey: Key;
  refetch: () => Promise<any>;
}

export const KeysUpdateDialog: FC<KeysUpdateDialogProps> = (props) => {
  const { open, onClose, productKey, refetch } = props;
  const theme = useTheme();
  const updateKeyStatus = useUpdateKeyStatus(productKey._id);

  const statusOptions: StatusOption[] = [
    {
      label: 'Revealed',
      value: 'revealed',
      color: theme.palette.success.main,
    },
    {
      label: 'Reported',
      value: 'reported',
      color: theme.palette.error.main,
    },
  ];

  const formik = useFormik({
    initialValues: {
      status: undefined,
    },
    validationSchema: Yup.object({
      status: Yup.string()
        .oneOf(statusOptions.map((option) => option.value))
        .required(),
    }),
    onSubmit: ({ status }) => {
      if (!status) return;

      updateKeyStatus.mutate(status, {
        onSuccess: async () => {
          await refetch();
          onClose();
        },
      });
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Update status</DialogTitle>
      <DialogContent sx={{ py: '24px !important' }}>
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            xs={12}
          >
            <StatusSelect
              id="status"
              name="status"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.status}
              size="small"
              fullWidth
              options={statusOptions}
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
          onClick={() => formik.handleSubmit()}
          variant="contained"
          disabled={updateKeyStatus.isPending}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};
