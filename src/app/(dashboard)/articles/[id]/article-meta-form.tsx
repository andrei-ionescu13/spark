import { Button } from '@/components/button';
import { TextInput } from '@/components/text-input';
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  FormHelperText,
  Grid,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import type { FC, SyntheticEvent } from 'react';
import { useState } from 'react';
import * as Yup from 'yup';
import { Article } from '../../../types/articles';
import { useUpdateArticleMeta } from './api';

interface ArticleMetaFormProps {
  article: Article;
  onClose: any;
}

const metaKeywordOptions = ['Games', 'News', 'Reviews'];

export const ArticleMetaForm: FC<ArticleMetaFormProps> = (props) => {
  const { onClose, article } = props;
  const updateArticleMeta = useUpdateArticleMeta(article._id);
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      description: article.meta.description,
      keywords: article.meta.keywords,
      title: article.meta.title,
    },
    validationSchema: Yup.object({
      description: Yup.string().required('Required'),
      keywords: Yup.array().required('Required'),
      title: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      setSubmitError(null);
      updateArticleMeta.mutate(values, {
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
              <Autocomplete
                filterSelectedOptions
                freeSolo
                getOptionLabel={(option) => option}
                id="keywords"
                multiple
                onChange={(event: SyntheticEvent, newValue: string[]) => {
                  formik.setFieldValue('keywords', newValue);
                }}
                options={metaKeywordOptions}
                renderInput={(params) => (
                  <TextInput
                    {...params}
                    size="small"
                    label="Keywords"
                    name="keywords"
                    onBlur={formik.handleBlur}
                    error={
                      !!formik.touched.keywords && !!formik.errors.keywords
                    }
                    helperText={
                      formik.touched.keywords && formik.errors.keywords
                    }
                  />
                )}
                value={formik.values.keywords}
              />
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
          isLoading={updateArticleMeta.isPending}
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
