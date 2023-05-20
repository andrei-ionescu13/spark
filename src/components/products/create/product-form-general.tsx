import { useState } from "react";
import type { FC, SyntheticEvent } from "react";
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  TextField,
  FormControlLabel,
  Switch,
  InputAdornment,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye as EyeIcon } from "@/icons/eye";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { MarkdownPreview } from "@/components/markdown-preview";
import { useDialog } from "@/hooks/useDialog";
import type { Genre } from "@/types/genres";
import type { Publisher } from "@/types/publishers";
import type { Platform } from "@/types/platforms";
import { Button } from "@/components/button";

const developerOptions: string[] = ["Ubisoft"];
const featureOptions: string[] = [];
const languageOptions: string[] = [];
const osOptions = ["Windows", "Mac", "Linux"];

interface ProductFormGeneralProps {
  onNext: any;
  product: any;
  genreOptions: Genre[];
  publishersOptions: Publisher[];
  platformOptions: Platform[];
}

export const ProductFormGeneral: FC<ProductFormGeneralProps> = (props) => {
  const { onNext, product, genreOptions, publishersOptions, platformOptions } =
    props;
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();
  const [previewSelected, setPreviewSelected] = useState<
    "minimumRequirements" | "recommendedRequirements" | "markdown" | undefined
  >();

  const formik = useFormik({
    initialValues: {
      title: product?.title || "",
      price: product?.price || "",
      initialPrice: product?.initialPrice || "",
      genres: product?.genres || [],
      releaseDate: product?.releaseDate || null,
      publisher: product?.publisher || null,
      platform: product?.platform || null,
      developers: product?.developers || [],
      languages: product?.languages || [],
      features: product?.features || [],
      link: product?.link || "",
      os: product?.os || [],
      markdown: product?.markdown || "",
      slug: product?.slug || "",
      shouldPublish: product?.shouldPublish || false,
      minimumRequirements: product?.minimumRequirements || "",
      recommendedRequirements: product?.recommendedRequirements || "",
    },
    validationSchema: Yup.object({
      minimumRequirements: Yup.string().required(),
      recommendedRequirements: Yup.string().required(),
      title: Yup.string().required(),
      price: Yup.number().required(),
      initialPrice: Yup.number().required(),
      genres: Yup.array().of(Yup.mixed()).min(1),
      releaseDate: Yup.date().required(),
      slug: Yup.string().required(),
      publisher: Yup.mixed().required(),
      platform: Yup.mixed().required(),
      developers: Yup.array().of(Yup.string()).min(1),
      languages: Yup.array().of(Yup.string()).min(1),
      features: Yup.array().of(Yup.string()).min(1),
      link: Yup.string().required(),
      os: Yup.array().of(Yup.string()).min(1),
      markdown: Yup.string().required(),
      publish: Yup.bool(),
    }),
    onSubmit: (values) => {
      onNext(values);
    },
  });

  return (
    <>
      {dialogOpen && previewSelected && (
        <MarkdownPreview
          open
          onClose={handleCloseDialog}
          markdown={formik.values[previewSelected]}
          onSave={(markdown: string) =>
            formik.setFieldValue(previewSelected, markdown)
          }
        />
      )}
      <Box>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  error={!!formik.touched.title && !!formik.errors.title}
                  fullWidth
                  helperText={
                    formik.touched.title && (formik.errors.title as string)
                  }
                  id="title"
                  label="Title"
                  name="title"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.title}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  error={
                    !!formik.touched.initialPrice &&
                    !!formik.errors.initialPrice
                  }
                  fullWidth
                  helperText={
                    formik.touched.initialPrice &&
                    (formik.errors.initialPrice as string)
                  }
                  id="initialPrice"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  label="Initial Price"
                  name="initialPrice"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="number"
                  value={formik.values.initialPrice}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  error={!!formik.touched.price && !!formik.errors.price}
                  fullWidth
                  helperText={
                    formik.touched.price && (formik.errors.price as string)
                  }
                  id="price"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  label="Price"
                  name="price"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="number"
                  value={formik.values.price}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  error={!!formik.touched.slug && !!formik.errors.slug}
                  fullWidth
                  helperText={
                    formik.touched.slug && (formik.errors.slug as string)
                  }
                  id="slug"
                  label="Slug"
                  name="slug"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.slug}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  autoSelect
                  value={formik.values.publisher}
                  getOptionLabel={(option) => option.name}
                  id="publisher"
                  onChange={(event: SyntheticEvent, newValue: string[]) => {
                    formik.setFieldValue("publisher", newValue);
                  }}
                  options={publishersOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Publisher"
                      name="publisher"
                      onBlur={formik.handleBlur}
                      error={
                        !!formik.touched.publisher && !!formik.errors.publisher
                      }
                      helperText={
                        formik.touched.publisher &&
                        (formik.errors.publisher as string)
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  autoSelect
                  value={formik.values.platform}
                  getOptionLabel={(option) => option.name}
                  id="platform"
                  onChange={(event: SyntheticEvent, newValue: string[]) => {
                    formik.setFieldValue("platform", newValue);
                  }}
                  options={platformOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Platform"
                      name="platform"
                      onBlur={formik.handleBlur}
                      error={
                        !!formik.touched.platform && !!formik.errors.platform
                      }
                      helperText={
                        formik.touched.platform &&
                        (formik.errors.platform as string)
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  value={formik.values.os}
                  filterSelectedOptions
                  freeSolo
                  getOptionLabel={(option) => option}
                  id="os"
                  multiple
                  onChange={(event: SyntheticEvent, newValue: string[]) => {
                    formik.setFieldValue("os", newValue);
                  }}
                  options={osOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Os"
                      name="os"
                      onBlur={formik.handleBlur}
                      error={!!formik.touched.os && !!formik.errors.os}
                      helperText={
                        formik.touched.os && (formik.errors.os as string)
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  value={formik.values.developers}
                  filterSelectedOptions
                  getOptionLabel={(option) => option}
                  id="developers"
                  multiple
                  onChange={(event: SyntheticEvent, newValue: string[]) => {
                    formik.setFieldValue("developers", newValue);
                  }}
                  options={developerOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Developers"
                      name="developers"
                      onBlur={formik.handleBlur}
                      error={
                        !!formik.touched.developers &&
                        !!formik.errors.developers
                      }
                      helperText={
                        formik.touched.developers &&
                        (formik.errors.developers as string)
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  value={formik.values.features}
                  filterSelectedOptions
                  freeSolo
                  getOptionLabel={(option) => option}
                  id="features"
                  multiple
                  onChange={(event: SyntheticEvent, newValue: string[]) => {
                    formik.setFieldValue("features", newValue);
                  }}
                  options={featureOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Features"
                      name="features"
                      onBlur={formik.handleBlur}
                      error={
                        !!formik.touched.features && !!formik.errors.features
                      }
                      helperText={
                        formik.touched.features &&
                        (formik.errors.features as string)
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  value={formik.values.genres}
                  filterSelectedOptions
                  getOptionLabel={(option) => option.name}
                  id="genres"
                  multiple
                  onChange={(event: SyntheticEvent, newValue: string[]) => {
                    formik.setFieldValue("genres", newValue);
                  }}
                  options={genreOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Genres"
                      name="genres"
                      onBlur={formik.handleBlur}
                      error={!!formik.touched.genres && !!formik.errors.genres}
                      helperText={
                        formik.touched.genres &&
                        (formik.errors.genres as string)
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  error={!!formik.touched.link && !!formik.errors.link}
                  fullWidth
                  helperText={
                    formik.touched.link && (formik.errors.link as string)
                  }
                  id="link"
                  label="Link"
                  name="link"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.link}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  value={formik.values.languages}
                  filterSelectedOptions
                  freeSolo
                  getOptionLabel={(option) => option}
                  id="languages"
                  multiple
                  onChange={(event: SyntheticEvent, newValue: string[]) => {
                    formik.setFieldValue("languages", newValue);
                  }}
                  options={languageOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Languages"
                      name="languages"
                      onBlur={formik.handleBlur}
                      error={
                        !!formik.touched.languages && !!formik.errors.languages
                      }
                      helperText={
                        formik.touched.languages &&
                        (formik.errors.languages as string)
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DesktopDatePicker
                  label="Release Date"
                  value={formik.values.releaseDate}
                  onChange={(newValue: Date | null) => {
                    formik.setFieldValue("releaseDate", newValue);
                  }}
                  slotProps={{
                    textField: {
                      helperText:
                        formik.touched.releaseDate &&
                        (formik.errors.releaseDate as string),
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  error={
                    !!formik.touched.minimumRequirements &&
                    !!formik.errors.minimumRequirements
                  }
                  fullWidth
                  helperText={
                    formik.touched.minimumRequirements &&
                    (formik.errors.minimumRequirements as string)
                  }
                  id="minimumRequirements"
                  label="Minimum Requirements"
                  minRows={10}
                  maxRows={16}
                  multiline
                  name="minimumRequirements"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.minimumRequirements}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      setPreviewSelected("minimumRequirements");
                      handleOpenDialog();
                    }}
                  >
                    <EyeIcon />
                  </IconButton>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  error={
                    !!formik.touched.recommendedRequirements &&
                    !!formik.errors.recommendedRequirements
                  }
                  fullWidth
                  helperText={
                    formik.touched.recommendedRequirements &&
                    (formik.errors.recommendedRequirements as string)
                  }
                  id="recommendedRequirements"
                  label="Recommended Requirements"
                  minRows={10}
                  maxRows={16}
                  multiline
                  name="recommendedRequirements"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.recommendedRequirements}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      setPreviewSelected("recommendedRequirements");
                      handleOpenDialog();
                    }}
                  >
                    <EyeIcon />
                  </IconButton>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
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
                  sx={{ ml: 0 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={!!formik.touched.markdown && !!formik.errors.markdown}
                  fullWidth
                  helperText={
                    formik.touched.markdown &&
                    (formik.errors.markdown as string)
                  }
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
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      setPreviewSelected("markdown");
                      handleOpenDialog();
                    }}
                  >
                    <EyeIcon />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            onClick={() => {
              formik.handleSubmit();
            }}
            size="large"
          >
            Next
          </Button>
        </Box>
      </Box>
    </>
  );
};
