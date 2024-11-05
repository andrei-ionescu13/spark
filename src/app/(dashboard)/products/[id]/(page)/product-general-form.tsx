import { useUpdateProductGeneral } from '@/api/products';
import { Button } from '@/components/button';
import { DateInput } from '@/components/date-picker';
import { MarkdownPreview } from '@/components/markdown-preview';
import { TextInput } from '@/components/text-input';
import { useDialog } from '@/hooks/useDialog';
import { Eye } from '@/icons/eye';
import { Developer } from '@/types/developer';
import { Feature } from '@/types/feature';
import { Genre } from '@/types/genres';
import { OperatingSystem } from '@/types/operating-sistem';
import { Platform } from '@/types/platforms';
import { Product } from '@/types/products';
import { Publisher } from '@/types/publishers';
import { Language } from '@/types/translations';
import { appFetch } from '@/utils/app-fetch';
import { getStatusFromInterval } from '@/utils/get-status-from-interval';
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import type { FC, SyntheticEvent } from 'react';
import { Fragment, useState } from 'react';
import * as Yup from 'yup';

const listGenres =
  (config: Record<string, any> = {}) =>
  () =>
    appFetch<Genre[]>({ url: '/genres', withAuth: true, ...config });
const listPublishers =
  (config: Record<string, any> = {}) =>
  () =>
    appFetch<Publisher[]>({ url: '/publishers', withAuth: true, ...config });
const listPlatforms =
  (config: Record<string, any> = {}) =>
  () =>
    appFetch<Platform[]>({ url: '/platforms', withAuth: true, ...config });
const listDevelopers =
  (config: Record<string, any> = {}) =>
  () =>
    appFetch<Developer[]>({ url: '/developers', withAuth: true, ...config });
const listFeatures =
  (config: Record<string, any> = {}) =>
  () =>
    appFetch<Feature[]>({ url: '/features', withAuth: true, ...config });
const listLanguages =
  (config: Record<string, any> = {}) =>
  () =>
    appFetch<Language[]>({ url: '/languages', withAuth: true, ...config });
const listOperatingSystems =
  (config: Record<string, any> = {}) =>
  () =>
    appFetch<OperatingSystem[]>({
      url: '/operating-systems',
      withAuth: true,
      ...config,
    });

interface FormValues
  extends Pick<
    Product,
    | 'title'
    | 'genres'
    | 'releaseDate'
    | 'publisher'
    | 'developers'
    | 'languages'
    | 'features'
    | 'link'
    | 'markdown'
    | 'slug'
    | 'os'
    | 'platform'
    | 'minimumRequirements'
    | 'recommendedRequirements'
  > {
  price?: number;
}

interface ProductGeneralFormProps {
  product: Product;
  onClose: () => void;
}

