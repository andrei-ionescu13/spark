import { useState } from "react";
import type { FC, SyntheticEvent, ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  Button,
} from "@mui/material";
import { dehydrate, HydrationBoundary, QueryClient, useQuery } from "@tanstack/react-query";
import { useDeleteArticles } from "@/api/articles";
import { AlertDialog } from "@/components/alert-dialog";
import { ArticleTableRow } from "@/components/articles/list/article-table-row";
import { DataTable } from "@/components/data-table";
import { HeadCell, DataTableHead } from "@/components/data-table-head";
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/search-input";
import { useQueryValue } from "@/hooks/useQueryValue";
import { useSearch } from "@/hooks/useSearch";
import { Article } from "@/types/articles";
import { appFetch } from "@/utils/app-fetch";
import { ParsedUrlQuery } from "querystring";
import { Plus as PlusIcon } from "@/icons/plus";
import { DataCardTabs } from "./data-card-tabs";

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


export default async function Articles({ searchParams }: { searchParams: Record<string, string> }) {
  const queryClient = new QueryClient()
  const query: any = {};
  for (const [key, value] of Object.entries(searchParams)) {
    query[key] = value;
  }

  await queryClient.prefetchQuery({
    queryKey: ["articles", query],
    queryFn: getArticles(query)
  });


  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
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
          <DataCardTabs />
        </Container>
      </Box>
    </HydrationBoundary>
  );
};

