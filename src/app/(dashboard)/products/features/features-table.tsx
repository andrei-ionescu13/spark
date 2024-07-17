"use client"

import { useState, type FC } from 'react'
import { useSearchFeaturesQuery } from '../api-calls-hooks';
import { useDeleteFeatures } from '@/api/features';
import { AlertDialog } from '@/components/alert-dialog';
import { DataTable } from '@/components/data-table';
import { HeadCell, DataTableHead } from '@/components/data-table-head';
import { FeatureTableRow } from '@/components/products/features/feature-table-row';
import { SearchInput } from '@/components/search-input';
import { useSearch } from '@/hooks/useSearch';
import { Card, Box, TableBody } from '@mui/material';
import { Button } from '@/components/button';

interface FeaturesTableProps {

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

export const FeaturesTable: FC<FeaturesTableProps> = (props) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [keyword, handleKeywordChange, handleSearch] =
    useSearch();
  const { data, refetch } = useSearchFeaturesQuery();
  const [dialogOpen, setDialogOpen] = useState(false);
  const deleteCategories = useDeleteFeatures(refetch);


  if (!data) return null;

  const { features, count } = data;

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
              placeholder="Search features..."
              value={keyword}
            />
          </form>
        </Box>
        <DataTable count={count}>
          <DataTableHead
            headCells={headCells}
            selectedLength={selected.length}
            itemsLength={features.length}
            onSelectAll={handleSelectAll}
          />
          <TableBody>
            {features.map((feature) => (
              <FeatureTableRow
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
  )
};
