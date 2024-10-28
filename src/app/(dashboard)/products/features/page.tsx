"use client"

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
import { ParsedUrlQuery } from "querystring";
import { FeaturesHeader } from "./features-header";
import { FeaturesTable } from "./features-table";
import { Feature } from "@/types/feature";
import { appFetch } from "@/utils/app-fetch";
import { useSearchFeaturesQuery } from "../api-calls-hooks";

export default function Features() {
  const { data, refetch, isError, isLoading } = useSearchFeaturesQuery();
  const { features, count } = data || {};

  return (
    <>
      <Head>
        <title>Features</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <FeaturesHeader />
          <FeaturesTable
            features={features}
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

