"use client"

import { useDeleteCollections } from '@/api/collections';
import { AlertDialog } from '@/components/alert-dialog';
import { CollectionsTableRow } from '@/components/collections/list/collections-table.row';
import { DataTable } from '@/components/data-table';
import { DataTableHead, HeadCell } from '@/components/data-table-head';
import { SearchInput } from '@/components/search-input';
import { useDialog } from '@/hooks/useDialog';
import { useQueryValue } from '@/hooks/useQueryValue';
import { useSearch } from '@/hooks/useSearch';
import { Card, Box, Button, TextField, MenuItem, TableBody } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, useState, type FC } from 'react'
import { searchCollections } from '../api-calls';
import { useSearchCollectionsQuery } from '../api-calls-hooks';

interface CollectionsTableProps {

}

const headCells: HeadCell[] = [
  {
    id: "title",
    label: "Title",
  },
  {
    id: "products",
    label: "Products",
    disableSort: true,
  },
  {
    id: "startDate",
    label: "Start Date",
  },
  {
    id: "endDate",
    label: "End Date",
  },
  {
    id: "status",
    label: "Status",
    disableSort: true,
  },
];

const statusOptions = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Scheduled",
    value: "scheduled",
  },
  {
    label: "Expired",
    value: "expired",
  },
];


export const CollectionsTable: FC<CollectionsTableProps> = () => {
  const queryClient = useQueryClient();
  const [keyword, handleKeywordChange, handleSearch] =
    useSearch();
  const [selected, setSelected] = useState<string[]>([]);
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();
  const { error, data } = useSearchCollectionsQuery();
  const [status, setStatus] = useQueryValue("status", "all", "all");
  const deleteCollections = useDeleteCollections(() =>
    queryClient.invalidateQueries({ queryKey: ["collections"] })
  );

  if (!data) return null;

  const { collections, count } = data;

  const handleStatusChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setStatus(event.target.value);
  };

  const handleDeleteCollections = (): void => {
    deleteCollections.mutate(selected, {
      onSuccess: () => {
        setSelected([]);
        handleCloseDialog();
      },
      onError: (error) => { },
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
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              sm: `${!!selected.length ? "auto" : ""} 1fr 240px`,
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
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <DataTable count={count}>
          <DataTableHead
            headCells={headCells}
            selectedLength={selected.length}
            itemsLength={collections.length}
            onSelectAll={handleSelectAll}
          />
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
  )
};
