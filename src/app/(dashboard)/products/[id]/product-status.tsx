'use client';

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  colors,
  useTheme,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import type { FC } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { Button } from '../../../components/button';
import type { StatusOption } from '../../../components/status';
import { StatusSelect } from '../../../components/status';
import type { Product } from '../../../types/products';
import { useUpdateProductStatus } from './(page)/api';

interface ProductStatusProps {
  product: Product;
}

export const ProductStatus: FC<ProductStatusProps> = (props) => {
  const { product } = props;
  const theme = useTheme();
  const queryClient = useQueryClient();
  const updateProductStatus = useUpdateProductStatus(product._id);

  const statusOptions: StatusOption[] = [
    {
      label: 'Published',
      value: 'published',
      color: theme.palette.success.main,
    },
    {
      label: 'Draft',
      value: 'draft',
      color: colors.grey[500],
    },
    {
      label: 'Archived',
      value: 'archived',
      color: theme.palette.error.main,
    },
  ];

  const formik = useFormik({
    initialValues: {
      status: product.status,
    },
    validationSchema: Yup.object({
      status: Yup.string()
        .oneOf(statusOptions.map((status) => status.value))
        .required('Required'),
    }),
    onSubmit: (values) => {
      updateProductStatus.mutate(values, {
        onSuccess: (status) => {
          queryClient.setQueryData(['product', product._id], {
            ...product,
            status,
          });
          toast.success('Product updated');
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });
    },
  });

  const isDisabled = product.status === formik.values.status;

  return (
    <Card>
      <CardHeader title="Status" />
      <Divider />
      <CardContent>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '9fr 3fr',
            gap: 1,
          }}
        >
          <FormControl
            error={!!formik.touched.status && !!formik.errors.status}
            fullWidth
            size="small"
          >
            <StatusSelect
              id="status"
              name="status"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.status}
              options={statusOptions}
            />
            {!!formik.touched.status && !!formik.errors.status && (
              <FormHelperText>{formik.errors.status}</FormHelperText>
            )}
          </FormControl>
          <Button
            fullWidth
            color="primary"
            variant="contained"
            disabled={isDisabled}
            isLoading={updateProductStatus.isPending}
            onClick={() => {
              formik.handleSubmit();
            }}
          >
            Update
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
