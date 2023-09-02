import { useState } from "react";
import type { FC } from "react";
import { Box, FormControlLabel, Switch } from "@mui/material";
import { useDeleteLanguage } from "@/api/translations";
import { AlertDialog } from "@/components/alert-dialog";
import { useQueryClient } from "react-query";

interface LanguagesDeleteDialogProps {
  open: boolean;
  onClose: any;
  language: any;
}

export const LanguagesDeleteDialog: FC<LanguagesDeleteDialogProps> = (
  props
) => {
  const { open, onClose, language } = props;
  const queryClient = useQueryClient();
  const deleteLanguage = useDeleteLanguage(() =>
    queryClient.invalidateQueries("translations-languages")
  );
  const [shouldDeleteTranslations, setShouldDeleteTranslations] =
    useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShouldDeleteTranslations(event.target.checked);
  };

  const handleDeleteLanguage = () => {
    deleteLanguage.mutate(
      { id: language._id, shouldDeleteTranslations },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <AlertDialog
      open={open}
      onClose={onClose}
      title={`Delete ${language.name} language`}
      content="Are you sure you want to permanently delete this language?"
      onSubmit={handleDeleteLanguage}
      isLoading={deleteLanguage.isLoading}
    >
      <Box sx={{ pt: 3 }}>
        <FormControlLabel
          control={
            <Switch onChange={handleChange} value={shouldDeleteTranslations} />
          }
          label="Remove all associated translations"
        />
      </Box>
    </AlertDialog>
  );
};
