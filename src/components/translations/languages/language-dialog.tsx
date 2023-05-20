import { useState } from 'react';
import type { FC, SyntheticEvent } from 'react';
import {
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  FormHelperText
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCreateLanguage } from '@/api/translations';
import { useQuery, useQueryClient } from 'react-query';
import { Button } from '@/components/button';
import languageOptions from "./languages.json";
import { appFetch } from '@/utils/app-fetch';
import type { Language } from '@/types/translations';

interface LanguageTagDialogProps {
  open: boolean;
  onClose: any;
}

const getLanguages = (config: Record<string, any> = {}) => () => appFetch<Language[]>({
  url: '/languages',
  withAuth: true,
  ...config
});

export const LanguageDialog: FC<LanguageTagDialogProps> = (props) => {
  const { open, onClose } = props;
  const { data: languages } = useQuery('languages', getLanguages());
  const languageCodes = (languages || []).map((language) => language.code);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const createLanguage = useCreateLanguage(() => queryClient.invalidateQueries('languages'));
  const formik = useFormik({
    initialValues: {
      code: '',
      name: '',
      nativeName: '',
    },
    validationSchema: Yup.object({
      code: Yup.string().required('Required'),
      name: Yup.string().required('Required'),
      nativeName: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      setSubmitError(null)
      createLanguage.mutate((values), {
        onSuccess: () => {
          onClose();
        },
        onError: (error) => {
          setSubmitError(error.message)
        }
      })
    },
  });

  const filteredLanguageOptions = languageOptions.filter((option) => !languageCodes.includes(option.code))

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Add language
      </DialogTitle>
      <DialogContent sx={{ py: '24px !important' }}>
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            xs={12}
          >
            <Autocomplete
              autoHighlight
              value={filteredLanguageOptions.find((option) => option.code === formik.values.code)?.code}
              filterSelectedOptions
              id="code"
              onChange={(event: SyntheticEvent, newValue: string | null) => {
                const selectedLanguage = filteredLanguageOptions.find((option) => option.name === newValue)
                !!selectedLanguage && formik.setValues(selectedLanguage)
              }}
              options={filteredLanguageOptions.map((option) => option.name)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Language"
                  name="code"
                  onBlur={formik.handleBlur}
                  error={!!formik.touched.code && !!formik.errors.code}
                  helperText={formik.touched.code && formik.errors.code}
                />
              )}
            />
          </Grid>
          {!!submitError && (
            <Grid
              item
              xs={12}
            >
              <FormHelperText error>
                {submitError}
              </FormHelperText>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="text"
          color="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => formik.handleSubmit()}
          isLoading={createLanguage.isLoading}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};
