import type { FC } from 'react';
import { Checkbox, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { useSort } from '@/hooks/useSort';

export interface HeadCell {
  label: string;
  id: string;
  disableSort?: boolean
}

interface DataTableHeadProps {
  headCells: HeadCell[];
  selectedLength?: number;
  itemsLength?: number;
  onSelectAll?: any;
}

export const DataTableHead: FC<DataTableHeadProps> = (props) => {
  const [sortBy, sortOrder, handleSort] = useSort();

  const {
    headCells,
    selectedLength = 0,
    itemsLength = 0,
    onSelectAll
  } = props;

  return (
    <TableHead>
      <TableRow>
        {onSelectAll && (
          <TableCell padding="checkbox">
            <Checkbox
              checked={selectedLength > 0 && selectedLength === itemsLength}
              color="primary"
              indeterminate={selectedLength > 0 && selectedLength < itemsLength}
              onChange={onSelectAll}
            />
          </TableCell>
        )}
        {headCells.map((cell) => (
          cell?.disableSort ? (
            <TableCell
              key={cell.label}
              sx={{ fontWeight: 600 }}
            >
              {cell.label}
            </TableCell>
          ) : (
            <TableCell
              key={cell.label}
              sx={{ fontWeight: 600 }}
            >
              <TableSortLabel
                active={cell.id === sortBy}
                direction={cell.id === sortBy ? sortOrder : 'asc'}
                onClick={() => { handleSort(cell.id) }}
              >
                {cell.label}
              </TableSortLabel>
            </TableCell>
          )
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
  )
}
