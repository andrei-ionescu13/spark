"use client"

import { useState, type FC } from 'react'
import { useSearchOperatingSystemsQuery } from '../api-calls-hooks';
import { useDeleteOperatingSystems } from '@/api/operating-systems';
import { AlertDialog } from '@/components/alert-dialog';
import { DataTable } from '@/components/data-table';
import { HeadCell, DataTableHead } from '@/components/data-table-head';
import { OperatingSystemTableRow } from '@/components/products/operating-systems/operating-system-table-row';
import { SearchInput } from '@/components/search-input';
import { useSearch } from '@/hooks/useSearch';
import { Card, Box, Button, TableBody } from '@mui/material';

interface OperatingSystemsTableProps {

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


export const OperatingSystemsTable: FC<OperatingSystemsTableProps> = (props) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [keyword, handleKeywordChange, handleSearch] =
    useSearch();
  const { data, refetch } = useSearchOperatingSystemsQuery();
  const [dialogOpen, setDialogOpen] = useState(false);
  const deleteCategories = useDeleteOperatingSystems(refetch);


  if (!data) return null;

  const { operatingSystems, count } = data;

  const handleOpenDialog = (): void => {
    setDialogOpen(true);
  };

  const handleCloseDialog = (): void => {
    setDialogOpen(false);
  };

  const handleDeleteOperatingSystem = (): void => {
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
    setSelected((prevSelected) => {
      if (prevSelected.length === operatingSystems.length) {
        return [];
      }

      return operatingSystems.map((article) => article._id);
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
              placeholder="Search Operating Systems..."
              value={keyword}
            />
          </form>
        </Box>
        <DataTable count={count}>
          <DataTableHead
            headCells={headCells}
            selectedLength={selected.length}
            itemsLength={operatingSystems.length}
            onSelectAll={handleSelectAll}
          />
          <TableBody>
            {operatingSystems.map((operatingSystem) => (
              <OperatingSystemTableRow
                operatingSystem={operatingSystem}
                key={operatingSystem._id}
                onSelect={() => {
                  handleSelect(operatingSystem._id);
                }}
                selected={selected.includes(operatingSystem._id)}
              />
            ))}
          </TableBody>
        </DataTable>
      </Card>
      <AlertDialog
        content="Are you sure you want to permanently delete these operating systems"
        isLoading={deleteCategories.isPending}
        onClose={handleCloseDialog}
        onSubmit={handleDeleteOperatingSystem}
        open={dialogOpen}
        title={`Delete ${selected.length} operating systems`}
      />
    </>
  )
};
