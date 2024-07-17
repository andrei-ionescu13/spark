"use client"

import { useDeletePublishers } from '@/api/publishers';
import { AlertDialog } from '@/components/alert-dialog';
import { DataTable } from '@/components/data-table';
import { HeadCell, DataTableHead } from '@/components/data-table-head';
import { PublishersTableRow } from '@/components/products/publishers/publishers-table-row';
import { SearchInput } from '@/components/search-input';
import { useDialog } from '@/hooks/useDialog';
import { useSearch } from '@/hooks/useSearch';
import { Card, Box, Button, TableBody } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useState, type FC } from 'react'
import { useSearchDevelopersQuery, useSearchPublishersQuery } from '../api-calls-hooks';

interface PublishersTableProps {

}

const headCells: HeadCell[] = [
  {
    id: "name",
    label: "Name",
  },
];

export const PublishersTable: FC<PublishersTableProps> = (props) => {
  const queryClient = useQueryClient();
  const [keyword, handleKeywordChange, handleSearch] =
    useSearch();
  const { data } = useSearchPublishersQuery();
  const [selected, setSelected] = useState<string[]>([]);
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();
  const deletePublishers = useDeletePublishers(() =>
    queryClient.invalidateQueries({ queryKey: ["publishers"] })
  );

  if (!data) return null;

  const { publishers, count } = data;

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
      if (prevSelected.length === publishers?.length) {
        return [];
      }

      return publishers?.map((publisher) => publisher._id);
    });
  };

  const handleDeletePublishers = () => {
    deletePublishers.mutate(selected, {
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
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              sm: `${!!selected.length ? "auto" : ""} 1fr`,
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
              placeholder="Search publishers..."
              value={keyword}
            />
          </form>
        </Box>
        <DataTable count={count}>
          <DataTableHead
            headCells={headCells}
            selectedLength={selected.length}
            itemsLength={publishers.length}
            onSelectAll={handleSelectAll}
          />
          <TableBody>
            {publishers.map((publisher) => (
              <PublishersTableRow
                publisher={publisher}
                key={publisher._id}
                onSelect={() => {
                  handleSelect(publisher._id);
                }}
                selected={selected.includes(publisher._id)}
              />
            ))}
          </TableBody>
        </DataTable>
      </Card>
      <AlertDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        title={`Delete multiple publishers`}
        content="Are you sure you want to permanently delete these publisher?"
        onSubmit={handleDeletePublishers}
        isLoading={deletePublishers.isPending}
      />
    </>
  )
};
