"use client"

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
import { useSearchCollectionsQuery } from "../api-calls-hooks";

export default function Collections() {
  const { data, refetch, isError, isLoading } = useSearchCollectionsQuery();
  const { collections, count } = data || {};

  return (
    <>
      <Head>
        <title>Collections</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title="Collections"
            action={{
              href: "/products/collections/create",
              label: "Create",
              icon: Plus,
            }}
          />
          <CollectionsTable
            collections={collections}
            count={count}
            isError={isError}
            isLoading={isLoading}
            refetch={refetch}
          />
        </Container>
      </Box>
    </>
  );
};