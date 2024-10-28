"use client"

import { useRef } from "react";
import type { FC, ChangeEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AlertDialog } from "../../../../components/alert-dialog";
import { Box, FormHelperText, Typography } from "@mui/material";
import { useImportProductKeys } from "@/api/products";
import { buildFormData } from "../../../../utils/build-form-data";
import { useParams, useRouter } from "next/navigation";
import { Button } from "../../../../components/button";

interface ProductImportKeysDialogProps {
  open: boolean;
  onClose: any;
}

export const ProductImportKeysDialog: FC<ProductImportKeysDialogProps> = (
  props
) => {
  const { open, onClose } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const importProductKeys = useImportProductKeys(() =>
    queryClient.invalidateQueries({ queryKey: ["product-keys", id] })
  );
  const initialValues: { keys?: File } = {
    keys: undefined,
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      keys: Yup.mixed().required("File required"),
    }),
    onSubmit: (values) => {
      const formData = buildFormData(values);
      importProductKeys.mutate(
        { id, formData },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    },
  });

  const handleSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0] && !event.target.files?.[0]) {
      return;
    }

    if (event.target.files[0]?.type !== "text/plain") {
      formik.setFieldError("keys", "the file should be a text file");
      return;
    }

    formik.setFieldValue("keys", event.target.files[0]);
  };

  return (
    <AlertDialog
      open={open}
      onClose={onClose}
      title="Import keys"
      onSubmit={() => {
        formik.handleSubmit();
      }}
      isLoading={importProductKeys.isPending}
      maxWidth="sm"
      fullWidth
    >
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          gap: 2,
          input: {
            display: "none",
          },
        }}
      >
        <Typography color="textSecondary" variant="body1">
          Please import a file
        </Typography>
        <input
          type="file"
          name="keys"
          onChange={handleSelectFile}
          ref={inputRef}
        />
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            inputRef.current?.click();
          }}
        >
          Import
        </Button>
        {!!formik.values.keys && (
          <Typography color="textPrimary" textAlign="center" variant="body2">
            {formik.values.keys?.name}
            <br />
            <Typography
              color="textPrimary"
              textAlign="center"
              variant="subtitle1"
              component="span"
            >
              Loaded
            </Typography>
          </Typography>
        )}
        {importProductKeys.isError && (
          <FormHelperText error sx={{ mt: 1 }}>
            {importProductKeys.error.message}
          </FormHelperText>
        )}
      </Box>
    </AlertDialog>
  );
};
