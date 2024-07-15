import { useRef } from "react";
import type { FC, ChangeEvent } from "react";
import {
  Box,
  Card,
  CardContent,
  FormHelperText,
  Typography,
} from "@mui/material";
import { Button } from "../../button";
import { useFormik } from "formik";
import * as Yup from "yup";

interface ProductFormKeysProps {
  onSubmit: any;
  onBack: any;
  values: any;
  isLoading: boolean;
}

export const ProductFormKeys: FC<ProductFormKeysProps> = (props) => {
  const { onBack, onSubmit, values, isLoading } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const formik = useFormik({
    initialValues: {
      keys: values.keys || null,
    },
    validationSchema: Yup.object({
      keys: Yup.mixed().required("File required"),
    }),
    onSubmit: (values) => {
      onSubmit(values);
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
    <Box>
      <Card>
        <CardContent
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
          {!!formik.errors.keys && (
            <FormHelperText error>
              {formik.errors.keys as string}
            </FormHelperText>
          )}
        </CardContent>
      </Card>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button color="inherit" onClick={onBack} size="large" sx={{ mr: 1 }}>
          Back
        </Button>
        <Button
          onClick={() => formik.handleSubmit()}
          size="large"
          variant="contained"
          isLoading={isLoading}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};
