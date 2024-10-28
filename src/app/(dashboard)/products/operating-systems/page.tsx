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
import { OperatingSystemsTable } from "./operating-systems-table";
import { searchOperatingSystems } from "../api-calls";
import { OperatingSystemsHeader } from "./operating-systems-header";
import { useSearchOperatingSystemsQuery } from "../api-calls-hooks";

export default function OperatingSystems() {
  const { data, refetch, isError, isLoading } = useSearchOperatingSystemsQuery();
  const { operatingSystems, count } = data || {};

  return (
    <>
      <Head>
        <title>Operating Systems</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <OperatingSystemsHeader />
          <OperatingSystemsTable
            operatingSystems={operatingSystems}
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