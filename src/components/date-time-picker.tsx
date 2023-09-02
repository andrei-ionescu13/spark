import { Box, TextField, Typography } from "@mui/material";
import type { TextFieldProps } from "@mui/material";
import React, { FC } from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import type {
  DesktopDatePickerProps,
  DesktopDatePickerSlotsComponent,
} from "@mui/x-date-pickers/DesktopDatePicker";

export const DateTimeInput: FC<any> = (props) => {
  const { label, slotProps, ...rest } = props;
  const { textField } = slotProps;
  const { size = "small", error } = textField;

  return (
    <Box>
      {label && (
        <Typography
          variant="body2"
          color={error ? "error" : "textPrymary"}
          sx={{ mb: 0.5 }}
        >
          {label}
        </Typography>
      )}

      <DateTimePicker
        slotProps={{
          ...slotProps,
          textField: {
            size,
            error,
            ...slotProps.textField,
            // helperText:
            //   formik.touched.releaseDate &&
            //   (formik.errors.releaseDate as string),
          },
        }}
        {...rest}
      />
      {/* <TextField error={error} size={size} {...rest} /> */}
    </Box>
  );
};
