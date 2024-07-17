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
import { ArticlesTable } from "./articles-table";
import { searchArticles } from "./api-calls";

export default async function Articles({ searchParams }: { searchParams: Record<string, string> }) {
  const queryClient = new QueryClient()
  const query: any = {};
  for (const [key, value] of Object.entries(searchParams)) {
    query[key] = value;
  }

  await queryClient.prefetchQuery({
    queryKey: ["articles", query],
    queryFn: searchArticles(query)
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
          <ArticlesTable />
        </Container>
      </Box>
    </HydrationBoundary>
  );
};

