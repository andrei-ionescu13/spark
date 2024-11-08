'use client';

import { AlertDialog } from '@/components/alert-dialog';
import { DataTable } from '@/components/data-table';
import { DataTableHead, HeadCell } from '@/components/data-table-head';
import { SearchInput } from '@/components/search-input';
import { useQueryValue } from '@/hooks/useQueryValue';
import { useSearch } from '@/hooks/useSearch';
import { ArticleCategory } from '@/types/article-category';
import { Article } from '@/types/articles';
import {
  Box,
  Button,
  Card,
  Divider,
  MenuItem,
  Tab,
  TableBody,
  Tabs,
  TextField,
} from '@mui/material';
import { ChangeEvent, FC, SyntheticEvent, useState } from 'react';
import { useDeleteArticles } from './api';
import { ArticlesTableRow } from './articles-table-row';

interface Tab {
  label: string;
  value: string;
}

const statusOptions = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Published',
    value: 'published',
  },
  {
    label: 'Draft',
    value: 'draft',
  },
  {
    label: 'Archived',
    value: 'archived',
  },
];

const headCells: HeadCell[] = [
  {
    id: 'title',
    label: 'Title',
    width: '22%',
  },
  {
    id: 'slug',
    label: 'Slug',
    width: '20%',
  },
  {
    id: 'category',
    label: 'Category',
    width: '20%',
  },
  {
    id: 'createdAt',
    label: 'Created At',
    width: '15%',
  },
  {
    id: 'status',
    label: 'Status',
    width: '15%',
  },
];

interface ArticlesTableProps {
  articles?: Article[];
  count?: number;
  isError: boolean;
  refetch: any;
  isLoading: boolean;
  categories: ArticleCategory[];
}

export const ArticlesTable: FC<ArticlesTableProps> = (props) => {
  const { articles, count, isError, isLoading, refetch, categories } = props;
  const [status, setStatus] = useQueryValue('status', 'all', 'all');
  const [tab, setTab] = useQueryValue('category', '', '');
  const [selected, setSelected] = useState<string[]>([]);
  const [keyword, handleKeywordChange, handleSearch] = useSearch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const deleteArticles = useDeleteArticles(refetch);

  const tabs: Tab[] = [
    {
      value: '',
      label: 'All',
    },
    ...(categories || []).map((category) => ({
      value: category.name,
      label: category.name,
    })),
  ];

  const handleOpenDialog = (): void => {
    setDialogOpen(true);
  };

  const handleCloseDialog = (): void => {
    setDialogOpen(false);
  };

  const handleDeleteArticles = (): void => {
    deleteArticles.mutate(selected, {
      onSuccess: () => {
        setSelected([]);
        handleCloseDialog();
      },
    });
  };

  const handleTabChange = (event: SyntheticEvent, newTab: string): void => {
    setTab(newTab);
  };

  const handleStatusChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setStatus(event.target.value);
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
    if (!articles) return;

    setSelected((prevSelected) => {
      if (prevSelected.length === articles.length) {
        return [];
      }

      return articles.map((article) => article._id);
    });
  };

  return (
    <>
      <AlertDialog
        content="Are you sure you want to permanently delete these articles"
        isLoading={deleteArticles.isPending}
        onClose={handleCloseDialog}
        onSubmit={handleDeleteArticles}
        open={dialogOpen}
        title={`Delete ${selected.length} articles`}
      />
      <Card>
        <Tabs
          onChange={handleTabChange}
          sx={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
          value={tab}
        >
          {tabs?.map((tab) => (
            <Tab
              color="primary"
              key={tab.value}
              label={tab.label}
              value={tab.value}
            />
          ))}
        </Tabs>
        <Divider />
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              sm: `${!!selected.length ? 'auto' : ''} 1fr 240px`,
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
              placeholder="Search article..."
              value={keyword}
            />
          </form>
          <TextField
            select
            id="status"
            label="Status"
            onChange={handleStatusChange}
            value={status}
          >
            {statusOptions.map((status) => (
              <MenuItem
                key={status.value}
                value={status.value}
              >
                {status.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <DataTable
          isLoading={isLoading}
          count={count}
          hasError={isError}
          hasNoData={count === 0}
          onRefetchData={refetch}
          headCellsCount={headCells.length}
          headSlot={
            <DataTableHead
              isLoading={isLoading}
              headCells={headCells}
              selectedLength={selected.length}
              itemsLength={articles?.length}
              onSelectAll={handleSelectAll}
            />
          }
        >
          <TableBody>
            {articles &&
              articles.map((article) => (
                <ArticlesTableRow
                  article={article}
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
    </>
  );
};
