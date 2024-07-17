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
import { searchDevelopers } from "../api-calls";
import { DevelopersHeader } from "./developers-header";
import { DevelopersTable } from "./Developers-table";


export default async function Developers({ searchParams }) {
  const queryClient = new QueryClient();
  const query: any = {};

  for (const [key, value] of Object.entries(searchParams)) {
    query[key] = value;
  }

  await queryClient.prefetchQuery({
    queryKey: ["developers", query],
    queryFn: searchDevelopers(query)
  });
  return (
    <>

      <Head>
        <title>Article developers</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <DevelopersHeader />
          <DevelopersTable />
        </Container>
      </Box>

    </>
  );
};
