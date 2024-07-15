"use client";

import { useDeleteArticles } from '@/api/articles';
import { ArticleTableRow } from '@/components/articles/list/article-table-row';
import { DataTable } from '@/components/data-table';
import { DataTableHead, HeadCell } from '@/components/data-table-head';
import { SearchInput } from '@/components/search-input';
import { useQueryValue } from '@/hooks/useQueryValue';
import { useSearch } from '@/hooks/useSearch';
import { Box, Button, Card, Divider, MenuItem, Tab, TableBody, Tabs, TextField } from '@mui/material'
import { QueryClient, useQuery } from '@tanstack/react-query';
import React, { ChangeEvent, SyntheticEvent, useState } from 'react';
import { useSearchParams } from 'next/navigation'
import { ParsedUrlQuery } from 'querystring';
import { Article } from '@/types/articles';
import { AlertDialog } from '@/components/alert-dialog';
import { appFetch } from '@/utils/app-fetch';

interface Tab {
  label: string;
  value: string;
}

const tabs: Tab[] = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "News",
    value: "news",
  },
  {
    label: "Games",
    value: "games",
  },
  {
    label: "Reviews",
    value: "reviews",
  },
];

const statusOptions = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Published",
    value: "published",
  },
  {
    label: "Draft",
    value: "draft",
  },
  {
    label: "Archived",
    value: "archived",
  },
];

const headCells: HeadCell[] = [
  {
    id: "title",
    label: "Title",
  },
  {
    id: "slug",
    label: "Slug",
  },
  {
    id: "category",
    label: "Category",
  },
  {
    id: "createdAt",
    label: "Created At",
  },
  {
    id: "status",
    label: "Status",
  },
];


interface GetArticlesData {
  articles: Article[];
  count: number;
}

const getArticles =
  (query: ParsedUrlQuery, config: Record<string, any> = {}) =>
    () =>
      appFetch<GetArticlesData>({
        url: "/articles",
        query,
        withAuth: true,
        ...config,
      });


export const DataCardTabs = () => {
  const query: any = {};
  const searchParams = useSearchParams();
  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }
  const [status, setStatus] = useQueryValue("status", "all", "all");
  const [tab, setTab] = useQueryValue("category", "all", "all");
  const [selected, setSelected] = useState<string[]>([]);
  const [keyword, keywordParam, handleKeywordChange, handleSearch] =
    useSearch();
  const { data, refetch } = useQuery({
    queryKey: ["articles", query],
    queryFn: getArticles(query)
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const deleteArticles = useDeleteArticles(refetch);

  if (!data) return null;

  const { articles, count } = data;

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
      onError: (error) => { },
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
    setSelected((prevSelected) => {
      if (prevSelected.length === data?.articles.length) {
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
          sx={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
          value={tab}
        >
          {tabs.map((tab) => (
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
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              sm: `${!!selected.length ? "auto" : ""} 1fr 240px`,
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
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <DataTable count={count}>
          <DataTableHead
            headCells={headCells}
            selectedLength={selected.length}
            itemsLength={articles.length}
            onSelectAll={handleSelectAll}
          />
          <TableBody>
            {/* <TableDataError
          colSpan={headCells.length + 2}
          onReload={refetch}
        /> */}
            {articles.map((article) => (
              <ArticleTableRow
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
  )
}
