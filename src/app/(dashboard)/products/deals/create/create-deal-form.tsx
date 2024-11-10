'use client';

import { AddProductsDialog } from '@/components/add-products-dialog';
import { Button } from '@/components/button';
import { FormInterval } from '@/components/form-interval';
import { ImageDropzone } from '@/components/image-dropzone';
import { TextInput } from '@/components/text-input';
import { ToastCreatedMessage } from '@/components/toast-created-message';
import { useDialog } from '@/hooks/useDialog';
import { Trash } from '@/icons/trash';
import { Product } from '@/types/products';
import { buildFormData } from '@/utils/build-form-data';
import {
  Autocomplete,
  Card,
  FormHelperText,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { ChangeEvent, FC, SyntheticEvent, useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useCreateDeal } from './api';

const metaKeywordOptions = ['Games', 'News'];

interface CreateDealFormProps {}

export const CreateDealForm: FC<CreateDealFormProps> = (props) => {
  const [shouldSetEndDate, setShouldSetEndDate] = useState(false);
  const createDeal = useCreateDeal();
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();

  const formik = useFormik({
    initialValues: {
      products: [],
      description: '',
      meta: {
        description: '',
        keywords: [],
        title: '',
      },
      slug: '',
      title: '',
      cover: undefined,
      startDate: null,
      endDate: null,
      isDeal: false,
    },
    validationSchema: Yup.object({
      products: Yup.array().min(1).required('Required'),
      description: Yup.string().required('Required'),
      meta: Yup.object().shape({
        description: Yup.string().required('Required'),
        keywords: Yup.array().min(1, 'Required').required('Required'),
        title: Yup.string().required('Required'),
      }),
      title: Yup.string().required('Required'),
      slug: Yup.string().required('Required'),
      cover: Yup.mixed().required('File is required'),
      startDate: Yup.date().required(),
      isDeal: Yup.boolean().required(),
      ...(shouldSetEndDate && { endDate: Yup.date().required() }),
    }),
    onSubmit: (values) => {
      const { endDate, ...formvalues } = values;
      const formData = buildFormData(formvalues);
      formData.append('endDate', shouldSetEndDate && endDate ? endDate : '');
      createDeal.mutate(formData, {
        onSuccess: (data) => {
          toast.success(
            <ToastCreatedMessage
              title="Deal created"
              subheader="Go to the deal"
              href={`/products/deals/${data._id}`}
            />
          );
        },
      });
    },
  });

  const onShouldSetEndDateChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setShouldSetEndDate(event.target.checked);
  };

  return (
    <>
      {dialogOpen && (
        <AddProductsDialog
          open
          onClose={() => {
            handleCloseDialog();
          }}
          onAdd={(products: Product[]) => {
            formik.setFieldValue('products', products);
          }}
          selectedProducts={formik.values.products}
        />
      )}
      <Grid
        container
        spacing={2}
      >
        <Grid
          item
          md={8}
          xs={12}
          container
          spacing={2}
        >
          <Grid
            item
            xs={12}
          >
            <Card sx={{ p: 2 }}>
              <Grid
                container
                spacing={2}
              >
                <Grid
                  item
                  xs={12}
                >
                  <Typography
                    color="textPrimary"
                    variant="subtitle1"
                  >
                    General
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                >
                  <TextInput
                    error={!!formik.touched.title && !!formik.errors.title}
                    fullWidth
                    helperText={formik.touched.title && formik.errors.title}
                    id="title"
                    label="Title"
                    name="title"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.title}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                >
                  <TextInput
                    error={!!formik.touched.slug && !!formik.errors.slug}
                    fullWidth
                    helperText={formik.touched.slug && formik.errors.slug}
                    id="slug"
                    label="Slug"
                    name="slug"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.slug}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                >
                  <TextInput
                    error={
                      !!formik.touched.description &&
                      !!formik.errors.description
                    }
                    fullWidth
                    helperText={
                      formik.touched.description && formik.errors.description
                    }
                    id="description"
                    label="Description"
                    minRows={6}
                    multiline
                    name="description"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.description}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                >
                  <ImageDropzone
                    file={formik.values.cover}
                    onDrop={(file: any) => formik.setFieldValue('cover', file)}
                  />
                  {!!formik.touched.cover && !!formik.errors.cover && (
                    <FormHelperText error>{formik.errors.cover}</FormHelperText>
                  )}
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
          >
            <Card sx={{ p: 2 }}>
              <Grid
                container
                spacing={2}
              >
                <Grid
                  item
                  xs={12}
                >
                  <Typography
                    color="textPrimary"
                    variant="subtitle2"
                  >
                    Products
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                >
                  <Button
                    onClick={handleOpenDialog}
                    color="primary"
                    variant="contained"
                  >
                    Browse
                  </Button>
                </Grid>
                {!!formik.touched?.products && !!formik.errors?.products && (
                  <Grid
                    item
                    xs={12}
                  >
                    <div>{formik.errors.products as string}</div>
                  </Grid>
                )}
                <Grid
                  item
                  xs={12}
                >
                  <List disablePadding>
                    {formik.values.products.map((product) => (
                      <ListItem
                        key={product._id}
                        disableGutters
                        divider
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Link
                          color="textPrimary"
                          variant="body1"
                          underline="hover"
                          href={`/products/${product._id}`}
                        >
                          {product.title}
                        </Link>
                        <IconButton
                          color="error"
                          onClick={() => {
                            formik.setFieldValue(
                              'products',
                              formik.values.products.filter(
                                (_product) => _product._id !== product._id
                              )
                            );
                          }}
                        >
                          <Trash />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
          >
            <FormInterval
              formik={formik}
              onShouldSetEndDateChange={onShouldSetEndDateChange}
              shouldSetEndDate={shouldSetEndDate}
            />
          </Grid>
        </Grid>
        <Grid
          container
          item
          md={4}
          spacing={2}
          sx={{ height: 'fit-content' }}
          xs={12}
        >
          <Grid
            item
            xs={12}
          >
            <Card sx={{ p: 2 }}>
              <Grid
                container
                spacing={2}
              >
                <Grid
                  item
                  xs={12}
                >
                  <Typography
                    color="textPrimary"
                    variant="subtitle1"
                  >
                    Meta
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                >
                  <TextInput
                    error={
                      !!formik.touched.meta?.title &&
                      !!formik.errors.meta?.title
                    }
                    fullWidth
                    helperText={
                      formik.touched.meta?.title && formik.errors.meta?.title
                    }
                    id="meta.title"
                    label="Title"
                    name="meta.title"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.meta.title}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                >
                  <TextInput
                    error={
                      !!formik.touched.meta?.description &&
                      !!formik.errors.meta?.description
                    }
                    fullWidth
                    helperText={
                      formik.touched.meta?.description &&
                      formik.errors.meta?.description
                    }
                    id="meta.description"
                    label="Description"
                    minRows={4}
                    multiline
                    name="meta.description"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.meta?.description}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                >
                  <Autocomplete
                    value={formik.values.meta?.keywords}
                    filterSelectedOptions
                    freeSolo
                    getOptionLabel={(option) => option}
                    id="meta.keywords"
                    multiple
                    onChange={(event: SyntheticEvent, newValue: string[]) => {
                      formik.setFieldValue('meta.keywords', newValue);
                    }}
                    options={metaKeywordOptions}
                    renderInput={(params) => (
                      <TextInput
                        {...params}
                        label="Keywords"
                        name="meta.keywords"
                        onBlur={formik.handleBlur}
                        error={
                          !!formik.touched.meta?.keywords &&
                          !!formik.errors.meta?.keywords
                        }
                        helperText={
                          formik.touched.meta?.keywords &&
                          formik.errors.meta?.keywords
                        }
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
          >
            <Button
              color="primary"
              fullWidth
              size="large"
              variant="contained"
              type="submit"
              onClick={() => {
                formik.handleSubmit();
              }}
              isLoading={createDeal.isPending}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
