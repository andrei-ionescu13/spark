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
import { PageHeader } from "../../../src/app/components/page-header";
import { useSearch } from "../../../src/app/hooks/useSearch";
import { useSort } from "../../../src/app/hooks/useSort";
import { SearchInput } from "../../../src/app/components/search-input";
import { GetServerSideProps } from "next";
import { QueryClient, useQuery, useQueryClient, dehydrate } from "@tanstack/react-query";
import { useDialog } from "../../../src/app/hooks/useDialog";
import { AlertDialog } from "../../../src/app/components/alert-dialog";
import { Plus as PlusIcon } from "../../../src/app/icons/plus";
import { appFetch } from "../../../src/app/utils/app-fetch";
import { DataTable } from "../../../src/app/components/data-table";
import { DataTableHead } from "../../../src/app/components/data-table-head";
import type { HeadCell } from "../../../src/app/components/data-table-head";
import type { Discount } from "../../../src/app/types/discounts";
import { DiscountsTableRow } from "../../../src/app/components/discounts/discount-list/discounts-table-row";
import { useDeleteDiscounts } from "@/api/discounts";
import { useQueryValue } from "../../../src/app/hooks/useQueryValue";
import { Button } from "../../../src/app/components/button";

const headCells: HeadCell[] = [
  {
    id: "title",
    label: "Title",
  },
  {
    id: "startDate",
    label: "Start Date",
  },
  {
    id: "endDate",
    label: "End Date",
  },
  {
    id: "status",
    label: "Status",
    disableSort: true,
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
    label: "Scheduled",
    value: "scheduled",
  },
  {
    label: "Expired",
    value: "expired",
  },
];

interface GetDiscountsData {
  discounts: Discount[];
  count: number;
}

const getProducts =
  (query: Record<string, any>, config: Record<string, any> = {}) =>
    () =>
      appFetch<GetDiscountsData>({
        url: "/discounts/search",
        query,
        withAuth: true,
        ...config,
      });

const Discounts: FC = () => {
  const { query } = useRouter();
  const queryClient = useQueryClient();
  const [keyword, keywordParam, handleKeywordChange, handleSearch] =
    useSearch();
  const [selected, setSelected] = useState<string[]>([]);
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();
  const { error, data } = useQuery({
    queryKey: ["discounts", query],
    queryFn: getProducts(query)
  });
  const deleteDiscounts = useDeleteDiscounts(() =>
    queryClient.invalidateQueries({ queryKey: ["discounts"] })
  );
  const [status, setStatus] = useQueryValue("status", "all", "all");

  if (!data) return null;

  const { discounts, count } = data;

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
      if (prevSelected.length === discounts?.length) {
        return [];
      }

      return discounts?.map((discount) => discount._id);
    });
  };

  const handleDeleteDiscounts = () => {
    deleteDiscounts.mutate(selected, {
      onSuccess: () => {
        setSelected([]);
        handleCloseDialog();
      },
    });
  };

  return (
    <>
      <Head>
        <title>Discounts</title>
      </Head>
      <AlertDialog
        content="Are you sure you want to permanently delete these discounts?"
        isLoading={deleteDiscounts.isPending}
        onClose={handleCloseDialog}
        onSubmit={handleDeleteDiscounts}
        open={dialogOpen}
        title={`Delete ${selected.length} articles`}
      />
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title="Discounts"
            action={{
              href: "/discounts/create",
              isLink: true,
              label: "Create",
              icon: PlusIcon,
            }}
          />
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
                  placeholder="Search discounts..."
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
                itemsLength={discounts.length}
                onSelectAll={handleSelectAll}
              />
              <TableBody>
                {discounts?.map((discount) => (
                  <DiscountsTableRow
                    discount={discount}
                    key={discount._id}
                    onSelect={() => {
                      handleSelect(discount._id);
                    }}
                    selected={selected.includes(discount._id)}
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
      queryKey: ["discounts", query],
      queryFn: getProducts(query, { req, res })
    }


    );
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Discounts;
