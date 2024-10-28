"use client"
import { useState } from "react";
import type { FC, ChangeEvent } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  Checkbox,
  Container,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
} from "@mui/material";
import { PageHeader } from "../../../components/page-header";
import { useSearch } from "../../../hooks/useSearch";
import { useSort } from "../../../hooks/useSort";
import { SearchInput } from "../../../components/search-input";
import { GetServerSideProps } from "next";
import { QueryClient, useQuery, useQueryClient, dehydrate } from "@tanstack/react-query";
import { useDialog } from "../../../hooks/useDialog";
import { AlertDialog } from "../../../components/alert-dialog";
import { Plus as PlusIcon } from "../../../icons/plus";
import { appFetch } from "../../../utils/app-fetch";
import { DataTable } from "../../../components/data-table";
import { DataTableHead } from "../../../components/data-table-head";
import type { HeadCell } from "../../../components/data-table-head";
import { useDeletePromoCodes } from "@/api/promo-codes";
import type { PromoCode } from "../../../types/promo-code";
import { PromoCodeTableRow } from "../../components/promo-codes/promo-code-list/promo-code-table-row";
import { useQueryValue } from "../../../hooks/useQueryValue";
import { Button } from "../../../components/button";
import { useSearchPromoCodes } from "../api-calls-hooks";
import { PromoCodesTable } from "./promo-codes-table";

export default function PromoCodes() {
  const { data, isError, isLoading, refetch } = useSearchPromoCodes()
  const { promoCodes, count } = data || {};

  return (
    <>
      <Head>
        <title>Promo codes</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title="Discounts"
            action={{
              href: "/promo-codes/create",
              label: "Create",
              icon: PlusIcon,
            }}
          />
          <PromoCodesTable
            promoCodes={promoCodes}
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
