'use client';
import { Button } from '@/components/button';
import { ImageUpdate } from '@/components/image-update';
import { TextInput } from '@/components/text-input';
import { Box, Card, CardContent, FormHelperText, Grid } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import type { FC } from 'react';
import { useState } from 'react';
import * as Yup from 'yup';
import { Article } from '../../../types/articles';
import { buildFormData } from '../../../utils/build-form-data';
import { useUpdateArticleGeneral } from './api';

interface ArticleGeneralFormProps {
  article: Article;
  onClose: any;
}

export const ArticleGeneralForm: FC<ArticleGeneralFormProps> = (props) => {
  const { article, onClose } = props;
  const queryClient = useQueryClient();
  const updateArticleDetails = useUpdateArticleGeneral(article._id);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      description: article.description,
      title: article.title,
      markdown: article.markdown,
      cover: article.cover,
      slug: article.slug,
    },
    validationSchema: Yup.object({
      description: Yup.string().required('Required'),
      title: Yup.string().required('Required'),
      slug: Yup.string().required('Required'),
      markdown: Yup.string().required('Required'),
      cover: Yup.mixed().required('Required'),
    }),
    onSubmit: async (values) => {
      const formData = buildFormData(values);
      setSubmitError(null);

      updateArticleDetails.mutate(formData, {
        onSuccess: (data) => {
          queryClient.setQueryData(['articles', article._id], {
            ...article,
            ...data,
          });
          onClose();
        },
        onError: (error) => {
          setSubmitError(error.message);
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
                error={!!formik.touched.title && !!formik.errors.title}
                fullWidth
                helperText={formik.touched.title && formik.errors.title}
                id="title"
                label="Title"
                name="title"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                size="small"
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
                size="small"
                value={formik.values.slug}
              />
            </Grid>
            <Grid
              item
              xs={12}
            >
              <TextInput
                error={
                  !!formik.touched.description && !!formik.errors.description
                }
                fullWidth
                helperText={
                  formik.touched.description && formik.errors.description
                }
                id="description"
                label="Description"
                minRows={4}
                multiline
                name="description"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                size="small"
                value={formik.values.description}
              />
            </Grid>
            <Grid
              item
              xs={12}
            >
              <TextInput
                error={!!formik.touched.markdown && !!formik.errors.markdown}
                fullWidth
                helperText={formik.touched.markdown && formik.errors.markdown}
                id="markdown"
                label="Content"
                maxRows={12}
                minRows={6}
                multiline
                name="markdown"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                size="small"
                value={formik.values.markdown}
              />
            </Grid>
            <Grid
              item
              xs={12}
            >
              <ImageUpdate
                url={formik.values.cover?.url}
                alt=""
                onFileSelect={(file: any) => {
                  formik.setFieldTouched('cover', true);
                  formik.setFieldValue('cover', file);
                }}
              />
              {!!formik.touched.cover && !!formik.errors.cover && (
                <FormHelperText error>{formik.errors.cover}</FormHelperText>
              )}
            </Grid>
          </Grid>
          {!!submitError && (
            <FormHelperText
              error
              sx={{ mt: 1 }}
            >
              {submitError}
            </FormHelperText>
          )}
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
          color="secondary"
          onClick={onClose}
          variant="text"
        >
          Cancel
        </Button>
        <Button
          color="primary"
          isLoading={updateArticleDetails.isPending}
          onClick={() => {
            formik.handleSubmit();
          }}
          variant="contained"
        >
          Update
        </Button>
      </Box>
    </Box>
  );
};
