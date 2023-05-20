import { useState } from "react";
import type { FC, SyntheticEvent } from "react";
import {
  Autocomplete,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { Product } from "@/types/products";
import { Eye as EyeIcon } from "@/icons/eye";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { useUpdateProductGeneral } from "@/api/products";
import { useQueryClient } from "react-query";
import { useListGenres } from "@/api/genres";
import { useListPublishers } from "@/api/publishers";
import { useListPlatforms } from "@/api/platforms";
import { Button } from "@/components/button";
import type { Publisher } from "@/types/publishers";
import type { Genre } from "@/types/genres";
import type { Platform } from "@/types/platforms";
import { MarkdownPreview } from "@/components/markdown-preview";
import { useDialog } from "@/hooks/useDialog";

const languageOptions: string[] = [];
const developerOptions: string[] = ["Ubisoft"];
const featureOptions: string[] = [];

const osOptions = ["Windows", "Mac", "Linux"];

interface ProductGeneralFormProps {
  product: Product;
  open: boolean;
  onClose: any;
}

export const ProductGeneralForm: FC<ProductGeneralFormProps> = (props) => {
  const { open, product, onClose } = props;
  const queryClient = useQueryClient();
  const updateProductGeneral = useUpdateProductGeneral(product._id);
  const { data: genreOptions, isLoading: genreOptionsIsLoading } =
    useListGenres();
  const { data: publisherOptions, isLoading: publisherOptionsIsLoading } =
    useListPublishers();
  const { data: platformOptions, isLoading: platformOptionsIsLoading } =
    useListPlatforms();
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();
  const [previewSelected, setPreviewSelected] = useState<
    "minimumRequirements" | "recommendedRequirements" | "markdown" | undefined
  >();

  const contentLoading =
    genreOptionsIsLoading ||
    publisherOptionsIsLoading ||
    platformOptionsIsLoading;

  const formik = useFormik({
    initialValues: {
      title: product.title,
      price: product.price,
      initialPrice: product.initialPrice,
      genres: product.genres,
      releaseDate: product.releaseDate,
      publisher: product.publisher,
      developers: product.developers,
      languages: product.languages,
      features: product.features,
      link: product.link,
      markdown: product.markdown,
      slug: product.slug,
      os: product.os,
      platform: product.platform,
      minimumRequirements: product.minimumRequirements,
      recommendedRequirements: product.recommendedRequirements,
    },
    validationSchema: Yup.object({
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
      minimumRequirements: Yup.string().required(),
      recommendedRequirements: Yup.string().required(),
    }),
    onSubmit: (values) => {
      const formValues = {
        ...values,
        genres: values.genres.map((genre) => genre._id),
        platform: values.platform._id,
        publisher: values.publisher._id,
      };

      updateProductGeneral.mutate(formValues, {
        onSuccess: (updatedProduct) => {
          queryClient.setQueryData(["product", product._id], {
            ...product,
            ...updatedProduct,
          });
          onClose();
        },
      });
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
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { height: "100%" },
        }}
      >
        <DialogTitle>Update General Details</DialogTitle>
        <DialogContent
          sx={{
            py: "24px !important",
            display: "grid",
            placeItems: "center",
          }}
        >
          {contentLoading ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={3}>
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
                  size="small"
                  value={formik.values.title}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  error={
                    !!formik.touched.initialPrice &&
                    !!formik.errors.initialPrice
                  }
                  fullWidth
                  helperText={
                    formik.touched.initialPrice && formik.errors.initialPrice
                  }
                  id="initialPrice"
                  label="Initial Price"
                  name="initialPrice"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="number"
                  size="small"
                  value={formik.values.initialPrice}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  error={!!formik.touched.price && !!formik.errors.price}
                  fullWidth
                  helperText={formik.touched.price && formik.errors.price}
                  id="price"
                  label="Price"
                  name="price"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="number"
                  size="small"
                  value={formik.values.price}
                />
              </Grid>
              <Grid item xs={12} md={6}>
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
              <Grid item xs={12} md={6}>
                <Autocomplete
                  autoHighlight
                  value={formik.values.publisher}
                  getOptionLabel={(option) => option.name}
                  id="publisher"
                  onChange={(
                    event: SyntheticEvent,
                    newValue: Publisher | null
                  ) => {
                    formik.setFieldValue("publisher", newValue);
                  }}
                  options={publisherOptions || []}
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
              <Grid item xs={12} md={6}>
                <Autocomplete
                  autoSelect
                  value={formik.values.platform}
                  getOptionLabel={(option) => option.name}
                  id="platform"
                  onChange={(
                    event: SyntheticEvent,
                    newValue: Platform | null
                  ) => {
                    formik.setFieldValue("platform", newValue);
                  }}
                  options={platformOptions || []}
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
              <Grid item xs={12} md={6}>
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
                      helperText={formik.touched.os && formik.errors.os}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
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
                        formik.touched.developers && formik.errors.developers
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
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
                      size="small"
                      label="Features"
                      name="features"
                      onBlur={formik.handleBlur}
                      error={
                        !!formik.touched.features && !!formik.errors.features
                      }
                      helperText={
                        formik.touched.features && formik.errors.features
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  autoHighlight
                  value={formik.values.genres}
                  filterSelectedOptions
                  getOptionLabel={(option) => option?.name}
                  id="genres"
                  multiple
                  onChange={(event: SyntheticEvent, newValue: Genre[]) => {
                    formik.setFieldValue("genres", newValue);
                  }}
                  options={genreOptions || []}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
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
              <Grid item xs={12} md={6}>
                <TextField
                  error={!!formik.touched.link && !!formik.errors.link}
                  fullWidth
                  helperText={formik.touched.link && formik.errors.link}
                  id="link"
                  label="Link"
                  name="link"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  size="small"
                  value={formik.values.link}
                />
              </Grid>
              <Grid item xs={12} md={6}>
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
                  ChipProps={{
                    size: "small",
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      label="Languages"
                      name="languages"
                      onBlur={formik.handleBlur}
                      error={
                        !!formik.touched.languages && !!formik.errors.languages
                      }
                      helperText={
                        formik.touched.languages && formik.errors.languages
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
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
              <Grid item xs={12} md={6}>
                <TextField
                  error={
                    !!formik.touched.minimumRequirements &&
                    !!formik.errors.minimumRequirements
                  }
                  fullWidth
                  helperText={
                    formik.touched.minimumRequirements &&
                    formik.errors.minimumRequirements
                  }
                  id="minimumRequirements"
                  label="Minimum Requirements"
                  minRows={10}
                  maxRows={16}
                  multiline
                  name="minimumRequirements"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  size="small"
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
              <Grid item xs={12} md={6}>
                <TextField
                  error={
                    !!formik.touched.recommendedRequirements &&
                    !!formik.errors.recommendedRequirements
                  }
                  fullWidth
                  helperText={
                    formik.touched.recommendedRequirements &&
                    formik.errors.recommendedRequirements
                  }
                  id="recommendedRequirements"
                  label="Recommended Requirements"
                  minRows={10}
                  maxRows={16}
                  multiline
                  name="recommendedRequirements"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  size="small"
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
                  size="small"
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
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="text" color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              formik.handleSubmit();
            }}
            disabled={contentLoading}
            isLoading={updateProductGeneral.isLoading}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
