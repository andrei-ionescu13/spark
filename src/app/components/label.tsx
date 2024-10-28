import type { FC, ReactNode } from "react";
import { Box } from "@mui/material";
import { alpha } from '@mui/material/styles';

interface LabelProps {
  children: ReactNode;
  color: string;
}

export const Label: FC<LabelProps> = (props) => {
  const { children, color } = props;

  return (
    <Box
      sx={{
        backgroundColor: alpha(color, 0.15),
        color,
        textTransform: 'capitalize',
        fontWeight: 600,
        width: 'fit-content',
        px: 1,
        borderRadius: 1,
        fontSize: 14
      }}
    >
      {children}
    </Box>
  )
}
