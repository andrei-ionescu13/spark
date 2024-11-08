'use client';
import { AlertDialog } from '@/components/alert-dialog';
import { DataTable } from '@/components/data-table';
import { DataTableHead, HeadCell } from '@/components/data-table-head';
import { SearchInput } from '@/components/search-input';
import { useSearch } from '@/hooks/useSearch';
import { ArticleCategory } from '@/types/article-category';
import { Box, Button, Card, TableBody } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useState, type FC } from 'react';
import { useDeleteCategories } from './api';
import { CategoriesTableRow } from './categories-table-row';

interface CategoriesTableProps {
  categories?: ArticleCategory[];
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

export const CategoriesTable: FC<CategoriesTableProps> = (props) => {
  const { categories, count, isError, isLoading, refetch } = props;
  const query: any = {};
  const searchParams = useSearchParams();
  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }
  const [selected, setSelected] = useState<string[]>([]);
  const [keyword, handleKeywordChange, handleSearch] = useSearch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const deleteCategories = useDeleteCategories(refetch);

  const handleOpenDialog = (): void => {
    setDialogOpen(true);
  };

  const handleCloseDialog = (): void => {
    setDialogOpen(false);
  };

  const handleDeleteCategories = (): void => {
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
    if (!categories) return;

    setSelected((prevSelected) => {
      if (prevSelected.length === categories.length) {
        return [];
      }

      return categories.map((article) => article._id);
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
              placeholder="Search categories..."
              value={keyword}
            />
          </form>
        </Box>
        <DataTable
          count={count}
          hasError={isError}
          hasNoData={count === 0}
          headCellsCount={headCells.length}
          onRefetchData={refetch}
          isLoading={isLoading}
          headSlot={
            <DataTableHead
              isLoading={isLoading}
              headCells={headCells}
              selectedLength={selected.length}
              itemsLength={categories?.length}
              onSelectAll={handleSelectAll}
            />
          }
        >
          <TableBody>
            {categories?.map((article) => (
              <CategoriesTableRow
                articleCategory={article}
                key={article._id}
                onSelect={() => {
                  handleSelect(article._id);
                }}
                selected={selected.includes(article._id)}
              />
            ))}
          </TableBody>
        </DataTable>
      </Card>
      <AlertDialog
        content="Are you sure you want to permanently delete these categories"
        isLoading={deleteCategories.isPending}
        onClose={handleCloseDialog}
        onSubmit={handleDeleteCategories}
        open={dialogOpen}
        title={`Delete ${selected.length} categories`}
      />
    </>
  );
};
