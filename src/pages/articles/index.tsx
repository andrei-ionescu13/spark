import { useState } from "react";
import type { FC, SyntheticEvent, ChangeEvent } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import {
  Box,
  Card,
  Checkbox,
  Container,
  Divider,
  Tab,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  MenuItem,
  TableSortLabel,
  TextField,
} from "@mui/material";
import { dehydrate, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArticleTableRow } from "@/components/articles/list/article-table-row";
import { AlertDialog } from "@/components/alert-dialog";
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/search-input";
import { Plus as PlusIcon } from "@/icons/plus";
import { useDeleteArticles } from "@/api/articles";
import { useSearch } from "@/hooks/useSearch";
import { useSort } from "@/hooks/useSort";
import { useQueryValue } from "@/hooks/useQueryValue";
import { appFetch } from "@/utils/app-fetch";
import { DataTable } from "@/components/data-table";
import { Article } from "@/types/articles";
import { ParsedUrlQuery } from "querystring";
import { DataTableHead } from "@/components/data-table-head";
import type { HeadCell } from "@/components/data-table-head";
import { Button } from "@/components/button";
import { TableNoData } from "@/components/table-no-data";
import { TableDataError } from "@/components/table-data-error";

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

const Articles: FC = () => {
  const { query } = useRouter();
  const [status, setStatus] = useQueryValue("status", "all", "all");
  const [tab, setTab] = useQueryValue("category", "all", "all");
  const [selected, setSelected] = useState<string[]>([]);
  const [keyword, keywordParam, handleKeywordChange, handleSearch] =
    useSearch();
  const { data, isError, refetch } = useQuery({
    queryKey: ["articles", query],
    queryFn: getArticles(query)
  });
  console.log(["articles", query], 333)
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
      <Head>
        <title>Articles</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title="Articles"
            action={{
              href: "/articles/create",
              isLink: true,
              label: "Add",
              icon: PlusIcon,
            }}
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
        </Container>
      </Box>
      <AlertDialog
        content="Are you sure you want to permanently delete these articles"
        isLoading={deleteArticles.isPending}
        onClose={handleCloseDialog}
        onSubmit={handleDeleteArticles}
        open={dialogOpen}
        title={`Delete ${selected.length} articles`}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
  req,
  res,
}) => {
  const queryClient = new QueryClient();
  console.log(["articles", query], 222)
  try {
    await queryClient.fetchQuery({
      queryKey: ["articles", query],
      queryFn: getArticles(query, { req, res })
    }
    );
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Articles;
