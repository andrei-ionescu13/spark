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
import { dehydrate, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { DevelopersHeader } from "./developers-header";
import { useSearchDevelopersQuery } from "../api-calls-hooks";
import { DevelopersTable } from "./developers-table";


export default function Developers() {
  const { data, refetch, isError, isLoading } = useSearchDevelopersQuery();
  const { developers, count } = data || {};

  return (
    <>

      <Head>
        <title>Article developers</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <DevelopersHeader />
          <DevelopersTable
            developers={developers}
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
