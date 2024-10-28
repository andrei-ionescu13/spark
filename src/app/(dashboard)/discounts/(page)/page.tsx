"use client"

import { useState } from "react";
import type { FC, ChangeEvent } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  Container,
  MenuItem,
  TableBody,
  TextField,
} from "@mui/material";
import { HeadCell } from "@/components/data-table-head";
import { PageHeader } from "@/components/page-header";
import { Plus } from "@/icons/plus";
import { useSearchDiscounts } from "../api-calls-hooks";
import { DiscountsTable } from "./discounts-table";

export default function Discounts() {
  const { data, refetch, isError, isLoading } = useSearchDiscounts();
  const { discounts, count } = data || {};

  return (
    <>
      <Head>
        <title>Discounts</title>
      </Head>

      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title="Discounts"
            action={{
              href: "/discounts/create",
              label: "Create",
              icon: Plus,
            }}
          />
          <DiscountsTable
            refetch={refetch}
            isError={isError}
            isLoading={isLoading}
            discounts={discounts}
            count={count}
          />
        </Container>
      </Box>
    </>
  );
};