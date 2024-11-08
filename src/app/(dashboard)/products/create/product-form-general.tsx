import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  CircularProgress,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Switch,
} from '@mui/material';
import { useFormik } from 'formik';
import type { FC, SyntheticEvent } from 'react';
import { Fragment, useState } from 'react';
import * as Yup from 'yup';
import { Button } from '../../../components/button';
import { DateInput } from '../../../components/date-picker';
import { MarkdownPreview } from '../../../components/markdown-preview';
import { TextInput } from '../../../components/text-input';
import { useDialog } from '../../../hooks/useDialog';
import { Eye as EyeIcon } from '../../../icons/eye';
import {
  useListDevelopersQuery,
  useListFeaturesQuery,
  useListGenresQuery,
  useListLanguagesQuery,
  useListOperatingSystemsQuery,
  useListPlatformsQuery,
  useListPublishersQuery,
} from '../api';

interface ProductFormGeneralProps {
  onNext: any;
  product: any;
}
export const ProductFormGeneral: FC<ProductFormGeneralProps> = (props) => {
  const { onNext, product } = props;
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();
  const [previewSelected, setPreviewSelected] = useState<
    'minimumRequirements' | 'recommendedRequirements' | 'markdown' | undefined
  >();
  const [autocompleteOpen, setAutocompleteOpen] = useState({
    developers: false,
    features: false,
    genres: false,
    languages: false,
    os: false,
    platform: false,
    publisher: false,
  });

  const handleAutocompleteOpenToggle = (field: string, value: boolean) => {
    setAutocompleteOpen((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const listDevelopersQuery = useListDevelopersQuery({
    enabled: autocompleteOpen.features,
  });
  const listFeaturesQuery = useListFeaturesQuery({
    enabled: autocompleteOpen.features,
  });
  const listGenresQuery = useListGenresQuery({
    enabled: autocompleteOpen.genres,
  });
  const listLanguagesQuery = useListLanguagesQuery({
    enabled: autocompleteOpen.languages,
  });
  const listOperatingSystemsQuery = useListOperatingSystemsQuery({
    enabled: autocompleteOpen.os,
  });
  const listPlatformsQuery = useListPlatformsQuery({
    enabled: autocompleteOpen.platform,
  });
  const listPublishersQuery = useListPublishersQuery({
    enabled: autocompleteOpen.publisher,
  });

  const genres = listGenresQuery.data || [];
  const publishers = listPublishersQuery.data || [];
  const platforms = listPlatformsQuery.data || [];
  const developers = listDevelopersQuery.data || [];
  const features = listFeaturesQuery.data || [];
  const languages = listLanguagesQuery.data || [];
  const operatingSystems = listOperatingSystemsQuery.data || [];

  const formik = useFormik({
    initialValues: {
      title: product?.title || '',
      price: product?.price || '',
      genres: product?.genres || [],
      releaseDate: product?.releaseDate || null,
      publisher: product?.publisher || null,
      platform: product?.platform || null,
      developers: product?.developers || [],
      languages: product?.languages || [],
      features: product?.features || [],
      link: product?.link || '',
      os: product?.os || [],
      markdown: product?.markdown || '',
      slug: product?.slug || '',
      shouldPublish: product?.shouldPublish || false,
      minimumRequirements: product?.minimumRequirements || '',
      recommendedRequirements: product?.recommendedRequirements || '',
    },
    validationSchema: Yup.object({
      minimumRequirements: Yup.string().required(),
      recommendedRequirements: Yup.string().required(),
      title: Yup.string().required(),
      price: Yup.number().required(),
      genres: Yup.array().of(Yup.mixed()).min(1),
      releaseDate: Yup.date().required(),
      slug: Yup.string(),
      publisher: Yup.mixed().required(),
      platform: Yup.mixed().required(),
      developers: Yup.array().of(Yup.mixed()).min(1),
      languages: Yup.array().of(Yup.mixed()).min(1),
      features: Yup.array().of(Yup.mixed()).min(1),
      link: Yup.string(),
      os: Yup.array().of(Yup.mixed()).min(1),
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
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                xs={12}
                sm={6}
              >
                <TextInput
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
              <Grid
                item
                xs={12}
                sm={6}
              >
                <TextInput
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
              <Grid
                item
                xs={12}
                sm={6}
              >
                <TextInput
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
                  info="If a slug is not provided, one will be generated"
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
              >
                <Autocomplete
                  open={autocompleteOpen.publisher}
                  onOpen={() => {
                    handleAutocompleteOpenToggle('publisher', true);
                  }}
                  onClose={() => {
                    handleAutocompleteOpenToggle('publisher', false);
                  }}
                  loading={listPublishersQuery.isFetching}
                  autoSelect
                  filterSelectedOptions
                  value={formik.values.publisher}
                  getOptionLabel={(option) => option.name}
                  id="publisher"
                  onChange={(event: SyntheticEvent, newValue: string[]) => {
                    formik.setFieldValue('publisher', newValue);
                  }}
                  options={publishers}
                  renderInput={(params) => (
                    <TextInput
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
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <Fragment>
                            {listPublishersQuery.isFetching ? (
                              <CircularProgress
                                color="inherit"
                                size={20}
                              />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
              >
                <Autocomplete
                  filterSelectedOptions
                  open={autocompleteOpen.platform}
                  onOpen={() => {
                    handleAutocompleteOpenToggle('platform', true);
                  }}
                  onClose={() => {
                    handleAutocompleteOpenToggle('platform', false);
                  }}
                  loading={listPlatformsQuery.isFetching}
                  autoSelect
                  value={formik.values.platform}
                  getOptionLabel={(option) => option.name}
                  id="platform"
                  onChange={(event: SyntheticEvent, newValue: string[]) => {
                    formik.setFieldValue('platform', newValue);
                  }}
                  options={platforms}
                  renderInput={(params) => (
                    <TextInput
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
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <Fragment>
                            {listPlatformsQuery.isFetching ? (
                              <CircularProgress
                                color="inherit"
                                size={20}
                              />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
              >
                <Autocomplete
                  open={autocompleteOpen.os}
                  onOpen={() => {
                    handleAutocompleteOpenToggle('os', true);
                  }}
                  onClose={() => {
                    handleAutocompleteOpenToggle('os', false);
                  }}
                  loading={listOperatingSystemsQuery.isFetching}
                  value={formik.values.os}
                  filterSelectedOptions
                  freeSolo
                  getOptionLabel={(option) => option.name}
                  id="os"
                  multiple
                  onChange={(event: SyntheticEvent, newValue: string[]) => {
                    formik.setFieldValue('os', newValue);
                  }}
                  options={operatingSystems}
                  renderInput={(params) => (
                    <TextInput
                      {...params}
                      label="Os"
                      name="os"
                      onBlur={formik.handleBlur}
                      error={!!formik.touched.os && !!formik.errors.os}
                      helperText={
                        formik.touched.os && (formik.errors.os as string)
                      }
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <Fragment>
                            {listOperatingSystemsQuery.isFetching ? (
                              <CircularProgress
                                color="inherit"
                                size={20}
                              />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
              >
                <Autocomplete
                  open={autocompleteOpen.developers}
                  onOpen={() => {
                    handleAutocompleteOpenToggle('developers', true);
                  }}
                  onClose={() => {
                    handleAutocompleteOpenToggle('developers', false);
                  }}
                  loading={listDevelopersQuery.isFetching}
                  value={formik.values.developers}
                  filterSelectedOptions
                  getOptionLabel={(option) => option.name}
                  id="developers"
                  multiple
                  onChange={(event: SyntheticEvent, newValue: string[]) => {
                    formik.setFieldValue('developers', newValue);
                  }}
                  options={developers}
                  renderInput={(params) => (
                    <TextInput
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
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <Fragment>
                            {listDevelopersQuery.isFetching ? (
                              <CircularProgress
                                color="inherit"
                                size={20}
                              />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
              >
                <Autocomplete
                  open={autocompleteOpen.features}
                  onOpen={() => {
                    handleAutocompleteOpenToggle('features', true);
                  }}
                  onClose={() => {
                    handleAutocompleteOpenToggle('features', false);
                  }}
                  loading={listFeaturesQuery.isFetching}
                  value={formik.values.features}
                  filterSelectedOptions
                  freeSolo
                  getOptionLabel={(option) => option.name}
                  id="features"
                  multiple
                  onChange={(event: SyntheticEvent, newValue: string[]) => {
                    formik.setFieldValue('features', newValue);
                  }}
                  options={features}
                  renderInput={(params) => (
                    <TextInput
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
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <Fragment>
                            {listFeaturesQuery.isFetching ? (
                              <CircularProgress
                                color="inherit"
                                size={20}
                              />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
              >
                <Autocomplete
                  open={autocompleteOpen.genres}
                  onOpen={() => {
                    handleAutocompleteOpenToggle('genres', true);
                  }}
                  onClose={() => {
                    handleAutocompleteOpenToggle('genres', false);
                  }}
                  loading={listGenresQuery.isFetching}
                  value={formik.values.genres}
                  filterSelectedOptions
                  getOptionLabel={(option) => option.name}
                  id="genres"
                  multiple
                  onChange={(event: SyntheticEvent, newValue: string[]) => {
                    formik.setFieldValue('genres', newValue);
                  }}
                  options={genres}
                  renderInput={(params) => (
                    <TextInput
                      {...params}
                      label="Genres"
                      name="genres"
                      onBlur={formik.handleBlur}
                      error={!!formik.touched.genres && !!formik.errors.genres}
                      helperText={
                        formik.touched.genres &&
                        (formik.errors.genres as string)
                      }
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <Fragment>
                            {listGenresQuery.isFetching ? (
                              <CircularProgress
                                color="inherit"
                                size={20}
                              />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
              >
                <TextInput
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
              <Grid
                item
                xs={12}
                sm={6}
              >
                <Autocomplete
                  open={autocompleteOpen.languages}
                  onOpen={() => {
                    handleAutocompleteOpenToggle('languages', true);
                  }}
                  onClose={() => {
                    handleAutocompleteOpenToggle('languages', false);
                  }}
                  loading={listLanguagesQuery.isFetching}
                  value={formik.values.languages}
                  filterSelectedOptions
                  freeSolo
                  getOptionLabel={(option) => option.name}
                  id="languages"
                  multiple
                  onChange={(event: SyntheticEvent, newValue: string[]) => {
                    formik.setFieldValue('languages', newValue);
                  }}
                  options={languages}
                  renderInput={(params) => (
                    <TextInput
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
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <Fragment>
                            {listLanguagesQuery.isFetching ? (
                              <CircularProgress
                                color="inherit"
                                size={20}
                              />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
              >
                <DateInput
                  label="Release Date"
                  value={formik.values.releaseDate}
                  onChange={(newValue: Date | null) => {
                    formik.setFieldValue('releaseDate', newValue);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      helperText:
                        formik.touched.releaseDate &&
                        (formik.errors.releaseDate as string),
                    },
                  }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
              >
                <TextInput
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
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      setPreviewSelected('minimumRequirements');
                      handleOpenDialog();
                    }}
                  >
                    <EyeIcon />
                  </IconButton>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
              >
                <TextInput
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
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      setPreviewSelected('recommendedRequirements');
                      handleOpenDialog();
                    }}
                  >
                    <EyeIcon />
                  </IconButton>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.shouldPublish}
                      name="shouldPublish"
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        formik.setFieldValue(
                          'shouldPublish',
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
              <Grid
                item
                xs={12}
              >
                <TextInput
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
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      setPreviewSelected('markdown');
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
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
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
