import { useFormik } from "formik";
import * as Yup from "yup";
import { AlertDialog, AlertDialogProps } from "../alert-dialog";
import { FC } from "react";
import { TextInput } from "../text-input";
import { Box, FormHelperText, Grid, Link, Typography } from "@mui/material";
import { useDuplicateArticle } from "@/api/articles";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";

interface ArticleDuplicateDialog
  extends Omit<AlertDialogProps, "title" | "onSubmit" | "isLoading"> {
  articleId: string;
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

export const ArticleDuplicateDialog: FC<ArticleDuplicateDialog> = (props) => {
  const { articleId, onClose, ...rest } = props;
  const queryClient = useQueryClient();
  const duplicateArticle = useDuplicateArticle(articleId, () =>
    queryClient.invalidateQueries("articles")
  );

  const formik = useFormik({
    initialValues: {
      title: "",
      slug: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required(),
      slug: Yup.string().required(),
    }),
    onSubmit: (values) => {
      duplicateArticle.mutate(values, {
        onSuccess: ({ id }) => {
          onClose();
          toast.success(ToastSuccess(id));
        },
      });
    },
  });

  return (
    <AlertDialog
      onSubmit={formik.handleSubmit}
      onClose={onClose}
      title={`Duplicate article`}
      isLoading={duplicateArticle.isLoading}
      {...rest}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextInput
            error={!!formik.touched.title && !!formik.errors.title}
            fullWidth
            helperText={formik.touched.title && (formik.errors.title as string)}
            id="title"
            label="Title"
            name="title"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.title}
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
        {duplicateArticle.error?.message && (
          <Grid item xs={12}>
            <FormHelperText error>
              {duplicateArticle.error?.message}
            </FormHelperText>
          </Grid>
        )}
      </Grid>
    </AlertDialog>
  );
};
