import type { FC } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateKey } from "@/api/keys";
import { useRouter } from "next/navigation";
import { Button } from "../../../../components/button";
import { appFetch } from "../../../../utils/app-fetch";
import type { Key } from "../../../../types/keys";
import { TextInput } from "../../../../components/text-input";

interface SearchProductKeysData {
  keys: Key[];
  count: number;
}

const searchProductKeys =
  (id: string, query: Record<string, any>, config: Record<string, any> = {}) =>
    () =>
      appFetch<SearchProductKeysData>({
        url: `/products/${id}/keys`,
        query,
        ...config,
      });

interface ProductAddKeyDialogProps {
  open: boolean;
  onClose: any;
  productId: string;
}

export const ProductAddKeyDialog: FC<ProductAddKeyDialogProps> = (props) => {
  const { id, ...queryRest } = useRouter().query;
  const { open, onClose, productId } = props;
  const queryClient = useQueryClient();
  const createKey = useCreateKey(() =>
    queryClient.invalidateQueries({ queryKey: ["product-keys", id, queryRest] })
  );
  const formik = useFormik({
    initialValues: {
      key: "",
    },
    validationSchema: Yup.object({
      key: Yup.string()
        .min(12)
        .max(64, "Must be 64 characters or less")
        .required("Required"),
    }),
    onSubmit: (values) => {
      createKey.mutate(
        { productId, key: values.key },
        {
          onSuccess: onClose,
        }
      );
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add key</DialogTitle>
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
          isLoading={createKey.isPending}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};
