import { useEffect, useRef, useState } from "react";
import type { FC, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import {
  Box,
  Button,
  Card,
  Container,
  FormControl,
  FormControlLabel,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { TranslationsHeader } from "./translations-header";
import { TranslationsTable } from "./translations-table";
import { listLanguages, searchNamespaces } from "./api-calls";
import { Namespace } from "@/types/translations";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";



interface GetNamespacesData {
  namespaces: Namespace[];
  count: number;
}


export default async function Translations({ searchParams }: { searchParams: Record<string, string> }) {
  const queryClient = new QueryClient()
  const query: any = {};
  for (const [key, value] of Object.entries(searchParams)) {
    query[key] = value;
  }

  await queryClient.prefetchQuery({
    queryKey: ["namespace-languages"],
    queryFn: listLanguages()
  });
  await queryClient.prefetchQuery({
    queryKey: ["namespaces"],
    queryFn: searchNamespaces(query)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Head>
        <title>Translations</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <TranslationsHeader />
          <TranslationsTable />
        </Container>
      </Box>
    </HydrationBoundary>
  );
};
