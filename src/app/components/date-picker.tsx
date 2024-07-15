import { Box, Typography } from "@mui/material";
import React, { FC } from "react";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

export const DateInput: FC<any> = (props) => {
  const { label, slotProps, ...rest } = props;
  const { textField } = slotProps;
  const { size = "small", error } = textField;

  return (
    <Box>
      {label && (
        <Typography
          variant="body2"
          color={error ? "error" : "textPrymary"}
          sx={{ mb: 1 }}
        >
          {label}
        </Typography>
      )}
      <DesktopDatePicker
        slotProps={{
          ...slotProps,
          textField: {
            size,
            error,
            ...slotProps.textField,
          },
        }}
        {...rest}
      />
    </Box>
  );
};
