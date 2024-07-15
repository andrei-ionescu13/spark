"use client";
import { useDeleteCategories } from '@/api/article-categories';
import { AlertDialog } from '@/components/alert-dialog';
import { CategoryTableRow } from '@/components/articles/categories/category-table-row';
import { DataTable } from '@/components/data-table';
import { DataTableHead, HeadCell } from '@/components/data-table-head';
import { SearchInput } from '@/components/search-input';
import { useDialog } from '@/hooks/useDialog';
import { useSearch } from '@/hooks/useSearch';
import { ArticleCategory } from '@/types/article-category';
import { appFetch } from '@/utils/app-fetch';
import { Card, Box, Button, TableBody } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { ParsedUrlQuery } from 'querystring';
import { useState, type FC } from 'react'

interface CategoriesTableProps {
}


interface GetCategoriesData {
  categories: ArticleCategory[];
  count: number;
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


const searchCategories =
  (query: ParsedUrlQuery, config: Record<string, any> = {}) =>
    () =>
      appFetch<GetCategoriesData>({
        url: "/article-categories/search",
        query,
        withAuth: true,
        ...config,
      });

export const CategoriesTable: FC<CategoriesTableProps> = (props) => {
  const query: any = {};
  const searchParams = useSearchParams();
  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }
  const [selected, setSelected] = useState<string[]>([]);
  const [keyword, keywordParam, handleKeywordChange, handleSearch] =
    useSearch();
  const { data, refetch } = useQuery({
    queryKey: ["article-categories", query],
    queryFn: searchCategories(query)
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const deleteCategories = useDeleteCategories(refetch);
  const [createDialogOpen, handleOpenCreateDialog, handleCloseCreateDialog] =
    useDialog();

  if (!data) return null;

  const { categories, count } = data;

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
              placeholder="Search categories..."
              value={keyword}
            />
          </form>
        </Box>
        <DataTable count={count}>
          <DataTableHead
            headCells={headCells}
            selectedLength={selected.length}
            itemsLength={categories.length}
            onSelectAll={handleSelectAll}
          />
          <TableBody>
            {categories.map((article) => (
              <CategoryTableRow
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
  )
};
