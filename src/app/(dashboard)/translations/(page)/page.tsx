"use client";

import { useEffect, useRef, useState } from "react";
import type { FC, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import {
  Box,
  Button,
  Card,
  Container,
  FormControl,
  FormControlLabel,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { TranslationsHeader } from "./translations-header";
import { listLanguages, searchNamespaces } from "../api-calls";
import { Namespace } from "@/types/translations";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import {
  useListLanguagesQuery,
  useSearchNamespacesQuery,
} from "../api-calls-hooks";
import { TranslationsTable } from "./translations-table";

export default function Translations() {
  const { data: namespacesData } = useSearchNamespacesQuery();
  const { data: languages } = useListLanguagesQuery();

  return (
    <>
      <Head>
        <title>Translations</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <TranslationsHeader />
          <TranslationsTable
            languages={languages}
            namespaces={namespacesData?.namespaces}
            count={namespacesData?.count}
          />
        </Container>
      </Box>
    </>
  );
}
