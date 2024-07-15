import type { FC, SyntheticEvent } from "react";
import { Autocomplete, Box, Card, CardContent, Grid } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "../../button";
import { TextInput } from "../../text-input";

const metaKeywordOptions = ["Games", "News", "Review"];

interface ProductFormMetaProps {
  onNext: any;
  onBack: any;
  product: any;
}

export const ProductFormMeta: FC<ProductFormMetaProps> = (props) => {
  const { onBack, onNext: onSubmit, product } = props;
  const formik = useFormik({
    initialValues: {
      metaDescription: product.metaDescription || "",
      metaKeywords: product.metaKeywords || [],
      metaTitle: product.metaTitle || "",
    },
    validationSchema: Yup.object({
      metaDescription: Yup.string()
        .max(512, "Must be 512 characters or less")
        .required("Required"),
      metaKeywords: Yup.array().min(1, "Required").required("Required"),
      metaTitle: Yup.string()
        .max(100, "Must be 100 characters or less")
        .required("Required"),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <Box>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextInput
                error={!!formik.touched.metaTitle && !!formik.errors.metaTitle}
                fullWidth
                helperText={
                  formik.touched.metaTitle &&
                  (formik.errors.metaTitle as string)
                }
                id="metaTitle"
                label="Meta title"
                name="metaTitle"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.metaTitle}
              />
            </Grid>
            <Grid item xs={12}>
              <TextInput
                error={
                  !!formik.touched.metaDescription &&
                  !!formik.errors.metaDescription
                }
                fullWidth
                helperText={
                  formik.touched.metaDescription &&
                  (formik.errors.metaDescription as string)
                }
                id="metaDescription"
                label="Meta description"
                minRows={4}
                multiline
                name="metaDescription"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.metaDescription}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                value={formik.values.metaKeywords}
                freeSolo
                filterSelectedOptions
                getOptionLabel={(option) => option}
                id="metaKeywords"
                multiple
                onChange={(event: SyntheticEvent, newValue: string[]) => {
                  formik.setFieldValue("metaKeywords", newValue);
                }}
                options={metaKeywordOptions}
                renderInput={(params) => (
                  <TextInput
                    {...params}
                    label="Meta Keywords"
                    name="metaKeywords"
                    onBlur={formik.handleBlur}
                    error={
                      !!formik.touched.metaKeywords &&
                      !!formik.errors.metaKeywords
                    }
                    helperText={
                      formik.touched.metaKeywords &&
                      (formik.errors.metaKeywords as string)
                    }
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button color="inherit" onClick={onBack} size="large" sx={{ mr: 1 }}>
          Back
        </Button>
        <Button onClick={() => formik.handleSubmit()} size="large">
          Next
        </Button>
      </Box>
    </Box>
  );
};
