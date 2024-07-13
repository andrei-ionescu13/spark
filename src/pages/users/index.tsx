import { useState } from "react";
import type { FC, ChangeEvent } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
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
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/search-input";
import { useDialog } from "@/hooks/useDialog";
import { usePage } from "@/hooks/usePage";
import { useLimit } from "@/hooks/usePerPage";
import { useSearch } from "@/hooks/useSearch";
import { useSort } from "@/hooks/useSort";
import { generateArray } from "@/utils/generate-array";
import { TableRowSkeleton } from "@/components/table-row-skeleton";
import { UsersTableRow } from "@/components/users/users-list/users-table-row";
import { AlertDialog } from "@/components/alert-dialog";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { appFetch } from "@/utils/app-fetch";
import type { User } from "@/types/user";
import { DataTable } from "@/components/data-table";
import { useQueryValue } from "@/hooks/useQueryValue";
import { DataTableHead } from "@/components/data-table-head";
import type { HeadCell } from "@/components/data-table-head";
import { Button } from "@/components/button";

const headCells: HeadCell[] = [
  {
    id: "id",
    label: "Id",
  },
  {
    id: "email",
    label: "Email",
  },
  {
    id: "createdAt",
    label: "Created At",
  },
  {
    id: "ordersCount",
    label: "Total orders",
  },
  {
    id: "totalSpend",
    label: "Total spend",
  },
  {
    id: "status",
    label: "Status",
  },
];

const statusOptions = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Inactive",
    value: "inactive",
  },
  {
    label: "Banned",
    value: "banned",
  },
];

interface GetUsersData {
  users: User[];
  count: number;
}

const getUsers =
  (query: Record<string, any>, config: Record<string, any> = {}) =>
    () =>
      appFetch<GetUsersData>({
        url: "/users/search",
        query,
        withAuth: true,
        ...config,
      });

const Users: FC = () => {
  const { query } = useRouter();
  const [keyword, keywordParam, handleKeywordChange, handleSearch] =
    useSearch();
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useQueryValue("status", "all", "all");
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();
  const { error, data } = useQuery({
    queryKey: ["users", query],
    queryFn: getUsers(query)
  });

  if (!data) return null;

  const { users, count } = data;

  const handleStatusChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setStatus(event.target.value);
  };

  const handleSelect = (id: string): void => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((_id) => _id !== id);
      }

      return [...prevSelected, id];
    });
  };

  const handleSelectAll = (): void => {
    setSelected((prevSelected) => {
      if (prevSelected.length === users?.length) {
        return [];
      }

      return users?.map((user) => user._id);
    });
  };

  return (
    <>
      <AlertDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        title={`Delete multiple users`}
        content="Are you sure you want to permanently delete these user?"
        onSubmit={handleCloseDialog}
        isLoading={false}
      />
      <Head>
        <title>Users</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader title="Users" />
          <Card>
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: {
                  sm: `${!!selected.length ? "auto" : ""} 1fr 240px`,
                },
                p: 2,
              }}
            >
              {!!selected.length && (
                <Button
                  color="error"
                  onClick={handleOpenDialog}
                  variant="contained"
                >
                  Bulk Delete {selected.length}
                </Button>
              )}
              <form onSubmit={handleSearch}>
                <SearchInput
                  onChange={handleKeywordChange}
                  placeholder="Search users..."
                  value={keyword}
                />
              </form>
              <TextField
                select
                id="status"
                label="Status"
                onChange={handleStatusChange}
                value={status}
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <DataTable count={count}>
              <DataTableHead
                headCells={headCells}
                selectedLength={selected.length}
                itemsLength={users.length}
                onSelectAll={handleSelectAll}
              />
              <TableBody>
                {users.map((user) => (
                  <UsersTableRow
                    user={user}
                    key={user._id}
                    onSelect={() => {
                      handleSelect(user._id);
                    }}
                    selected={selected.includes(user._id)}
                  />
                ))}
              </TableBody>
            </DataTable>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
  req,
  res,
}) => {
  const queryClient = new QueryClient();

  try {
    await queryClient.fetchQuery({
      queryKey: ["users", query],
      queryFn: getUsers(query, { req, res })
    });
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Users;
