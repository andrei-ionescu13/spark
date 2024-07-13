import { useState } from "react";
import type { FC, ChangeEvent } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Box,
  Card,
  Container,
  MenuItem,
  TableBody,
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
import { useQueryValue } from "@/hooks/useQueryValue";
import { CollectionsTableRow } from "@/components/collections/list/collections-table.row";
import { useDeleteCollections } from "@/api/collections";
import { Button } from "@/components/button";

const headCells: HeadCell[] = [
  {
    id: "title",
    label: "Title",
  },
  {
    id: "products",
    label: "Products",
    disableSort: true,
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

interface GetCollectionsData {
  collections: any[];
  count: number;
}

const searchCollections =
  (query: Record<string, any>, config: Record<string, any> = {}) =>
    () =>
      appFetch<GetCollectionsData>({
        url: "/collections/search",
        query,
        withAuth: true,
        ...config,
      });

const Collections: FC = () => {
  const { query } = useRouter();
  const queryClient = useQueryClient();
  const [keyword, keywordParam, handleKeywordChange, handleSearch] =
    useSearch();
  const [selected, setSelected] = useState<string[]>([]);
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();
  const { error, data } = useQuery({
    queryKey: ["collections", query],
    queryFn: searchCollections(query)
  }


  );
  const [status, setStatus] = useQueryValue("status", "all", "all");
  const deleteCollections = useDeleteCollections(() =>
    queryClient.invalidateQueries({ queryKey: ["collections"] })
  );

  if (!data) return null;

  const { collections, count } = data;

  const handleStatusChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setStatus(event.target.value);
  };

  const handleDeleteCollections = (): void => {
    deleteCollections.mutate(selected, {
      onSuccess: () => {
        setSelected([]);
        handleCloseDialog();
      },
      onError: (error) => { },
    });
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
      if (prevSelected.length === collections?.length) {
        return [];
      }

      return collections?.map((collection) => collection._id);
    });
  };

  return (
    <>
      <Head>
        <title>Collections</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title="Collections"
            action={{
              href: "/products/collections/create",
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
                  placeholder="Search products..."
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
                itemsLength={collections.length}
                onSelectAll={handleSelectAll}
              />
              <TableBody>
                {collections?.map((collection) => (
                  <CollectionsTableRow
                    collection={collection}
                    key={collection._id}
                    onSelect={() => {
                      handleSelect(collection._id);
                    }}
                    selected={selected.includes(collection._id)}
                  />
                ))}
              </TableBody>
            </DataTable>
          </Card>
        </Container>
      </Box>
      <AlertDialog
        content="Are you sure you want toelete these collections"
        isLoading={deleteCollections.isPending}
        onClose={handleCloseDialog}
        onSubmit={handleDeleteCollections}
        open={dialogOpen}
        title={`Delete ${selected.length} collections`}
      />
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
      queryKey: ["collections", query],
      queryFn: searchCollections(query, { req, res })
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

export default Collections;
