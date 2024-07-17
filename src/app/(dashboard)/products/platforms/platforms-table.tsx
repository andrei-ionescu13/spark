"use client"

import { useDeletePlatforms } from '@/api/platforms';
import { AlertDialog } from '@/components/alert-dialog';
import { DataTable } from '@/components/data-table';
import { HeadCell, DataTableHead } from '@/components/data-table-head';
import { PlatformsTableRow } from '@/components/products/platforms/platforms-table-row';
import { SearchInput } from '@/components/search-input';
import { useDialog } from '@/hooks/useDialog';
import { useSearch } from '@/hooks/useSearch';
import { Card, Box, Button, TableBody } from '@mui/material';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useState, type FC } from 'react'
import { useSearchPlatformsQuery } from '../api-calls-hooks';

interface PlatformsTableProps {
}

const headCells: HeadCell[] = [
  {
    id: "name",
    label: "Name",
  },
];

export const PlatformsTable: FC<PlatformsTableProps> = (props) => {
  const queryClient = useQueryClient();
  const [keyword, handleKeywordChange, handleSearch] =
    useSearch();
  const [selected, setSelected] = useState<string[]>([]);
  const { error, data } = useSearchPlatformsQuery();
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();

  const deletePlatforms = useDeletePlatforms(() =>
    queryClient.invalidateQueries({ queryKey: ["platforms"] })
  );

  if (!data) return null;

  const { platforms, count } = data;

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
        <DataTable count={count}>
          <DataTableHead
            headCells={headCells}
            selectedLength={selected.length}
            itemsLength={platforms.length}
            onSelectAll={handleSelectAll}
          />
          <TableBody>
            {platforms.map((platform) => (
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