export const ProductGeneralForm: FC<ProductGeneralFormProps> = (props) => {
  const { product, onClose } = props;
  const queryClient = useQueryClient();
  const updateProductGeneral = useUpdateProductGeneral(product._id);
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();
  const [previewSelected, setPreviewSelected] = useState<
    'minimumRequirements' | 'recommendedRequirements' | 'markdown' | undefined
  >();
  const discountStatus =
    product.discount &&
    getStatusFromInterval(product.discount.startDate, product.discount.endDate);

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
  const developersQuery = useQuery({
    queryKey: ['developers'],
    queryFn: listDevelopers(),
    enabled: autocompleteOpen.developers,
  });
  const featuresQuery = useQuery({
    queryKey: ['features'],
    queryFn: listFeatures(),
    enabled: autocompleteOpen.features,
  });
  const genresQuery = useQuery({
    queryKey: ['genres'],
    queryFn: listGenres(),
    enabled: autocompleteOpen.genres,
  });
  const languagesQuery = useQuery({
    queryKey: ['languages'],
    queryFn: listLanguages(),
    enabled: autocompleteOpen.languages,
  });
  const operatingSystemsQuery = useQuery({
    queryKey: ['operating-systems'],
    queryFn: listOperatingSystems(),
    enabled: autocompleteOpen.os,
  });
  const platformsQuery = useQuery({
    queryKey: ['platforms'],
    queryFn: listPlatforms(),
    enabled: autocompleteOpen.platform,
  });
  const publishersQuery = useQuery({
    queryKey: ['publishers'],
    queryFn: listPublishers(),
    enabled: autocompleteOpen.publisher,
  });

  const genres = genresQuery.data || [];
  const publishers = publishersQuery.data || [];
  const platforms = platformsQuery.data || [];
  const developers = developersQuery.data || [];
  const features = featuresQuery.data || [];
  const languages = languagesQuery.data || [];
  const operatingSystems = operatingSystemsQuery.data || [];

  const initialValues: FormValues = {
    title: product.title,
    price: product.price,
    genres: product.genres,
    releaseDate: new Date(product.releaseDate),
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
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      title: Yup.string().required(),
      price: Yup.number().positive(),
      genres: Yup.array().of(Yup.mixed()).min(1),
      releaseDate: Yup.date().required(),
      slug: Yup.string().required(),
      publisher: Yup.mixed().required(),
      platform: Yup.mixed().required(),
      developers: Yup.array().of(Yup.mixed()).min(1),
      languages: Yup.array().of(Yup.mixed()).min(1),
      features: Yup.array().of(Yup.mixed()).min(1),
      link: Yup.string().required(),
      os: Yup.array().of(Yup.mixed()).min(1),
      markdown: Yup.string().required(),
      minimumRequirements: Yup.string().required(),
      recommendedRequirements: Yup.string().required(),
    }),
    onSubmit: (values) => {
      const formValues = {
        ...values,
        genres: values.genres.map((genre) => genre._id),
        features: values.features.map((feature) => feature._id),
        developers: values.developers.map((developer) => developer._id),
        os: values.os.map((_os) => _os._id),
        platform: values.platform._id,
        publisher: values.publisher._id,
      };

      if (discountStatus !== 'expired') {
        delete formValues.price;
      }
      updateProductGeneral.mutate(formValues, {
        onSuccess: (updatedProduct) => {
          queryClient.setQueryData(['product', product._id], {
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
                  disabled={product.discount && discountStatus !== 'expired'}
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
                  info={
                    product.discount && discountStatus !== 'expired'
                      ? `Cannot change price for a product with ${discountStatus} discount`
                      : ''
                  }
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
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
              >
                <Autocomplete
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  open={autocompleteOpen.publisher}
                  onOpen={() => {
                    handleAutocompleteOpenToggle('publisher', true);
                  }}
                  onClose={() => {
                    handleAutocompleteOpenToggle('publisher', false);
                  }}
                  loading={publishersQuery.isFetching}
                  autoSelect
                  value={formik.values.publisher}
                  getOptionLabel={(option) => option.name}
                  id="publisher"
                  onChange={(event: SyntheticEvent, newValue) => {
                    formik.setFieldValue('publisher', newValue);
                  }}
                  filterSelectedOptions
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
                            {publishersQuery.isFetching ? (
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
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  open={autocompleteOpen.platform}
                  onOpen={() => {
                    handleAutocompleteOpenToggle('platform', true);
                  }}
                  onClose={() => {
                    handleAutocompleteOpenToggle('platform', false);
                  }}
                  loading={platformsQuery.isFetching}
                  autoSelect
                  value={formik.values.platform}
                  getOptionLabel={(option) => option.name}
                  id="platform"
                  onChange={(event: SyntheticEvent, newValue) => {
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
                            {platformsQuery.isFetching ? (
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
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  open={autocompleteOpen.os}
                  onOpen={() => {
                    handleAutocompleteOpenToggle('os', true);
                  }}
                  onClose={() => {
                    handleAutocompleteOpenToggle('os', false);
                  }}
                  loading={operatingSystemsQuery.isFetching}
                  value={formik.values.os}
                  filterSelectedOptions
                  getOptionLabel={(option) => option.name}
                  id="os"
                  multiple
                  onChange={(event: SyntheticEvent, newValue) => {
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
                            {operatingSystemsQuery.isFetching ? (
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
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  onOpen={() => {
                    handleAutocompleteOpenToggle('developers', true);
                  }}
                  onClose={() => {
                    handleAutocompleteOpenToggle('developers', false);
                  }}
                  loading={developersQuery.isFetching}
                  filterOptions={(x) => x}
                  value={formik.values.developers}
                  filterSelectedOptions
                  getOptionLabel={(option) => option.name}
                  id="developers"
                  multiple
                  onChange={(event: SyntheticEvent, newValue) => {
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
                            {developersQuery.isFetching ? (
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
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  open={autocompleteOpen.features}
                  onOpen={() => {
                    handleAutocompleteOpenToggle('features', true);
                  }}
                  onClose={() => {
                    handleAutocompleteOpenToggle('features', false);
                  }}
                  loading={featuresQuery.isFetching}
                  value={formik.values.features}
                  filterSelectedOptions
                  getOptionLabel={(option) => option.name}
                  id="features"
                  multiple
                  onChange={(event: SyntheticEvent, newValue) => {
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
                            {featuresQuery.isFetching ? (
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
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  open={autocompleteOpen.genres}
                  onOpen={() => {
                    handleAutocompleteOpenToggle('genres', true);
                  }}
                  onClose={() => {
                    handleAutocompleteOpenToggle('genres', false);
                  }}
                  loading={genresQuery.isFetching}
                  value={formik.values.genres}
                  filterSelectedOptions
                  getOptionLabel={(option) => option.name}
                  id="genres"
                  multiple
                  onChange={(event: SyntheticEvent, newValue) => {
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
                            {genresQuery.isFetching ? (
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
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  open={autocompleteOpen.languages}
                  onOpen={() => {
                    handleAutocompleteOpenToggle('languages', true);
                  }}
                  onClose={() => {
                    handleAutocompleteOpenToggle('languages', false);
                  }}
                  loading={languagesQuery.isFetching}
                  value={formik.values.languages}
                  filterSelectedOptions
                  getOptionLabel={(option) => option.name}
                  id="languages"
                  multiple
                  onChange={(event: SyntheticEvent, newValue) => {
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
                            {languagesQuery.isFetching ? (
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
                    <Eye />
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
                    <Eye />
                  </IconButton>
                </Box>
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
                    <Eye />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
          }}
        >
          <Button
            color="inherit"
            size="large"
            sx={{ mr: 1 }}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              formik.handleSubmit();
            }}
            isLoading={updateProductGeneral.isPending}
          >
            Update
          </Button>
        </Box>
      </Box>
    </>
  );
};
