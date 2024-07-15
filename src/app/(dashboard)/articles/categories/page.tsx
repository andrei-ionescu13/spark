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
import { AlertDialog } from "@/components/alert-dialog";
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/search-input";
import { Plus as PlusIcon } from "@/icons/plus";
import { useSearch } from "@/hooks/useSearch";
import { useQueryValue } from "@/hooks/useQueryValue";
import { appFetch } from "@/utils/app-fetch";
import { DataTable } from "@/components/data-table";
import { ParsedUrlQuery } from "querystring";
import { DataTableHead } from "@/components/data-table-head";
import type { HeadCell } from "@/components/data-table-head";
import { Button } from "@/components/button";
import { ArticleCategory } from "@/types/article-category";
import { useDeleteCategories } from "@/api/article-categories";
import { CategoryTableRow } from "@/components/articles/categories/category-table-row";
import { useDialog } from "@/hooks/useDialog";
import { ArticleCategoryCreateDialog } from "@/components/articles/categories/category-create-dialog";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { CategoriesTable } from "./categories-table";

interface GetCategoriesData {
  categories: ArticleCategory[];
  count: number;
}

const searchCategories =
  (query: ParsedUrlQuery, config: Record<string, any> = {}) =>
    () =>
      appFetch<GetCategoriesData>({
        url: "/article-categories/search",
        query,
        withAuth: true,
        ...config,
      });

export default async function ArticleCategories({ searchParams }: { searchParams: Record<string, string> }) {
  const queryClient = new QueryClient()
  const query: any = {};
  for (const [key, value] of Object.entries(searchParams)) {
    query[key] = value;
  }

  await queryClient.prefetchQuery({
    queryKey: ["article-categories", query],
    queryFn: searchCategories(query)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* {createDialogOpen && (
        <ArticleCategoryCreateDialog open onClose={handleCloseCreateDialog} />
      )} */}
      <Head>
        <title>Article categories</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title="Categories"
          // action={{
          //   onClick: handleOpenCreateDialog,
          //   label: "Add",
          //   icon: PlusIcon,
          // }}
          />
          <CategoriesTable />
        </Container>
      </Box>
    </HydrationBoundary>
  );
};
