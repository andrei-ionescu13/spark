import { AlertDialog } from '@/components/alert-dialog';
import { Button } from '@/components/button';
import { DataTable } from '@/components/data-table';
import { DataTableHead, HeadCell } from '@/components/data-table-head';
import { SearchInput } from '@/components/search-input';
import { useSearch } from '@/hooks/useSearch';
import { ArticleTag } from '@/types/article-tag';
import { Box, Card, TableBody } from '@mui/material';
import { useState, type FC } from 'react';
import { useDeleteArticleTags } from './api';
import { TagsTableRow } from './tags-table-row';

interface TagsTableProps {
  tags?: ArticleTag[];
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

export const TagsTable: FC<TagsTableProps> = (props) => {
  const { tags, count, isError, isLoading, refetch } = props;
  const [selected, setSelected] = useState<string[]>([]);
  const [keyword, handleKeywordChange, handleSearch] = useSearch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const deleteCategories = useDeleteArticleTags(refetch);

  const handleOpenDialog = (): void => {
    setDialogOpen(true);
  };

  const handleCloseDialog = (): void => {
    setDialogOpen(false);
  };

  const handleDeleteTags = (): void => {
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
    if (!tags) return;

    setSelected((prevSelected) => {
      if (prevSelected.length === tags.length) {
        return [];
      }

      return tags.map((article) => article._id);
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
              placeholder="Search tags..."
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
              itemsLength={tags?.length}
              onSelectAll={handleSelectAll}
            />
          }
        >
          <TableBody>
            {tags?.map((tag) => (
              <TagsTableRow
                articleTag={tag}
                key={tag._id}
                onSelect={() => {
                  handleSelect(tag._id);
                }}
                selected={selected.includes(tag._id)}
              />
            ))}
          </TableBody>
        </DataTable>
      </Card>
      <AlertDialog
        content="Are you sure you want to permanently delete these categories"
        isLoading={deleteCategories.isPending}
        onClose={handleCloseDialog}
        onSubmit={handleDeleteTags}
        open={dialogOpen}
        title={`Delete ${selected.length} categories`}
      />
    </>
  );
};
