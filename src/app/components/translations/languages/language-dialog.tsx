import { Fragment, useState } from "react";
import type { FC, SyntheticEvent } from "react";
import {
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCreateTranslationsLanguage } from "@/api/translations";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../../button";
import { appFetch } from "../../../utils/app-fetch";
import type { Language } from "../../../types/translations";
import { TextInput } from "../../text-input";

interface LanguageTagDialogProps {
  open: boolean;
  onClose: any;
}

const listLanguages =
  (config: Record<string, any> = {}) =>
    () =>
      appFetch<Language[]>({
        url: "/languages",
        withAuth: true,
        ...config,
      });

const listTranslationsLanguages =
  (config: Record<string, any> = {}) =>
    () =>
      appFetch<Language[]>({
        url: "/translations/languages",
        withAuth: true,
        ...config,
      });

export const LanguageDialog: FC<LanguageTagDialogProps> = (props) => {
  const { open, onClose } = props;
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);

  const { data: translationsLanguages } = useQuery({
    queryKey: ["translations-languages"],
    queryFn: listTranslationsLanguages()
  });
  const { data: languages, isFetching } = useQuery(

    {
      queryKey: ["languages"],
      queryFn: listLanguages(),
      enabled: autocompleteOpen,
      gcTime: 0
    }
  );

  const languageCodes = (translationsLanguages || []).map(
    (language) => language.code
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const createTranslationsLanguage = useCreateTranslationsLanguage(() =>
    queryClient.invalidateQueries({ queryKey: ["translations-languages"] })
  );

  const initialValues: { language?: Language } = {
    language: undefined,
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      language: Yup.mixed().required(),
    }),
    onSubmit: (values) => {
      setSubmitError(null);
      createTranslationsLanguage.mutate(
        { ...values.language },
        {
          onSuccess: () => {
            onClose();
          },
          onError: (error) => {
            setSubmitError(error.message);
          },
        }
      );
    },
  });

  const filteredLanguageOptions = (languages || []).filter(
    (option) => !languageCodes.includes(option.code)
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add language</DialogTitle>
      <DialogContent sx={{ py: "24px !important" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              autoHighlight
              value={filteredLanguageOptions.find(
                (option) => option.code === formik.values.language?.code
              )}
              filterSelectedOptions
              id="code"
              onChange={(event: SyntheticEvent, newValue) => {
                newValue && formik.setValues({ language: newValue });
              }}
              getOptionLabel={(option) => option.name}
              options={filteredLanguageOptions}
              loading={isFetching}
              open={autocompleteOpen}
              onOpen={() => {
                setAutocompleteOpen(true);
              }}
              onClose={() => {
                setAutocompleteOpen(false);
              }}
              renderInput={(params) => (
                <TextInput
                  {...params}
                  size="small"
                  label="Language"
                  name="language"
                  onBlur={formik.handleBlur}
                  error={!!formik.touched.language && !!formik.errors.language}
                  helperText={formik.touched.language && formik.errors.language}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <Fragment>
                        {isFetching ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </Fragment>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          {!!submitError && (
            <Grid item xs={12}>
              <FormHelperText error>{submitError}</FormHelperText>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="text" color="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => formik.handleSubmit()}
          isLoading={createTranslationsLanguage.isPending}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};
