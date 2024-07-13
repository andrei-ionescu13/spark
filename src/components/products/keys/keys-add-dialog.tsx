import { useState } from "react";
import type { FC, SyntheticEvent } from "react";
import { useFormik } from "formik";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";
import {
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
} from "@mui/material";
import { Button } from "@/components/button";
import { useUpdateArticleMeta } from "@/api/articles";
import { Article } from "@/types/articles";
import { TextInput } from "../../text-input";
import { appFetch } from "@/utils/app-fetch";
import { Product } from "@/types/products";
import { useCreateKey } from "@/api/keys";

interface ArticleDetailsMetaFormProps {
  open: boolean;
  onClose: any;
}

interface FormValues {
  key: string;
  product?: Product;
}

const initialValues: FormValues = {
  key: "",
  product: undefined,
};

interface GetProductsData {
  products: Product[];
  count: number;
}

const getProducts = (query: Record<string, any>) => () =>
  appFetch<GetProductsData>({
    url: "/products",
    query,
    withAuth: true,
  });

export const KeysAddDialog: FC<ArticleDetailsMetaFormProps> = (props) => {
  const { open, onClose } = props;
  const queryClient = useQueryClient();
  const [keyword, setKeyword] = useState("");
  const createKey = useCreateKey(() => queryClient.invalidateQueries({ queryKey: ["keys"] }));
  const { error, data: productsData } = useQuery({
    queryKey: ["keys", "products", { keyword }],
    queryFn: getProducts({ keyword })
  });
  const { products } = productsData || { products: [], count: 0 };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      key: Yup.string().required("Required"),
      product: Yup.mixed().required("Required"),
    }),
    onSubmit: (values) => {
      createKey.mutate(
        { productId: values?.product?._id || "", key: values.key },
        {
          onSuccess: onClose,
        }
      );
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Key</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextInput
              error={!!formik.touched.key && !!formik.errors.key}
              fullWidth
              helperText={formik.touched.key && formik.errors.key}
              id="key"
              label="Key"
              name="key"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              size="small"
              value={formik.values.key}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              onInputChange={(event, newInputValue) => {
                setKeyword(newInputValue);
              }}
              autoHighlight
              value={formik.values.product}
              getOptionLabel={(option) => option.title}
              id="product"
              onChange={(event: SyntheticEvent, newValue) => {
                formik.setFieldValue("product", newValue);
              }}
              filterOptions={(x) => x}
              options={products}
              renderInput={(params) => (
                <TextInput
                  {...params}
                  label="Product"
                  name="product"
                  onBlur={formik.handleBlur}
                  error={!!formik.touched.product && !!formik.errors.product}
                  helperText={
                    formik.touched.product && (formik.errors.product as string)
                  }
                />
              )}
            />
          </Grid>
        </Grid>
        {createKey.isError && (
          <FormHelperText error sx={{ mt: 1 }}>
            {createKey.error.message}
          </FormHelperText>
        )}
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onClose} variant="text">
          Cancel
        </Button>
        <Button
          color="primary"
          isLoading={createKey.isPending}
          onClick={() => {
            formik.handleSubmit();
          }}
          variant="contained"
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};
