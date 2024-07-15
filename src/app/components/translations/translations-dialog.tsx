import type { FC } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Language, Translation } from "../../types/translations";
import {
  useAddNamespaceTranslation,
  useUpdateNamespaceTranslation,
} from "@/api/translations";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "../button";
import { TextInput } from "../text-input";

interface TranslationsDialogProps {
  open: boolean;
  onClose: () => void;
  translation?: Translation;
  mode?: "create" | "edit";
  namespaceId: string;
  languages: Language[];
}

export const TranslationsDialog: FC<TranslationsDialogProps> = (props) => {
  const {
    open,
    onClose,
    mode = "create",
    translation,
    namespaceId,
    languages,
  } = props;
  const queryClient = useQueryClient();
  const addNamespaceTranslation = useAddNamespaceTranslation(() =>
    queryClient.invalidateQueries({ queryKey: ["namespaces"] })
  );
  const updateNamespaceTranslation = useUpdateNamespaceTranslation(() =>
    queryClient.invalidateQueries({ queryKey: ["namespaces"] })
  );

  const initialValues: Translation = languages.reduce(
    (acc, { code }) => {
      return {
        ...acc,
        [code]: translation?.[code as keyof Translation] || "",
      };
    },
    { key: translation?.key || "" }
  );

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      if (mode === "create") {
        addNamespaceTranslation.mutate(
          { id: namespaceId, body: values },
          {
            onSuccess: () => {
              onClose();
            },
          }
        );

        return;
      }

      if (translation?.key) {
        const { key, ...formBody } = values;
        updateNamespaceTranslation.mutate(
          { id: namespaceId, translationKey: translation?.key, body: formBody },
          {
            onSuccess: () => {
              onClose();
            },
          }
        );
      }
    },
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {`${mode === "create" ? "Add" : "Update"} translation`}
      </DialogTitle>
      <DialogContent sx={{ py: "24px !important" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextInput
              disabled={!!translation?.key}
              error={!!formik.touched.key && !!formik.errors.key}
              fullWidth
              helperText={formik.touched.key && formik.errors.key}
              label="Key"
              name="key"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              size="small"
              value={formik.values.key}
            />
          </Grid>
          {languages.map((option) => (
            <Grid item xs={12} key={option.code}>
              <TextInput
                error={
                  !!formik.touched[option.code] && !!formik.errors[option.code]
                }
                fullWidth
                helperText={
                  formik.touched[option.code] && formik.errors[option.code]
                }
                label={option.name}
                name={option.code}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                size="small"
                value={formik.values[option.code]}
              />
            </Grid>
          ))}
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
          isLoading={
            addNamespaceTranslation.isPending ||
            updateNamespaceTranslation.isPending
          }
        >
          {mode === "create" ? "Add" : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
