'use client';

import { AlertDialog } from '@/components/alert-dialog';
import { Button } from '@/components/button';
import { DataTable } from '@/components/data-table';
import { DataTableHead, HeadCell } from '@/components/data-table-head';
import { SearchInput } from '@/components/search-input';
import { useSearch } from '@/hooks/useSearch';
import { Feature } from '@/types/feature';
import { Box, Card, TableBody } from '@mui/material';
import { FeaturesTableRow } from 'app/(dashboard)/products/features/feature-table-row';
import { useState, type FC } from 'react';
import { useDeleteFeatures } from './api';

interface FeaturesTableProps {
  features?: Feature[];
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

export const FeaturesTable: FC<FeaturesTableProps> = (props) => {
  const { features, count, isError, isLoading, refetch } = props;
  const [selected, setSelected] = useState<string[]>([]);
  const [keyword, handleKeywordChange, handleSearch] = useSearch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const deleteCategories = useDeleteFeatures(refetch);
  const handleOpenDialog = (): void => {
    setDialogOpen(true);
  };

  const handleCloseDialog = (): void => {
    setDialogOpen(false);
  };

  const handleDeleteFeature = (): void => {
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
      if (prevSelected.length === features.length) {
        return [];
      }

      return features.map((article) => article._id);
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
              placeholder="Search features..."
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
              itemsLength={features?.length}
              onSelectAll={handleSelectAll}
            />
          }
        >
          <TableBody>
            {features?.map((feature) => (
              <FeaturesTableRow
                feature={feature}
                key={feature._id}
                onSelect={() => {
                  handleSelect(feature._id);
                }}
                selected={selected.includes(feature._id)}
              />
            ))}
          </TableBody>
        </DataTable>
      </Card>
      <AlertDialog
        content="Are you sure you want to permanently delete these features"
        isLoading={deleteCategories.isPending}
        onClose={handleCloseDialog}
        onSubmit={handleDeleteFeature}
        open={dialogOpen}
        title={`Delete ${selected.length} features`}
      />
    </>
  );
};
