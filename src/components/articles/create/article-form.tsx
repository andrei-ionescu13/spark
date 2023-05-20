import { FC, SyntheticEvent, useState } from "react";
import {
  Autocomplete,
  Card,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MarkdownPreview } from "@/components/markdown-preview";
import { Dropzone } from "@/components/dropzone";
import { useCreateArticle, useUpdateArticle } from "@/api/articles";
import { Article } from "@/types/articles";
import { toast } from "react-toastify";
import { Button } from "@/components/button";
import { buildFormData } from "@/utils/build-form-data";
import { useDialog } from "@/hooks/useDialog";
import { ToastItemCreated } from "@/components/toast-item-created";

interface Category {
  label: string;
  value: string;
}

const categorys: Category[] = [
  {
    label: "News",
    value: "news",
  },
  {
    label: "Games",
    value: "games",
  },
  {
    label: "Reviews",
    value: "reviews",
  },
];

const metaKeywordOptions = ["Games", "News", "mopneydas"];

interface ArticleFormProps {
  article?: Article;
}

export const ArticleForm: FC<ArticleFormProps> = (props) => {
  const { article } = props;
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle(article?._id || "");
  const [openPreview, handleOpenPreview, handleClosePreview] = useDialog(false);
  const [resolutionError, setResolutionError] = useState<string | undefined>(
    undefined
  );

  const formik = useFormik({
    initialValues: {
      description: "",
      meta: {
        description: "",
        keywords: [],
        title: "",
      },
      shouldPublish: false,
      category: "",
      slug: "",
      title: "",
      markdown: "",
      cover: undefined,
    },
    validationSchema: Yup.object({
      markdown: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
      meta: Yup.object().shape({
        description: Yup.string().required("Required"),
        keywords: Yup.array().min(1, "Required").required("Required"),
        title: Yup.string().required("Required"),
      }),
      shouldPublish: Yup.boolean(),
      category: Yup.string()
        .oneOf(categorys.map((category) => category.value))
        .required("Required"),
      title: Yup.string().required("Required"),
      slug: Yup.string().required("Required"),
      cover: Yup.mixed()
        .test("resolution", "wrong resolution", () => !resolutionError)
        .required("Required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const formData = buildFormData(values);
      createArticle.mutate(formData, {
        onSuccess: ({ id }) => {
          resetForm();
          toast.success(ToastItemCreated("article", `/articles/${id}`));
        },
      });
    },
  });

  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={8} xs={12}>
          <Card sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
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
              <Grid item xs={12}>
                <TextField
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
              <Grid item xs={12}>
                <TextField
                  error={
                    !!formik.touched.description && !!formik.errors.description
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
              <Grid item xs={12}>
                <TextField
                  error={!!formik.touched.markdown && !!formik.errors.markdown}
                  fullWidth
                  helperText={formik.touched.markdown && formik.errors.markdown}
                  id="markdown"
                  label="Markdown"
                  minRows={10}
                  maxRows={16}
                  multiline
                  name="markdown"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.markdown}
                />
              </Grid>
              <Grid item xs={12}>
                <Dropzone
                  resolution={{ width: 1920, height: 1080 }}
                  file={formik.values.cover}
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
          </Card>
        </Grid>
        <Grid
          container
          item
          md={4}
          spacing={2}
          sx={{ height: "fit-content" }}
          xs={12}
        >
          <Grid item xs={12}>
            <Card sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.shouldPublish}
                        name="shouldPublish"
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          formik.setFieldValue(
                            "shouldPublish",
                            event.target.checked
                          );
                        }}
                      />
                    }
                    label="Publish"
                    labelPlacement="start"
                    sx={{
                      ml: 0,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl
                    error={
                      !!formik.touched.category && !!formik.errors.category
                    }
                    fullWidth
                  >
                    <InputLabel id="category">Category</InputLabel>
                    <Select
                      id="category"
                      label="Category"
                      name="category"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.category}
                    >
                      {categorys.map((category) => (
                        <MenuItem value={category.value} key={category.value}>
                          {category.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {!!formik.touched.category && !!formik.errors.category && (
                      <FormHelperText>{formik.errors.category}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={
                      !!formik.touched.meta?.title &&
                      !!formik.errors.meta?.title
                    }
                    fullWidth
                    helperText={
                      formik.touched.meta?.title && formik.errors.meta?.title
                    }
                    id="meta.title"
                    label="Meta title"
                    name="meta.title"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.meta.title}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
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
                    label="Meta description"
                    minRows={4}
                    multiline
                    name="meta.description"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.meta?.description}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    value={formik.values.meta?.keywords}
                    filterSelectedOptions
                    freeSolo
                    getOptionLabel={(option) => option}
                    id="meta.keywords"
                    multiple
                    onChange={(event: SyntheticEvent, newValue: string[]) => {
                      formik.setFieldValue("meta.keywords", newValue);
                    }}
                    options={metaKeywordOptions}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Meta Keywords"
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
          <Grid container item spacing={2}>
            <Grid item xs={6}>
              <Button
                color="secondary"
                fullWidth
                size="large"
                variant="text"
                onClick={handleOpenPreview}
                type="button"
              >
                Preview
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                color="primary"
                fullWidth
                size="large"
                variant="contained"
                type="submit"
                onClick={() => {
                  formik.handleSubmit();
                }}
                isLoading={createArticle.isLoading || updateArticle.isLoading}
              >
                Post
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {openPreview && (
        <MarkdownPreview
          open
          onClose={handleClosePreview}
          title={formik.values.title}
          markdown={formik.values.markdown}
          cover={
            formik.values.cover
              ? URL.createObjectURL(formik.values.cover)
              : undefined
          }
          onSave={(markdown: string) =>
            formik.setFieldValue("markdown", markdown)
          }
        />
      )}
    </>
  );
};
