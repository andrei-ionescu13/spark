import type { FC } from "react";
import { Box, Paper } from "@mui/material";

interface TableNoDataProps {
  onReload: () => void;
  colSpan: number;
}

export const TableNoData: FC<TableNoDataProps> = (props) => {
  const { colSpan } = props;

  return (
    <tr>
      <td colSpan={colSpan}>
        <Box sx={{ p: 2 }}>
          <Paper
            sx={{
              py: 10,
              width: "100%",
              backgroundColor: "#202632",
              display: "grid",
              placeItems: "center",
            }}
          >
            There is no data available
          </Paper>
        </Box>
      </td>
    </tr>
  );
};
