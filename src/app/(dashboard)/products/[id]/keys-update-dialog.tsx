import type { FC } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Key } from "../../../types/keys";
import { yellow } from "@mui/material/colors";
import { Button } from "../../../components/button";
import { TextInput } from "../../../components/text-input";

interface KeysUpdateDialogProps {
  open: boolean;
  onClose: any;
  productKey: Key;
}

export const KeysUpdateDialog: FC<KeysUpdateDialogProps> = (props) => {
  const { open, onClose, productKey } = props;
  const theme = useTheme();

  const statusOptions = [
    {
      label: "Revealed",
      value: "revealed",
      color: theme.palette.success.main,
    },
    {
      label: "Secret",
      value: "secret",
      color: yellow[500],
    },
    {
      label: "Reported",
      value: "reported",
      color: theme.palette.error.main,
    },
  ];

  const formik = useFormik({
    initialValues: {
      key: productKey.value,
      status: productKey.status,
    },
    validationSchema: Yup.object({
      key: Yup.string()
        .max(512, "Must be 512 characters or less")
        .required("Required"),
      status: Yup.string()
        .oneOf(statusOptions.map((option) => option.value))
        .required(),
    }),
    onSubmit: (values) => { },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update key</DialogTitle>
      <DialogContent sx={{ py: "24px !important" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextInput
              size="small"
              error={!!formik.touched.key && !!formik.errors.key}
              helperText={formik.touched.key && formik.errors.key}
              fullWidth
              id="key"
              label="Key"
              name="key"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.key}
            />
          </Grid>
          <Grid item xs={12}>
            <TextInput
              select
              id="status"
              label="Status"
              name="status"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.status}
              size="small"
              fullWidth
            >
              {statusOptions.map((status) => (
                <MenuItem value={status.value} key={status.value}>
                  <MenuItem color={status.color}>{status.label}</MenuItem>
                </MenuItem>
              ))}
            </TextInput>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="text" color="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={() => formik.handleSubmit()}
          variant="contained"
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};
