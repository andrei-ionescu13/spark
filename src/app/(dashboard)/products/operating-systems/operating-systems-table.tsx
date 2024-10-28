'use client';

import { useDeleteOperatingSystems } from '@/api/operating-systems';
import { AlertDialog } from '@/components/alert-dialog';
import { DataTable } from '@/components/data-table';
import { DataTableHead, HeadCell } from '@/components/data-table-head';
import { SearchInput } from '@/components/search-input';
import { useSearch } from '@/hooks/useSearch';
import { OperatingSystem } from '@/types/operating-sistem';
import { Box, Button, Card, TableBody } from '@mui/material';
import { useState, type FC } from 'react';
import { OperatingSystemsTableRow } from './operating-systems-table-row';

interface OperatingSystemsTableProps {
  operatingSystems: OperatingSystem[];
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
  {
    id: 'slug',
    label: 'Slug',
  },
];

export const OperatingSystemsTable: FC<OperatingSystemsTableProps> = (
  props
) => {
  const { operatingSystems, count, isError, isLoading, refetch } = props;
  const [selected, setSelected] = useState<string[]>([]);
  const [keyword, handleKeywordChange, handleSearch] = useSearch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const deleteCategories = useDeleteOperatingSystems(refetch);

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
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              sm: `${!!selected.length ? 'auto' : ''} 1fr`,
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
              itemsLength={operatingSystems?.length}
              onSelectAll={handleSelectAll}
            />
          }
        >
          <TableBody>
            {operatingSystems?.map((operatingSystem) => (
              <OperatingSystemsTableRow
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
  );
};
