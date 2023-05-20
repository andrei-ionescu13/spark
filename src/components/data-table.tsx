import { useState, ReactNode } from "react";
import type { FC, ChangeEvent } from "react";
import {
  Box,
  Table,
  TableContainer,
  TablePagination,
  FormControlLabel,
  Switch,
  styled,
} from "@mui/material";
import { usePage } from "@/hooks/usePage";
import { useLimit } from "@/hooks/usePerPage";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";

interface DataTableProps {
  children: ReactNode;
  count: number;
  removeSimplebar?: boolean;
}

const DataTableRoot = styled(TableContainer)(() => ({
  a: {
    color: "inherit",
  },
}));

export const DataTable: FC<DataTableProps> = (props) => {
  const { children, count, removeSimplebar = false } = props;
  const [page, handlePageChange] = usePage();
  const [limit, handleLimitChange] = useLimit();
  const [dense, setDense] = useState(false);

  const handleChangeDense = (event: ChangeEvent<HTMLInputElement>): void => {
    setDense(event.target.checked);
  };

  return (
    <DataTableRoot>
      {removeSimplebar ? (
        <Box>
          <Table size={dense ? "small" : "medium"}>{children}</Table>
        </Box>
      ) : (
        <SimpleBar>
          <Box>
            <Table size={dense ? "small" : "medium"}>{children}</Table>
          </Box>
        </SimpleBar>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          pl: 2,
          minHeight: 52,
        }}
      >
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense padding"
        />
        <Box sx={{ flexGrow: 1 }} />
        <TablePagination
          component="div"
          count={count}
          onPageChange={handlePageChange}
          page={page}
          onRowsPerPageChange={handleLimitChange}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>
    </DataTableRoot>
  );
};
