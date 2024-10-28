"use client"
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
  TableBody,
  Checkbox,
  Link,
  TableCell,
  Skeleton,
  IconButton,
} from "@mui/material";
import { usePage } from "../hooks/usePage";
import { useLimit } from "../hooks/usePerPage";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import { TableDataError } from "./table-data-error";
import { TableNoData } from "./table-no-data";
import { DataTableRow } from "./data-table-row";
import { formatDate } from "@/utils/format-date";
import { ActionsIconButton } from "./icon-actions";
import { Label } from "./label";
import { DotsVertical } from "@/icons/dots-vertical";

interface DataTableProps {
  children: ReactNode;
  count?: number;
  removeSimplebar?: boolean;
  hasError: boolean;
  hasNoData: boolean;
  onRefetchData: any;
  headCellsCount: number;
  headSlot: ReactNode;
  isLoading: boolean;
}

const DataTableRoot = styled(TableContainer)(() => ({
  a: {
    color: "inherit",
  },
}));

const TextSkeleton = () => <Skeleton variant="text" width={'80px'} />

export const DataTable: FC<DataTableProps> = (props) => {
  const { children, count, removeSimplebar = false, hasError,
    hasNoData,
    onRefetchData,
    headCellsCount,
    headSlot,
    isLoading = false,
  } = props;
  const [page, handlePageChange] = usePage();
  const [limit, handleLimitChange] = useLimit();
  const [dense, setDense] = useState(false);

  const handleChangeDense = (event: ChangeEvent<HTMLInputElement>): void => {
    setDense(event.target.checked);
  };

  const getContent = () => {
    if (hasError) {
      return (
        <TableDataError
          colSpan={headCellsCount + 2}
          onRefetch={onRefetchData}
        />
      )
    }

    if (hasNoData) {
      return (
        <TableNoData colSpan={headCellsCount + 2} />
      )
    }

    if (isLoading) {
      return (
        <TableBody>
          {[...Array(limit).keys()].map((x) => (
            <DataTableRow key={x}>
              <TableCell padding="checkbox">
                <Checkbox color="primary" disabled />
              </TableCell>
              {[...Array(headCellsCount).keys()].map((x) => (
                <TableCell key={x}>
                  <TextSkeleton />
                </TableCell>
              ))}
              <TableCell align="right">
                <IconButton
                  color="primary"
                  disabled
                >
                  <DotsVertical />
                </IconButton>
              </TableCell>
            </DataTableRow>
          ))}
        </TableBody>
      );
    }

    return children;

  }

  return (
    <DataTableRoot>
      {removeSimplebar ? (
        <Box>
          <Table size={dense ? "small" : "medium"}>
            <>
              {headSlot}
              {getContent()}
            </>
          </Table>
        </Box>
      ) : (
        <SimpleBar>
          <Box>
            <Table size={dense ? "small" : "medium"}>
              {headSlot}
              {getContent()}
            </Table>
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
          count={count || 0}
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
