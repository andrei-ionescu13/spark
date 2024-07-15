import type { FC } from "react";
import { InformationCircle as InformationCircleIcon } from "../icons/information-circle";
import { Box, TextField, Tooltip, Typography } from "@mui/material";
import type { TextFieldProps } from "@mui/material";

type TextInputProps = TextFieldProps & {
  info?: string;
};

export const TextInput: FC<TextInputProps> = (props) => {
  const { label, error, size = "small", info, ...rest } = props;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        {label && (
          <Typography variant="body2" color={error ? "error" : "textPrymary"}>
            {label}
          </Typography>
        )}
        {info && (
          <Tooltip title={info}>
            <InformationCircleIcon />
          </Tooltip>
        )}
      </Box>
      <TextField error={error} size={size} {...rest} />
    </Box>
  );
};
