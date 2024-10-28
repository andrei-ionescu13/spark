"use client"

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
import { useSearchPublishersQuery } from "../api-calls-hooks";

export default function Publishers() {
  const { data, refetch, isError, isLoading } = useSearchPublishersQuery();
  const { publishers, count } = data || {};

  return (
    <>
      <Head>
        <title>Publishers</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PublishersHeader />
          <PublishersTable
            publishers={publishers}
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
