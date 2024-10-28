"use client"

import Head from "next/head";
import type { GetServerSideProps } from "next";
import {
  Box,
  Card,
  Container,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useListLanguagesQuery } from "../api-calls-hooks";
import { LanguagesHeader } from "./languages-header";
import { LanguagesTable } from "./languages-table";

export default function Languages() {
  const { data, refetch, isError, isLoading } = useListLanguagesQuery();
  const languages = data || [];

  return (
    <>
      <Head>
        <title>Languages</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <LanguagesHeader />
          <LanguagesTable
            languages={languages}
            count={0}
            isError={isError}
            isLoading={isLoading}
            refetch={refetch}
          />
        </Container>
      </Box>
    </>
  );
};
