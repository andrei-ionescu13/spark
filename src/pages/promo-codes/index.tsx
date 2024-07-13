import { useState } from "react";
import type { FC, ChangeEvent } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
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
import { PageHeader } from "@/components/page-header";
import { useSearch } from "@/hooks/useSearch";
import { useSort } from "@/hooks/useSort";
import { SearchInput } from "@/components/search-input";
import { GetServerSideProps } from "next";
import { QueryClient, useQuery, useQueryClient, dehydrate } from "@tanstack/react-query";
import { useDialog } from "@/hooks/useDialog";
import { AlertDialog } from "@/components/alert-dialog";
import { Plus as PlusIcon } from "@/icons/plus";
import { appFetch } from "@/utils/app-fetch";
import { DataTable } from "@/components/data-table";
import { DataTableHead } from "@/components/data-table-head";
import type { HeadCell } from "@/components/data-table-head";
import { useDeletePromoCodes } from "@/api/promo-codes";
import type { PromoCode } from "@/types/promo-code";
import { PromoCodeTableRow } from "@/components/promo-codes/promo-code-list/promo-code-table-row";
import { useQueryValue } from "@/hooks/useQueryValue";
import { Button } from "@/components/button";

const headCells: HeadCell[] = [
  {
    id: "code",
    label: "Code",
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

interface GetPromoCodesData {
  promoCodes: PromoCode[];
  count: number;
}

const getPromoCodes =
  (query: Record<string, any>, config: Record<string, any> = {}) =>
    () =>
      appFetch<GetPromoCodesData>({
        url: "/promo-codes/search",
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
  const [statusSelected, setStatusSelected] = useState("");
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();
  const { error, data } = useQuery({
    queryKey: ["promo-codes", query],
    queryFn: getPromoCodes(query)
  }


  );
  const deletePromoCodes = useDeletePromoCodes(() =>
    queryClient.invalidateQueries({ queryKey: ["promo-codes"] })
  );
  const [status, setStatus] = useQueryValue("status", "all", "all");

  if (!data) return null;

  const { promoCodes, count } = data;

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
      if (prevSelected.length === promoCodes?.length) {
        return [];
      }

      return promoCodes?.map((promoCode) => promoCode._id);
    });
  };

  const handleDeleteDiscounts = () => {
    deletePromoCodes.mutate(selected, {
      onSuccess: () => {
        setSelected([]);
        handleCloseDialog();
      },
    });
  };

  return (
    <>
      <Head>
        <title>Promo codes</title>
      </Head>
      <AlertDialog
        content="Are you sure you want to permanently delete these promoCodes?"
        isLoading={deletePromoCodes.isPending}
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
              href: "/promo-codes/create",
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
                  placeholder="Search promoCodes..."
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
                itemsLength={promoCodes.length}
                onSelectAll={handleSelectAll}
              />
              <TableBody>
                {promoCodes?.map((promoCode) => (
                  <PromoCodeTableRow
                    promoCode={promoCode}
                    key={promoCode._id}
                    onSelect={() => {
                      handleSelect(promoCode._id);
                    }}
                    selected={selected.includes(promoCode._id)}
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
      queryKey: ["promo-codes", query],
      queryFn: getPromoCodes(query, { req, res })
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
