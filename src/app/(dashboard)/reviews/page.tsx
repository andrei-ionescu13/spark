"use client"

import { useState } from "react";
import type { FC, SyntheticEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import {
  Box,
  Button,
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
import { PageHeader } from "@/components/page-header";
import ReviewsTable from "@/components/reviews-table";
import { useSearchReviews } from "./api-calls-hooks";
import { Plus } from "@/icons/plus";

export default function Reviews() {
  const { data, refetch, isError, isLoading } = useSearchReviews();
  const { reviews, count } = data || {};

  return (
    <>
      <Head>
        <title>Reviews</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader title="Reviews" />
          <ReviewsTable
            reviews={reviews}
            count={count}
            refetch={refetch}
            isError={isError}
            isLoading={isLoading}
          />
        </Container>
      </Box>
    </>
  );
};
