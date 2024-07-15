import { useFormik } from "formik";
import * as Yup from "yup";
import { FC } from "react";
import { Box, FormHelperText, Grid, Link, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { AlertDialog, AlertDialogProps } from "../../alert-dialog";
import { TextInput } from "../../text-input";
import { useUpdateArticleCategory } from "@/api/article-categories";
import { ArticleCategory } from "../../../types/article-category";
import { useUpdateArticleTag } from "@/api/article-tags";
import { ArticleTag } from "../../../types/article-tag";

interface ArticleDuplicateDialog
  extends Omit<AlertDialogProps, "title" | "onSubmit" | "isLoading"> {
  articleTag: ArticleTag;
}

const ToastSuccess = (id: string) => (
  <Box>
    <Typography variant="body1" color="textPrimary">
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

export const ArticleTagUpdateDialog: FC<ArticleDuplicateDialog> = (props) => {
  const { onClose, articleTag, ...rest } = props;
  const queryClient = useQueryClient();
  const updateArticleTag = useUpdateArticleTag(articleTag._id, () =>
    queryClient.invalidateQueries({ queryKey: ["article-tags"] })
  );

  const formik = useFormik({
    initialValues: {
      name: articleTag.name,
      slug: articleTag.slug,
    },
    validationSchema: Yup.object({
      name: Yup.string().required(),
      slug: Yup.string().required(),
    }),
    onSubmit: (values) => {
      updateArticleTag.mutate(values, {
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
      title={`Update article tag`}
      isLoading={updateArticleTag.isPending}
      {...rest}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
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
        <Grid item xs={12}>
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
        {updateArticleTag.isError && (
          <Grid item xs={12}>
            <FormHelperText error>
              {updateArticleTag.error?.message}
            </FormHelperText>
          </Grid>
        )}
      </Grid>
    </AlertDialog>
  );
};
