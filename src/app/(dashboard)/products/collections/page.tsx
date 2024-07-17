import { useState } from "react";
import type { FC, ChangeEvent } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  Container,
  MenuItem,
  TableBody,
  TextField,
} from "@mui/material";
import { GetServerSideProps } from "next";
import { QueryClient, useQuery, useQueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { useDeleteCollections } from "@/api/collections";
import { searchCollections } from "../api-calls";
import { CollectionsTable } from "./collections-table";
import { Plus } from "@/icons/plus";
import { PageHeader } from "@/components/page-header";



export default async function Collections({ searchParams }: { searchParams: Record<string, string> }) {
  const queryClient = new QueryClient()
  const query: any = {};

  for (const [key, value] of Object.entries(searchParams)) {
    query[key] = value;
  }

  await queryClient.prefetchQuery({
    queryKey: ["collections", query],
    queryFn: searchCollections(query)
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Head>
        <title>Collections</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title="Collections"
            action={{
              href: "/products/collections/create",
              isLink: true,
              label: "Create",
              icon: Plus,
            }}
          />
          <CollectionsTable />
        </Container>
      </Box>
    </HydrationBoundary>
  );
};