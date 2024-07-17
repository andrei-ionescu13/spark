import { useState } from "react";
import type { FC, SyntheticEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
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
import { dehydrate, HydrationBoundary, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { ParsedUrlQuery } from "querystring";
import { FeaturesHeader } from "./features-header";
import { FeaturesTable } from "./features-table";
import { Feature } from "@/types/feature";
import { appFetch } from "@/utils/app-fetch";


interface GetFeatureData {
  features: Feature[];
  count: number;
}

const searchFeature =
  (query: ParsedUrlQuery, config: Record<string, any> = {}) =>
    () =>
      appFetch<GetFeatureData>({
        url: "/features/search",
        query,
        withAuth: true,
        ...config,
      });

export default async function Features({ searchParams }) {
  const queryClient = new QueryClient();
  const query: any = {};

  for (const [key, value] of Object.entries(searchParams)) {
    query[key] = value;
  }

  await queryClient.prefetchQuery({
    queryKey: ["features", query],
    queryFn: searchFeature(query)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Head>
        <title>Article features</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <FeaturesHeader />
          <FeaturesTable />
        </Container>
      </Box>
    </HydrationBoundary>
  );
};

