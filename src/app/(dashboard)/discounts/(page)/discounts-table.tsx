import { useDeleteDiscounts } from '@/api/discounts';
import { AlertDialog } from '@/components/alert-dialog';
import { DataTable } from '@/components/data-table';
import { DataTableHead, HeadCell } from '@/components/data-table-head';
import { SearchInput } from '@/components/search-input';
import { useDialog } from '@/hooks/useDialog';
import { useQueryValue } from '@/hooks/useQueryValue';
import { useSearch } from '@/hooks/useSearch';
import { Discount } from '@/types/discounts';
import {
  Box,
  Button,
  Card,
  MenuItem,
  TableBody,
  TextField,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, useState, type FC } from 'react';
import { DiscountsTableRow } from './discounts-table-row';

interface DiscountsTableProps {
  discounts?: Discount[];
  count?: number;
  isError: boolean;
  isLoading: boolean;
  refetch: any;
}

const headCells: HeadCell[] = [
  {
    id: 'title',
    label: 'Title',
    width: '32%',
  },
  {
    id: 'startDate',
    label: 'Start Date',
    width: '20%',
  },
  {
    id: 'endDate',
    label: 'End Date',
    width: '20%',
  },
  {
    id: 'status',
    label: 'Status',
    disableSort: true,
    width: '20%',
  },
];

const statusOptions = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Scheduled',
    value: 'scheduled',
  },
  {
    label: 'Expired',
    value: 'expired',
  },
];

export const DiscountsTable: FC<DiscountsTableProps> = (props) => {
  const { discounts, count, isError, isLoading, refetch } = props;
  const queryClient = useQueryClient();
  const [keyword, handleKeywordChange, handleSearch] = useSearch();
  const [selected, setSelected] = useState<string[]>([]);
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();
  const deleteDiscounts = useDeleteDiscounts(() =>
    queryClient.invalidateQueries({ queryKey: ['discounts'] })
  );
  const [status, setStatus] = useQueryValue('status', 'all', 'all');

  const handleStatusChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setStatus(event.target.value);
  };

  const handleSelect = (id: string): void => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((_id) => _id !== id);
      }

      return [...prevSelected, id];
    });
  };

  const handleSelectAll = (): void => {
    if (!discounts) return;

    setSelected((prevSelected) => {
      if (prevSelected.length === discounts?.length) {
        return [];
      }

      return discounts?.map((discount) => discount._id);
    });
  };

  const handleDeleteDiscounts = () => {
    deleteDiscounts.mutate(selected, {
      onSuccess: () => {
        setSelected([]);
        handleCloseDialog();
      },
    });
  };

  return (
    <>
      <Card>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              sm: `${!!selected.length ? 'auto' : ''} 1fr 240px`,
            },
            p: 2,
          }}
        >
          {!!selected.length && (
            <Button
              color="error"
              onClick={handleOpenDialog}
              variant="contained"
            >
              Bulk Delete {selected.length}
            </Button>
          )}
          <form onSubmit={handleSearch}>
            <SearchInput
              onChange={handleKeywordChange}
              placeholder="Search discounts..."
              value={keyword}
            />
          </form>
          <TextField
            select
            id="status"
            label="Status"
            onChange={handleStatusChange}
            value={status}
          >
            {statusOptions.map((status) => (
              <MenuItem
                key={status.value}
                value={status.value}
              >
                {status.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <DataTable
          isLoading={isLoading}
          count={count}
          hasError={isError}
          hasNoData={count === 0}
          headCellsCount={headCells.length}
          onRefetchData={refetch}
          headSlot={
            <DataTableHead
              isLoading={isLoading}
              headCells={headCells}
              selectedLength={selected.length}
              itemsLength={discounts?.length}
              onSelectAll={handleSelectAll}
            />
          }
        >
          <TableBody>
            {discounts?.map((discount) => (
              <DiscountsTableRow
                discount={discount}
                key={discount._id}
                onSelect={() => {
                  handleSelect(discount._id);
                }}
                selected={selected.includes(discount._id)}
              />
            ))}
          </TableBody>
        </DataTable>
      </Card>
      <AlertDialog
        content="Are you sure you want to permanently delete these discounts?"
        isLoading={deleteDiscounts.isPending}
        onClose={handleCloseDialog}
        onSubmit={handleDeleteDiscounts}
        open={dialogOpen}
        title={`Delete ${selected.length} articles`}
      />
    </>
  );
};
