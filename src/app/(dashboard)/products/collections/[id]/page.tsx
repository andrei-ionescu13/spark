"use client"

import Head from "next/head";
import type { GetServerSideProps } from "next";
import { Box, Container, useTheme, colors } from "@mui/material";
import { dehydrate, HydrationBoundary, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  useDeactivateCollection,
  useDeleteCollection,
} from "@/api/collections";
import { getCollection } from "../../api-calls";
import { CollectionHeader } from "./collection-header";
import { CollectionForm } from "../collection-form";
import { useGetCollectionQuery } from "../../api-calls-hooks";

export default function Collection() {
  const { data: collection } = useGetCollectionQuery();

  return (
    <>
      <Head>
        <title>Collection</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <CollectionHeader />
          {collection && (
            <CollectionForm
              mode="edit"
              collection={collection}
            />
          )}
        </Container>
      </Box>
    </>
  );
};
