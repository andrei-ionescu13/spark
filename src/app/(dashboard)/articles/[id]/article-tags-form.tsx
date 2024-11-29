import { Button } from '@/components/button';
import { TextInput } from '@/components/text-input';
import {
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
} from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import type { FC, SyntheticEvent } from 'react';
import { useState } from 'react';
import * as Yup from 'yup';
import { Article } from '../../../types/articles';
import { listTags } from '../tags/api';
import { useUpdateArticleTags } from './api';

interface ArticleMetaFormProps {
  article: Article;
  onClose: any;
  open: boolean;
}

export const ArticleTagsForm: FC<ArticleMetaFormProps> = (props) => {
  const { open, onClose, article } = props;
  const { data: tags, isLoading } = useQuery({
    queryKey: ['article-tags'],
    queryFn: listTags,
  });

  const updateArticleTags = useUpdateArticleTags(article._id);
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formik = useFormik({
    initialValues: {
      tags: article.tags,
    },
    validationSchema: Yup.object({
      tags: Yup.array().of(Yup.mixed()).min(1),
    }),
    onSubmit: (values) => {
      setSubmitError(null);
      const formValues = {
        tags: values.tags.map((tag) => tag._id),
      };
      updateArticleTags.mutate(formValues, {
        onSuccess: (data) => {
          queryClient.setQueryData(['articles', article._id], {
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

  const articleTagIds = formik.values.tags.map((tag) => tag._id);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Update Tags</DialogTitle>
      <DialogContent>
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            xs={12}
          >
            {isLoading || !tags ? null : (
              <Autocomplete
                autoHighlight
                value={formik.values.tags}
                filterSelectedOptions
                getOptionLabel={(option) => option.name}
                id="tags"
                multiple
                onChange={(event: SyntheticEvent, newValue) => {
                  formik.setFieldValue('tags', newValue);
                }}
                options={tags.filter(
                  (option) => !articleTagIds.includes(option._id)
                )}
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
            )}
          </Grid>
        </Grid>
        {!!submitError && (
          <FormHelperText
            error
            sx={{ mt: 1 }}
          >
            {submitError}
          </FormHelperText>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          onClick={onClose}
          variant="text"
        >
          Cancel
        </Button>
        <Button
          color="primary"
          isLoading={updateArticleTags.isPending}
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
