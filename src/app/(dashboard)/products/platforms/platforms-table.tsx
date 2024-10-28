"use client"

import { useDeletePlatforms } from '@/api/platforms';
import { AlertDialog } from '@/components/alert-dialog';
import { DataTable } from '@/components/data-table';
import { HeadCell, DataTableHead } from '@/components/data-table-head';
import { SearchInput } from '@/components/search-input';
import { useDialog } from '@/hooks/useDialog';
import { useSearch } from '@/hooks/useSearch';
import { Card, Box, Button, TableBody } from '@mui/material';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useState, type FC } from 'react'
import { useSearchPlatformsQuery } from '../api-calls-hooks';
import { Platform } from '@/types/platforms';
import { PlatformsTableRow } from './platforms-table-row';

interface PlatformsTableProps {
  platforms?: Platform[];
  count?: number;
  isError: boolean;
  isLoading: boolean;
  refetch: any;
}

const headCells: HeadCell[] = [
  {
    id: "name",
    label: "Name",
  },
];

export const PlatformsTable: FC<PlatformsTableProps> = (props) => {
  const {
    platforms,
    count,
    isError,
    isLoading,
    refetch,
  } = props;
  const queryClient = useQueryClient();
  const [keyword, handleKeywordChange, handleSearch] =
    useSearch();
  const [selected, setSelected] = useState<string[]>([]);
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();

  const deletePlatforms = useDeletePlatforms(() =>
    queryClient.invalidateQueries({ queryKey: ["platforms"] })
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
    if (!platforms) return;

    setSelected((prevSelected) => {
      if (prevSelected.length === platforms?.length) {
        return [];
      }

      return platforms?.map((platform) => platform._id);
    });
  };

  const handleDeleteArticles = (): void => {
    deletePlatforms.mutate(selected, {
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
              placeholder="Search platforms..."
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
              itemsLength={platforms?.length}
              onSelectAll={handleSelectAll}
            />
          }
        >
          <TableBody>
            {platforms?.map((platform) => (
              <PlatformsTableRow
                platform={platform}
                key={platform._id}
                onSelect={() => {
                  handleSelect(platform._id);
                }}
                selected={selected.includes(platform._id)}
              />
            ))}
          </TableBody>
        </DataTable>
      </Card>
      <AlertDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        title={`Delete multiple platforms`}
        content="Are you sure you want to permanently delete these platform?"
        onSubmit={handleDeleteArticles}
        isLoading={deletePlatforms.isPending}
      />
    </>
  )
};
