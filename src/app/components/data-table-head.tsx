import {
  Checkbox,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import type { FC } from 'react';
import { useSort } from '../hooks/useSort';

export interface HeadCell {
  label: string;
  id: string;
  disableSort?: boolean;
  width?: string;
}

interface DataTableHeadProps {
  headCells: HeadCell[];
  selectedLength?: number;
  itemsLength?: number;
  onSelectAll?: any;
  isLoading?: boolean;
}

export const DataTableHead: FC<DataTableHeadProps> = (props) => {
  const [sortBy, sortOrder, handleSort] = useSort();

  const {
    headCells,
    selectedLength = 0,
    itemsLength = 0,
    onSelectAll,
    isLoading = false,
  } = props;

  return (
    <TableHead>
      <TableRow>
        {onSelectAll && (
          <TableCell
            width="3%"
            padding="checkbox"
          >
            <Checkbox
              checked={selectedLength > 0 && selectedLength === itemsLength}
              color="primary"
              indeterminate={selectedLength > 0 && selectedLength < itemsLength}
              onChange={onSelectAll}
              disabled={isLoading || itemsLength === 0}
            />
          </TableCell>
        )}
        {headCells.map((cell) => (
          <TableCell
            key={cell.label}
            sx={{ fontWeight: 600 }}
            width={cell.width}
          >
            {cell?.disableSort ? (
              cell.label
            ) : (
              <TableSortLabel
                active={cell.id === sortBy}
                direction={cell.id === sortBy ? sortOrder : 'asc'}
                onClick={() => {
                  handleSort(cell.id);
                }}
              >
                {cell.label}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
        <TableCell
          align="right"
          sx={{ fontWeight: 600 }}
          width="5%"
        >
          Actions
        </TableCell>
      </TableRow>
    </TableHead>
  );
};
