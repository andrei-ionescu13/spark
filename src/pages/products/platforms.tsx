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
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/search-input";
import { useDialog } from "@/hooks/useDialog";
import { usePage } from "@/hooks/usePage";
import { useLimit } from "@/hooks/usePerPage";
import { useSearch } from "@/hooks/useSearch";
import { useSort } from "@/hooks/useSort";
import { AlertDialog } from "@/components/alert-dialog";
import { Plus as PlusIcon } from "@/icons/plus";
import { PlatformDialog } from "@/components/products/platforms/platform-dialog";
import { PlatformsTableRow } from "@/components/products/platforms/platforms-table-row";
import { dehydrate, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDeletePlatforms } from "@/api/platforms";
import { appFetch } from "@/utils/app-fetch";
import { DataTable } from "@/components/data-table";
import { Platform } from "@/types/platforms";
import { DataTableHead } from "@/components/data-table-head";
import type { HeadCell } from "@/components/data-table-head";
import { Button } from "@/components/button";

const headCells: HeadCell[] = [
  {
    id: "name",
    label: "Name",
  },
];

interface GetPlatforms {
  platforms: Platform[];
  count: number;
}

const getPlatforms =
  (query: Record<string, any>, config: Record<string, any> = {}) =>
    () =>
      appFetch<GetPlatforms>({
        url: "/platforms/search",
        query,
        withAuth: true,
        ...config,
      });

const Platforms: FC = () => {
  const { query } = useRouter();
  const queryClient = useQueryClient();
  const [keyword, keywordParam, handleKeywordChange, handleSearch] =
    useSearch();
  const [selected, setSelected] = useState<string[]>([]);
  const { error, data } = useQuery({
    queryKey: ["platforms", query],
    queryFn: getPlatforms(query)
  });
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();
  const [addDialogOpen, handleOpenAddDialog, handleCloseAddDialog] =
    useDialog();
  const deletePlatforms = useDeletePlatforms(() =>
    queryClient.invalidateQueries({ queryKey: ["platforms"] })
  );

  if (!data) return null;

  const { platforms, count } = data;

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
      if (prevSelected.length === platforms?.length) {
        return [];
      }

      return platforms?.map((platform) => platform._id);
    });
  };

  const handleDeleteArticles = (): void => {
    deletePlatforms.mutate(selected, {
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
        title={`Delete multiple platforms`}
        content="Are you sure you want to permanently delete these platform?"
        onSubmit={handleDeleteArticles}
        isLoading={deletePlatforms.isPending}
      />
      {addDialogOpen && <PlatformDialog open onClose={handleCloseAddDialog} />}
      <Head>
        <title>Platforms</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title="Platforms"
            action={{
              label: "Add",
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
                  placeholder="Search platforms..."
                  value={keyword}
                />
              </form>
            </Box>
            <DataTable count={count}>
              <DataTableHead
                headCells={headCells}
                selectedLength={selected.length}
                itemsLength={platforms.length}
                onSelectAll={handleSelectAll}
              />
              <TableBody>
                {platforms.map((platform) => (
                  <PlatformsTableRow
                    platform={platform}
                    key={platform._id}
                    onSelect={() => {
                      handleSelect(platform._id);
                    }}
                    selected={selected.includes(platform._id)}
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
      queryKey: ["platforms", query],
      queryFn: getPlatforms(query, { req, res })
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

export default Platforms;
