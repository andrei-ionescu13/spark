import { useState } from "react";
import type { FC } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import type { GetServerSideProps } from "next";
import { Box, Card, Container, TableBody } from "@mui/material";
import { dehydrate, HydrationBoundary, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDeleteGenres } from "@/api/genres";
import type { ParsedUrlQuery } from "querystring";
import { GenresHeader } from "./genres-header";
import { searchGenres } from "../api-calls";
import { GenresTable } from "./genres-table";

export default async function Genres({ searchParams }) {
  const queryClient = new QueryClient();
  const query: any = {};

  for (const [key, value] of Object.entries(searchParams)) {
    query[key] = value;
  }

  await queryClient.prefetchQuery({
    queryKey: ["genres", query],
    queryFn: searchGenres(query)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Head>
        <title>Genres</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <GenresHeader />
          <GenresTable />
        </Container>
      </Box>
    </HydrationBoundary>
  );
};
