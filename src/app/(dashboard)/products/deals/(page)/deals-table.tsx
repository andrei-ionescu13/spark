'use client';

import { AlertDialog } from '@/components/alert-dialog';
import { DataTable } from '@/components/data-table';
import { DataTableHead, HeadCell } from '@/components/data-table-head';
import { SearchInput } from '@/components/search-input';
import { useDialog } from '@/hooks/useDialog';
import { useQueryValue } from '@/hooks/useQueryValue';
import { useSearch } from '@/hooks/useSearch';
import { Deal } from '@/types/deal';
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
import { useDeleteDeals } from './api';
import { DealsTableRow } from './deals-table.row';

interface DealsTableProps {
  deals?: Deal[];
  count?: number;
  isError: boolean;
  isLoading: boolean;
  refetch: any;
}

const headCells: HeadCell[] = [
  {
    id: 'title',
    label: 'Title',
    width: '22%',
  },
  {
    id: 'products',
    label: 'Products',
    disableSort: true,
    width: '20%',
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
    width: '10%',
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

export const DealsTable: FC<DealsTableProps> = (props) => {
  const { deals, count, isError, isLoading, refetch } = props;
  const queryClient = useQueryClient();
  const [keyword, handleKeywordChange, handleSearch] = useSearch();
  const [selected, setSelected] = useState<string[]>([]);
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();
  const [status, setStatus] = useQueryValue('status', 'all', 'all');
  const deleteDeals = useDeleteDeals(() =>
    queryClient.invalidateQueries({ queryKey: ['deals'] })
  );

  const handleStatusChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setStatus(event.target.value);
  };

  const handleDeleteDeals = (): void => {
    deleteDeals.mutate(selected, {
      onSuccess: () => {
        setSelected([]);
        handleCloseDialog();
      },
      onError: (error) => {},
    });
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
    if (!deals) return;

    setSelected((prevSelected) => {
      if (prevSelected.length === deals?.length) {
        return [];
      }

      return deals?.map((deal) => deal._id);
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
              placeholder="Search products..."
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
              itemsLength={deals?.length}
              onSelectAll={handleSelectAll}
            />
          }
        >
          <TableBody>
            {deals?.map((deal) => (
              <DealsTableRow
                deal={deal}
                key={deal._id}
                onSelect={() => {
                  handleSelect(deal._id);
                }}
                selected={selected.includes(deal._id)}
              />
            ))}
          </TableBody>
        </DataTable>
      </Card>
      <AlertDialog
        content="Are you sure you want toelete these deals"
        isLoading={deleteDeals.isPending}
        onClose={handleCloseDialog}
        onSubmit={handleDeleteDeals}
        open={dialogOpen}
        title={`Delete ${selected.length} deals`}
      />
    </>
  );
};
