"use client"

import { useState } from "react";
import type { FC, ChangeEvent } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import type { GetServerSideProps } from "next";
import {
  Box,
  Card,
  Checkbox,
  Container,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { dehydrate, HydrationBoundary, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { searchPlatforms } from "../api-calls";
import { PlatformsHeader } from "./platforms-header";
import { PlatformsTable } from "./platforms-table";
import { useSearchPlatformsQuery } from "../api-calls-hooks";

export default function Platforms() {
  const { data, refetch, isError, isLoading } = useSearchPlatformsQuery();
  const { platforms, count } = data || {};

  return (
    <>
      <Head>
        <title>Platforms</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PlatformsHeader />
          <PlatformsTable
            platforms={platforms}
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