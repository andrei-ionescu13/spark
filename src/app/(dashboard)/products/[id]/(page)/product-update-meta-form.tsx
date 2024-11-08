'use client';

import { Autocomplete, Box, Card, CardContent, Grid } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import type { FC, SyntheticEvent } from 'react';
import * as Yup from 'yup';
import { Button } from '../../../../components/button';
import { TextInput } from '../../../../components/text-input';
import type { Product } from '../../../../types/products';
import { useUpdateProductMeta } from './api';

interface ProductUpdateMetaFormProps {
  product: Product;
  onClose: () => void;
}

const metaKeywordOptions = ['Games', 'News', 'mopneydas'];

export const ProductUpdateMetaForm: FC<ProductUpdateMetaFormProps> = (
  props
) => {
  const { product, onClose } = props;
  const queryClient = useQueryClient();
  const updateProductMeta = useUpdateProductMeta(product._id);

  const formik = useFormik({
    initialValues: {
      metaDescription: product.metaDescription,
      metaKeywords: product.metaKeywords,
      metaTitle: product.metaTitle,
    },
    validationSchema: Yup.object({
      metaDescription: Yup.string()
        .max(512, 'Must be 512 characters or less')
        .required('Required'),
      metaKeywords: Yup.array().min(1, 'Required').required('Required'),
      metaTitle: Yup.string()
        .max(100, 'Must be 100 characters or less')
        .required('Required'),
    }),
    onSubmit: (values) => {
      updateProductMeta.mutate(values, {
        onSuccess: (data) => {
          queryClient.setQueryData(['product', product._id], {
            ...product,
            ...data,
          });
          onClose;
        },
      });
    },
  });

  return (
    <Box>
      <Card>
        <CardContent>
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
                error={!!formik.touched.metaTitle && !!formik.errors.metaTitle}
                fullWidth
                helperText={formik.touched.metaTitle && formik.errors.metaTitle}
                id="metaTitle"
                label="Meta title"
                name="metaTitle"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.metaTitle}
              />
            </Grid>
            <Grid
              item
              xs={12}
            >
              <TextInput
                size="small"
                error={
                  !!formik.touched.metaDescription &&
                  !!formik.errors.metaDescription
                }
                fullWidth
                helperText={
                  formik.touched.metaDescription &&
                  formik.errors.metaDescription
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
            <Grid
              item
              xs={12}
            >
              <Autocomplete
                value={formik.values.metaKeywords}
                freeSolo
                filterSelectedOptions
                getOptionLabel={(option) => option}
                id="metaKeywords"
                multiple
                onChange={(event: SyntheticEvent, newValue: string[]) => {
                  formik.setFieldValue('metaKeywords', newValue);
                }}
                options={metaKeywordOptions}
                renderInput={(params) => (
                  <TextInput
                    {...params}
                    size="small"
                    label="Meta Keywords"
                    name="metaKeywords"
                    onBlur={formik.handleBlur}
                    error={
                      !!formik.touched.metaKeywords &&
                      !!formik.errors.metaKeywords
                    }
                    helperText={
                      formik.touched.metaKeywords && formik.errors.metaKeywords
                    }
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Box
        sx={{
          mt: 2,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
        }}
      >
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
          onClick={() => {
            formik.handleSubmit();
          }}
          isLoading={updateProductMeta.isPending}
        >
          Update
        </Button>
      </Box>
    </Box>
  );
};
