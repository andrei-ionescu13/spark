'use client';

import { useDeleteCollections } from '@/api/collections';
import { AlertDialog } from '@/components/alert-dialog';
import { DataTable } from '@/components/data-table';
import { DataTableHead, HeadCell } from '@/components/data-table-head';
import { SearchInput } from '@/components/search-input';
import { useDialog } from '@/hooks/useDialog';
import { useQueryValue } from '@/hooks/useQueryValue';
import { useSearch } from '@/hooks/useSearch';
import { Collection } from '@/types/collection';
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
import { CollectionsTableRow } from './collections-table.row';

interface CollectionsTableProps {
  collections?: Collection[];
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

export const CollectionsTable: FC<CollectionsTableProps> = (props) => {
  const { collections, count, isError, isLoading, refetch } = props;
  const queryClient = useQueryClient();
  const [keyword, handleKeywordChange, handleSearch] = useSearch();
  const [selected, setSelected] = useState<string[]>([]);
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();
  const [status, setStatus] = useQueryValue('status', 'all', 'all');
  const deleteCollections = useDeleteCollections(() =>
    queryClient.invalidateQueries({ queryKey: ['collections'] })
  );

  const handleStatusChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setStatus(event.target.value);
  };

  const handleDeleteCollections = (): void => {
    deleteCollections.mutate(selected, {
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
    if (!collections) return;

    setSelected((prevSelected) => {
      if (prevSelected.length === collections?.length) {
        return [];
      }

      return collections?.map((collection) => collection._id);
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
              itemsLength={collections?.length}
              onSelectAll={handleSelectAll}
            />
          }
        >
          <TableBody>
            {collections?.map((collection) => (
              <CollectionsTableRow
                collection={collection}
                key={collection._id}
                onSelect={() => {
                  handleSelect(collection._id);
                }}
                selected={selected.includes(collection._id)}
              />
            ))}
          </TableBody>
        </DataTable>
      </Card>
      <AlertDialog
        content="Are you sure you want toelete these collections"
        isLoading={deleteCollections.isPending}
        onClose={handleCloseDialog}
        onSubmit={handleDeleteCollections}
        open={dialogOpen}
        title={`Delete ${selected.length} collections`}
      />
    </>
  );
};
