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
import { OperatingSystemsTable } from "./operating-systems-table";
import { searchOperatingSystems } from "../api-calls";
import { OperatingSystemsHeader } from "./operating-systems-header";

export default async function OperatingSystems({ searchParams }) {
  const queryClient = new QueryClient();
  const query: any = {};

  for (const [key, value] of Object.entries(searchParams)) {
    query[key] = value;
  }

  await queryClient.prefetchQuery({
    queryKey: ["operatingSystems", query],
    queryFn: searchOperatingSystems(query)
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Head>
        <title>Operating Systems</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <OperatingSystemsHeader />
          <OperatingSystemsTable />
        </Container>
      </Box>
    </HydrationBoundary>
  );
};