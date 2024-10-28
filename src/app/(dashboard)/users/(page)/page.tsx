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
  Divider,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TableContainer,
  TablePagination,
  FormControlLabel,
  Switch,
  TableSortLabel,
  TextField,
} from "@mui/material";
import { PageHeader } from "../../../components/page-header";
import { SearchInput } from "../../../components/search-input";
import { useDialog } from "../../../hooks/useDialog";
import { usePage } from "../../../hooks/usePage";
import { useLimit } from "../../../hooks/usePerPage";
import { useSearch } from "../../../hooks/useSearch";
import { useSort } from "../../../hooks/useSort";
import { generateArray } from "../../../utils/generate-array";
import { TableRowSkeleton } from "../../../components/table-row-skeleton";
import { UsersTableRow } from "../../components/users/users-list/users-table-row";
import { AlertDialog } from "../../../components/alert-dialog";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { appFetch } from "../../../utils/app-fetch";
import type { User } from "../../../types/user";
import { DataTable } from "../../../components/data-table";
import { useQueryValue } from "../../../hooks/useQueryValue";
import { DataTableHead } from "../../../components/data-table-head";
import type { HeadCell } from "../../../components/data-table-head";
import { Button } from "../../../components/button";
import { useSearchUsers } from "../api-calls-hooks";
import { UsersTable } from "./users-table";

export default function Users() {
  const { data, refetch, isError, isLoading } = useSearchUsers();
  const { users, count } = data || {};

  return (
    <>
      <Head>
        <title>Users</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader title="Users" />
          <UsersTable
            users={users}
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

