import type { FC } from "react";
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
import { CollectionForm } from "@/components/collections/collection-form";

export default async function Collection({ params }) {
  const { id } = params;
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["collection", id],
    queryFn: getCollection(id)
  });


  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Head>
        <title>Collection</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <CollectionHeader />
          <CollectionForm mode="edit" />
        </Container>
      </Box>
    </HydrationBoundary>
  );
};
