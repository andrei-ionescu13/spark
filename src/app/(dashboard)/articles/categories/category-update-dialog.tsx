import { Box, FormHelperText, Grid, Link, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { FC } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import {
  AlertDialog,
  AlertDialogProps,
} from '../../../components/alert-dialog';
import { TextInput } from '../../../components/text-input';
import { ArticleCategory } from '../../../types/article-category';
import { useUpdateArticleCategory } from './api';

interface CategoryUpdateDialogProps
  extends Omit<AlertDialogProps, 'title' | 'onSubmit' | 'isLoading'> {
  articleCategory: ArticleCategory;
}

const ToastSuccess = (id: string) => (
  <Box>
    <Typography
      variant="body1"
      color="textPrimary"
    >
      Article duplicated
    </Typography>
    <Link
      color="textPrimary"
      href={`/articles/${id}`}
      underline="hover"
      variant="body1"
    >
      Go to the created article
    </Link>
  </Box>
);

export const CategoryUpdateDialog: FC<CategoryUpdateDialogProps> = (props) => {
  const { onClose, articleCategory, ...rest } = props;
  const queryClient = useQueryClient();
  const createArticleCategory = useUpdateArticleCategory(
    articleCategory._id,
    () => queryClient.invalidateQueries({ queryKey: ['article-categories'] })
  );

  const formik = useFormik({
    initialValues: {
      name: articleCategory.name,
      slug: articleCategory.slug,
    },
    validationSchema: Yup.object({
      name: Yup.string().required(),
      slug: Yup.string().required(),
    }),
    onSubmit: (values) => {
      createArticleCategory.mutate(values, {
        onSuccess: ({ name }) => {
          onClose();
          toast.success(ToastSuccess(name));
        },
      });
    },
  });

  return (
    <AlertDialog
      onSubmit={formik.handleSubmit}
      onClose={onClose}
      title={`Update article category`}
      isLoading={createArticleCategory.isPending}
      {...rest}
    >
      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          xs={12}
        >
          <TextInput
            error={!!formik.touched.name && !!formik.errors.name}
            fullWidth
            helperText={formik.touched.name && (formik.errors.name as string)}
            id="name"
            label="Name"
            name="name"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.name}
          />
        </Grid>
        <Grid
          item
          xs={12}
        >
          <TextInput
            error={!!formik.touched.slug && !!formik.errors.slug}
            fullWidth
            helperText={formik.touched.slug && (formik.errors.slug as string)}
            id="slug"
            label="Slug"
            name="slug"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.slug}
          />
        </Grid>
        {createArticleCategory.isError && (
          <Grid
            item
            xs={12}
          >
            <FormHelperText error>
              {createArticleCategory.error?.message}
            </FormHelperText>
          </Grid>
        )}
      </Grid>
    </AlertDialog>
  );
};
