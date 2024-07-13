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
import { TextInput } from "../../text-input";
import { ArticleCategory } from "@/types/article-category";
import { ArticleTag } from "@/types/article-tag";

interface Option {
  label: string;
  value: string;
}

const metaKeywordOptions = ["Games", "News", "mopneydas"];

interface ArticleFormProps {
  article?: Article;
  categories: ArticleCategory[];
  tags: ArticleTag[];
}

export const ArticleForm: FC<ArticleFormProps> = (props) => {
  const { article, tags, categories } = props;
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle(article?._id || "");
  const [openPreview, handleOpenPreview, handleClosePreview] = useDialog(false);
  const [resolutionError, setResolutionError] = useState<string | undefined>(
    undefined
  );

  const categoryOptions: Option[] = categories?.map((category) => ({
    label: category.name,
    value: category._id,
  }));

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
      tags: [],
    },
    validationSchema: Yup.object({
      tags: Yup.array().of(Yup.mixed()).min(1),
      markdown: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
      meta: Yup.object().shape({
        description: Yup.string().required("Required"),
        keywords: Yup.array().min(1, "Required").required("Required"),
        title: Yup.string().required("Required"),
      }),
      shouldPublish: Yup.boolean(),
      category: Yup.string()
        .oneOf(categoryOptions.map((category) => category.value))
        .required("Required"),
      title: Yup.string().required("Required"),
      slug: Yup.string().required("Required"),
      cover: Yup.mixed()
        .test("resolution", "wrong resolution", () => !resolutionError)
        .required("Required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const finalValues = {
        ...values,
        tags: values.tags.map((tag: any) => tag._id),
      };
      const formData = buildFormData(finalValues);
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
              <Grid item xs={12}>
                <TextInput
                  info="If a slug is not provided, one will be generated"
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
                  minRows={6}
                  multiline
                  name="description"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.description}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
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
                  <TextInput
                    error={
                      !!formik.touched.category && !!formik.errors.category
                    }
                    fullWidth
                    select
                    id="category"
                    label="Category"
                    name="category"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.category}
                    helperText={
                      formik.touched.category && formik.errors.category
                    }
                  >
                    {categoryOptions.map((category) => (
                      <MenuItem value={category.value} key={category.value}>
                        {category.label}
                      </MenuItem>
                    ))}
                  </TextInput>
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    autoHighlight
                    value={formik.values.tags}
                    filterSelectedOptions
                    getOptionLabel={(option) => option.name}
                    id="tags"
                    multiple
                    onChange={(event: SyntheticEvent, newValue) => {
                      formik.setFieldValue("tags", newValue);
                    }}
                    options={tags}
                    renderInput={(params) => (
                      <TextInput
                        {...params}
                        label="Tags"
                        name="tags"
                        onBlur={formik.handleBlur}
                        error={!!formik.touched.tags && !!formik.errors.tags}
                        helperText={
                          formik.touched.tags && (formik.errors.tags as string)
                        }
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
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
                    label="Meta title"
                    name="meta.title"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.meta.title}
                  />
                </Grid>
                <Grid item xs={12}>
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
                    label="Meta description"
                    minRows={6}
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
                      <TextInput
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
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.shouldPublish}
                  name="shouldPublish"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    formik.setFieldValue("shouldPublish", event.target.checked);
                  }}
                />
              }
              label="Publish"
              labelPlacement="start"
            />
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
                isLoading={createArticle.isPending || updateArticle.isPending}
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
