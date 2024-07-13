import { useState } from "react";
import type { FC } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import { Box, Card, Container, TableBody } from "@mui/material";
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/search-input";
import { useDialog } from "@/hooks/useDialog";
import { useSearch } from "@/hooks/useSearch";
import { useSort } from "@/hooks/useSort";
import { AlertDialog } from "@/components/alert-dialog";
import { Plus as PlusIcon } from "@/icons/plus";
import { PublisherDialog } from "@/components/products/publishers/publisher-dialog";
import { PublishersTableRow } from "@/components/products/publishers/publishers-table-row";
import { dehydrate, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDeletePublishers } from "@/api/publishers";
import { appFetch } from "@/utils/app-fetch";
import { DataTable } from "@/components/data-table";
import { Publisher } from "@/types/publishers";
import { DataTableHead } from "@/components/data-table-head";
import type { HeadCell } from "@/components/data-table-head";
import { Button } from "@/components/button";

const headCells: HeadCell[] = [
  {
    id: "name",
    label: "Name",
  },
];

interface GetPublishers {
  publishers: Publisher[];
  count: number;
}

const getPublishers =
  (query: Record<string, any>, config: Record<string, any> = {}) =>
    () =>
      appFetch<GetPublishers>({
        url: "/publishers/search",
        query,
        withAuth: true,
        ...config,
      });

const Publishers: FC = () => {
  const { query } = useRouter();
  const queryClient = useQueryClient();
  const [keyword, keywordParam, handleKeywordChange, handleSearch] =
    useSearch();
  const [selected, setSelected] = useState<string[]>([]);
  const { error, data } = useQuery({
    queryKey: ["publishers", query],
    queryFn: getPublishers(query)
  });
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();
  const [addDialogOpen, handleOpenAddDialog, handleCloseAddDialog] =
    useDialog();
  const deletePublishers = useDeletePublishers(() =>
    queryClient.invalidateQueries({ queryKey: ["publishers"] })
  );

  if (!data) return null;

  const { publishers, count } = data;

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
      if (prevSelected.length === publishers?.length) {
        return [];
      }

      return publishers?.map((publisher) => publisher._id);
    });
  };

  const handleDeletePublishers = () => {
    deletePublishers.mutate(selected, {
      onSuccess: () => {
        setSelected([]);
        handleCloseDialog();
      },
    });
  };

  return (
    <>
      <AlertDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        title={`Delete multiple publishers`}
        content="Are you sure you want to permanently delete these publisher?"
        onSubmit={handleDeletePublishers}
        isLoading={deletePublishers.isPending}
      />
      {addDialogOpen && <PublisherDialog open onClose={handleCloseAddDialog} />}
      <Head>
        <title>Publishers</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title="Publishers"
            action={{
              label: "Add publisher",
              icon: PlusIcon,
              onClick: handleOpenAddDialog,
            }}
          />
          <Card>
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: {
                  sm: `${!!selected.length ? "auto" : ""} 1fr`,
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
                  placeholder="Search publishers..."
                  value={keyword}
                />
              </form>
            </Box>
            <DataTable count={count}>
              <DataTableHead
                headCells={headCells}
                selectedLength={selected.length}
                itemsLength={publishers.length}
                onSelectAll={handleSelectAll}
              />
              <TableBody>
                {publishers.map((publisher) => (
                  <PublishersTableRow
                    publisher={publisher}
                    key={publisher._id}
                    onSelect={() => {
                      handleSelect(publisher._id);
                    }}
                    selected={selected.includes(publisher._id)}
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
      queryKey: ["publishers", query],
      queryFn: getPublishers(query, { req, res })
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

export default Publishers;
