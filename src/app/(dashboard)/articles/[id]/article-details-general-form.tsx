import { useState } from "react";
import type { FC } from "react";
import { useFormik } from "formik";
import { useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
} from "@mui/material";
import { Dropzone } from "../../dropzone";
import { Article } from "../../../types/articles";
import { Button } from "../../button";
import { useUpdateArticleGeneral } from "@/api/articles";
import { buildFormData } from "../../../utils/build-form-data";
import { isImage } from "../../../utils/type-checks";
import { TextInput } from "../../text-input";

interface ArticleDetailsGeneralFormProps {
  article: Article;
  open: boolean;
  onClose: any;
}

export const ArticleDetailsGeneralForm: FC<ArticleDetailsGeneralFormProps> = (
  props
) => {
  const { open, article, onClose } = props;
  const queryClient = useQueryClient();
  const updateArticleDetails = useUpdateArticleGeneral(article._id);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [resolutionError, setResolutionError] = useState<string | undefined>(
    undefined
  );

  const formik = useFormik({
    initialValues: {
      description: article.description,
      title: article.title,
      markdown: article.markdown,
      cover: article.cover || undefined,
      slug: article.slug,
    },
    validationSchema: Yup.object({
      description: Yup.string().required("Required"),
      title: Yup.string().required("Required"),
      slug: Yup.string().required("Required"),
      markdown: Yup.string().required("Required"),
      cover: Yup.mixed()
        .test("resolution", "wrong resolution", () => !resolutionError)
        .required("Required"),
    }),
    onSubmit: async (values) => {
      const formData = buildFormData(values);
      setSubmitError(null);

      updateArticleDetails.mutate(formData, {
        onSuccess: (data) => {
          queryClient.setQueryData(["articles", article._id], {
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
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Update General</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
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
          <Grid item xs={12}>
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
          <Grid item xs={12}>
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
          <Grid item xs={12}>
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
          <Grid item xs={12}>
            <Dropzone
              resolution={{ width: 1920, height: 1080 }}
              file={
                isImage(formik.values.cover)
                  ? formik.values.cover?.url
                  : formik.values.cover
              }
              onDrop={(file: any) => {
                formik.setFieldTouched("cover", true);
                formik.setFieldValue("cover", file);
              }}
              onError={(error: string) => {
                setResolutionError(error);
                formik.setFieldError("cover", error);
              }}
            />
            {!!formik.touched.cover && !!formik.errors.cover && (
              <FormHelperText error>{formik.errors.cover}</FormHelperText>
            )}
          </Grid>
        </Grid>
        {!!submitError && (
          <FormHelperText error sx={{ mt: 1 }}>
            {submitError}
          </FormHelperText>
        )}
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onClose} variant="text">
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
      </DialogActions>
    </Dialog>
  );
};
