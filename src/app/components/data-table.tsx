'use client';
import { DotsVertical } from '@/icons/dots-vertical';
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  Skeleton,
  styled,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
} from '@mui/material';
import type { ChangeEvent, FC } from 'react';
import { ReactNode, useState } from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { usePage } from '../hooks/usePage';
import { useLimit } from '../hooks/usePerPage';
import { DataTableRow } from './data-table-row';
import { TableDataError } from './table-data-error';
import { TableNoData } from './table-no-data';

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
  hasCheckbox?: boolean;
  hasAction?: boolean;
}

const DataTableRoot = styled(TableContainer)(() => ({
  a: {
    color: 'inherit',
  },
  tbody: {
    textWrap: 'nowrap',
  },
}));

const TextSkeleton = () => (
  <Skeleton
    variant="text"
    width={'80px'}
  />
);

export const DataTable: FC<DataTableProps> = (props) => {
  const {
    children,
    count,
    removeSimplebar = false,
    hasError,
    hasNoData,
    onRefetchData,
    headCellsCount,
    headSlot,
    isLoading = false,
    hasCheckbox = true,
    hasAction = true,
  } = props;
  const [page, handlePageChange] = usePage();
  const [limit, handleLimitChange] = useLimit();
  const [dense, setDense] = useState(false);

  let extraCellsCount = 0;
  hasCheckbox && extraCellsCount++;
  hasAction && extraCellsCount++;

  const handleChangeDense = (event: ChangeEvent<HTMLInputElement>): void => {
    setDense(event.target.checked);
  };

  const getContent = () => {
    if (hasError) {
      return (
        <TableDataError
          colSpan={headCellsCount + extraCellsCount}
          onRefetch={onRefetchData}
        />
      );
    }

    if (hasNoData) {
      return <TableNoData colSpan={headCellsCount + extraCellsCount} />;
    }

    if (isLoading) {
      return (
        <TableBody>
          {[...Array(limit).keys()].map((x) => (
            <DataTableRow key={x}>
              {hasCheckbox && (
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    disabled
                  />
                </TableCell>
              )}
              {[...Array(headCellsCount).keys()].map((x) => (
                <TableCell key={x}>
                  <TextSkeleton />
                </TableCell>
              ))}
              {hasAction && (
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    disabled
                  >
                    <DotsVertical />
                  </IconButton>
                </TableCell>
              )}
            </DataTableRow>
          ))}
        </TableBody>
      );
    }

    return children;
  };

  return (
    <DataTableRoot>
      {removeSimplebar ? (
        <Box>
          <Table size={dense ? 'small' : 'medium'}>
            <>
              {headSlot}
              {getContent()}
            </>
          </Table>
        </Box>
      ) : (
        <SimpleBar>
          <Box>
            <Table size={dense ? 'small' : 'medium'}>
              {headSlot}
              {getContent()}
            </Table>
          </Box>
        </SimpleBar>
      )}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          pl: 2,
          minHeight: 52,
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={dense}
              onChange={handleChangeDense}
            />
          }
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
