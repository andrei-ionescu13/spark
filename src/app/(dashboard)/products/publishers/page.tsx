import { useState } from "react";
import type { FC } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import type { GetServerSideProps } from "next";
import { Box, Card, Container, TableBody } from "@mui/material";
import { dehydrate, HydrationBoundary, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDeletePublishers } from "@/api/publishers";
import { searchPublishers } from "../api-calls";
import { PublishersTable } from "./publishers-table";
import { PublishersHeader } from "./publishers-header";

export default async function Publishers({ searchParams }) {
  const queryClient = new QueryClient();
  const query: any = {};

  for (const [key, value] of Object.entries(searchParams)) {
    query[key] = value;
  }


  await queryClient.prefetchQuery({
    queryKey: ["publishers", query],
    queryFn: searchPublishers(query)
  });



  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Head>
        <title>Publishers</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PublishersHeader />
          <PublishersTable />
        </Container>
      </Box>
    </HydrationBoundary>
  );
};
