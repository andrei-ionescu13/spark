'use client';

import { useDeleteGenres } from '@/api/genres';
import { AlertDialog } from '@/components/alert-dialog';
import { DataTable } from '@/components/data-table';
import { DataTableHead, HeadCell } from '@/components/data-table-head';
import { SearchInput } from '@/components/search-input';
import { useDialog } from '@/hooks/useDialog';
import { useSearch } from '@/hooks/useSearch';
import { Genre } from '@/types/genres';
import { Box, Button, Card, TableBody } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useState, type FC } from 'react';
import { useSearchGenresQuery } from '../api-calls-hooks';
import { GenresTableRow } from './genres-table-row';

interface GenresTableProps {
  genres?: Genre[];
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

export const GenresTable: FC<GenresTableProps> = (props) => {
  const { genres, count, isError, isLoading, refetch } = props;
  const queryClient = useQueryClient();
  const [keyword, handleKeywordChange, handleSearch] = useSearch();
  const [selected, setSelected] = useState<string[]>([]);
  const { error, data: genresData } = useSearchGenresQuery();
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();
  useDialog();
  const deleteGenres = useDeleteGenres(() =>
    queryClient.invalidateQueries({ queryKey: ['genres'] })
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
    if (!genres) return;

    setSelected((prevSelected) => {
      if (prevSelected.length === genres?.length) {
        return [];
      }

      return genres?.map((genre) => genre._id);
    });
  };

  const handleDeleteGenres = () => {
    deleteGenres.mutate(selected, {
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
              placeholder="Search genres..."
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
              itemsLength={genres?.length}
              onSelectAll={handleSelectAll}
            />
          }
        >
          <TableBody>
            {genres?.map((genre) => (
              <GenresTableRow
                genre={genre}
                key={genre._id}
                onSelect={() => {
                  handleSelect(genre._id);
                }}
                selected={selected.includes(genre._id)}
              />
            ))}
          </TableBody>
        </DataTable>
      </Card>
      <AlertDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        title={`Delete multiple genres`}
        content="Are you sure you want to permanently delete these genre?"
        onSubmit={handleDeleteGenres}
        isLoading={deleteGenres.isPending}
      />
    </>
  );
};
