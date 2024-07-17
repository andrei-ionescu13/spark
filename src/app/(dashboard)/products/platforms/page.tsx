import { useState } from "react";
import type { FC, ChangeEvent } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import type { GetServerSideProps } from "next";
import {
  Box,
  Card,
  Checkbox,
  Container,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { dehydrate, HydrationBoundary, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { searchPlatforms } from "../api-calls";
import { PlatformsHeader } from "./platforms-header";
import { PlatformsTable } from "./platforms-table";

export default async function Platforms({ searchParams }) {
  const queryClient = new QueryClient();
  const query: any = {};

  for (const [key, value] of Object.entries(searchParams)) {
    query[key] = value;
  }

  await queryClient.prefetchQuery({
    queryKey: ["platforms", query],
    queryFn: searchPlatforms(query)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Head>
        <title>Platforms</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PlatformsHeader />
          <PlatformsTable />
        </Container>
      </Box>
    </HydrationBoundary>
  );
};