import type { FC } from "react";
import { Box, Paper } from "@mui/material";
import { Button } from "./button";
import { ArrowPath as ArrowPathIcon } from "../icons/arrow-path";

interface DataErrorProps {
  onReload: () => void;
  colSpan: number;
}

export const TableDataError: FC<DataErrorProps> = (props) => {
  const { onReload, colSpan } = props;

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
            <p>An error has occurred</p>
            <Button
              onClick={onReload}
              color="error"
              variant="contained"
              sx={{
                display: "inline-flex",
                alignContent: "center",
                gap: 2,
              }}
            >
              <ArrowPathIcon sx={{ mr: 1 }} />
              Reload data
            </Button>
          </Paper>
        </Box>
      </td>
    </tr>
  );
};
