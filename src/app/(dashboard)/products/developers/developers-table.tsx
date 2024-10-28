"use client"

import { useState, type FC } from 'react'
import { useSearchDevelopersQuery } from '../api-calls-hooks';
import { useDeleteDevelopers } from '@/api/developers';
import { AlertDialog } from '@/components/alert-dialog';
import { DataTable } from '@/components/data-table';
import { DataTableHead, HeadCell } from '@/components/data-table-head';
import { DevelopersTableRow } from 'app/(dashboard)/products/developers/developer-table-row';
import { SearchInput } from '@/components/search-input';
import { useSearch } from '@/hooks/useSearch';
import { Card, Box, Button, TableBody } from '@mui/material';
import { Developer } from '@/types/developer';

interface DevelopersTableProps {
  developers?: Developer[];
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
  {
    id: "slug",
    label: "Slug",
  },
];

export const DevelopersTable: FC<DevelopersTableProps> = (props) => {
  const {
    developers,
    count,
    isError,
    isLoading,
    refetch,
  } = props;
  const [selected, setSelected] = useState<string[]>([]);
  const [keyword, handleKeywordChange, handleSearch] =
    useSearch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const deleteCategories = useDeleteDevelopers(refetch);

  const handleOpenDialog = (): void => {
    setDialogOpen(true);
  };

  const handleCloseDialog = (): void => {
    setDialogOpen(false);
  };

  const handleDeleteDeveloper = (): void => {
    deleteCategories.mutate(selected, {
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
    if (!developers) return;

    setSelected((prevSelected) => {
      if (prevSelected.length === developers.length) {
        return [];
      }

      return developers.map((article) => article._id);
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
            //@ts-ignore
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
              placeholder="Search developers..."
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
              itemsLength={developers?.length}
              onSelectAll={handleSelectAll}
            />
          }
        >
          <TableBody>
            {developers?.map((developer) => (
              <DevelopersTableRow
                developer={developer}
                key={developer._id}
                onSelect={() => {
                  handleSelect(developer._id);
                }}
                selected={selected.includes(developer._id)}
              />
            ))}
          </TableBody>
        </DataTable>
      </Card>
      <AlertDialog
        content="Are you sure you want to permanently delete these developers"
        isLoading={deleteCategories.isPending}
        onClose={handleCloseDialog}
        onSubmit={handleDeleteDeveloper}
        open={dialogOpen}
        title={`Delete ${selected.length} developers`}
      />
    </>
  )
};
