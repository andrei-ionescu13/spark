"use client"

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
import { useSearchGenresQuery } from "../api-calls-hooks";

export default function Genres() {
  const { data, refetch, isError, isLoading } = useSearchGenresQuery();
  const { genres, count } = data || {};

  return (
    <>
      <Head>
        <title>Genres</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <GenresHeader />
          <GenresTable
            genres={genres}
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
