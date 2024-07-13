import { useState } from "react";
import type { FC, SyntheticEvent } from "react";
import { useFormik } from "formik";
import { useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";
import {
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
} from "@mui/material";
import { Button } from "@/components/button";
import { useUpdateArticleMeta } from "@/api/articles";
import { Article } from "@/types/articles";
import { TextInput } from "../../text-input";

interface Values {
  description: string;
  keywords: string[];
  title: string;
}

interface ArticleDetailsMetaFormProps {
  values: Values;
  open: boolean;
  onClose: any;
  article: Article;
}

const metaKeywordOptions = ["Games", "News", "Reviews"];

export const ArticleDetailsMetaForm: FC<ArticleDetailsMetaFormProps> = (
  props
) => {
  const { open, values, onClose, article } = props;
  const updateArticleMeta = useUpdateArticleMeta(article._id);
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formik = useFormik({
    initialValues: {
      description: values.description,
      keywords: values.keywords,
      title: values.title,
    },
    validationSchema: Yup.object({
      description: Yup.string().required("Required"),
      keywords: Yup.array().required("Required"),
      title: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      setSubmitError(null);
      updateArticleMeta.mutate(values, {
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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Meta</DialogTitle>
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
            <Autocomplete
              filterSelectedOptions
              freeSolo
              getOptionLabel={(option) => option}
              id="keywords"
              multiple
              onChange={(event: SyntheticEvent, newValue: string[]) => {
                formik.setFieldValue("keywords", newValue);
              }}
              options={metaKeywordOptions}
              renderInput={(params) => (
                <TextInput
                  {...params}
                  size="small"
                  label="Keywords"
                  name="keywords"
                  onBlur={formik.handleBlur}
                  error={!!formik.touched.keywords && !!formik.errors.keywords}
                  helperText={formik.touched.keywords && formik.errors.keywords}
                />
              )}
              value={formik.values.keywords}
            />
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
          isLoading={updateArticleMeta.isPending}
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
