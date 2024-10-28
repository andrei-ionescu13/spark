'use client';

import { useDeletePublishers } from '@/api/publishers';
import { AlertDialog } from '@/components/alert-dialog';
import { DataTable } from '@/components/data-table';
import { DataTableHead, HeadCell } from '@/components/data-table-head';
import { SearchInput } from '@/components/search-input';
import { useDialog } from '@/hooks/useDialog';
import { useSearch } from '@/hooks/useSearch';
import { Publisher } from '@/types/publishers';
import { Box, Button, Card, TableBody } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useState, type FC } from 'react';
import { PublishersTableRow } from './publishers-table-row';

interface PublishersTableProps {
  publishers?: Publisher[];
  count?: number;
  isError: boolean;
  isLoading: boolean;
  refetch: any;
}

const headCells: HeadCell[] = [
  {
    id: 'name',
    label: 'Name',
  },
];

export const PublishersTable: FC<PublishersTableProps> = (props) => {
  const { publishers, count, isError, isLoading, refetch } = props;
  const queryClient = useQueryClient();
  const [keyword, handleKeywordChange, handleSearch] = useSearch();
  const [selected, setSelected] = useState<string[]>([]);
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();
  const deletePublishers = useDeletePublishers(() =>
    queryClient.invalidateQueries({ queryKey: ['publishers'] })
  );

  const handleSelect = (id: string): void => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((_id) => _id !== id);
      }

      return [...prevSelected, id];
    });
  };

  const handleSelectAll = (): void => {
    if (!publishers) return;

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
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              sm: `${!!selected.length ? 'auto' : ''} 1fr`,
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
              itemsLength={publishers?.length}
              onSelectAll={handleSelectAll}
            />
          }
        >
          <TableBody>
            {publishers?.map((publisher) => (
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
  );
};
