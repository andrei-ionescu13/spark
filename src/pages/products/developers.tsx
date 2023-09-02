import { useState } from "react";
import type { FC, SyntheticEvent, ChangeEvent } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import {
  Box,
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
import { dehydrate, QueryClient, useQuery, useQueryClient } from "react-query";
import { AlertDialog } from "@/components/alert-dialog";
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/search-input";
import { Plus as PlusIcon } from "@/icons/plus";
import { useSearch } from "@/hooks/useSearch";
import { useQueryValue } from "@/hooks/useQueryValue";
import { appFetch } from "@/utils/app-fetch";
import { DataTable } from "@/components/data-table";
import { ParsedUrlQuery } from "querystring";
import { DataTableHead } from "@/components/data-table-head";
import type { HeadCell } from "@/components/data-table-head";
import { Button } from "@/components/button";
import { ArticleCategory } from "@/types/article-category";
import { useDialog } from "@/hooks/useDialog";
import { Developer } from "@/types/developer";
import { useDeleteDevelopers } from "@/api/developers";
import { DeveloperCreateDialog } from "@/components/products/developers/developer-create-dialog";
import { DeveloperTableRow } from "@/components/products/developers/developer-table-row";

const headCells: HeadCell[] = [
  {
    id: "name",
    label: "Name",
  },
  {
    id: "slug",
    label: "Slug",
  },
];

interface GetDeveloperData {
  developers: Developer[];
  count: number;
}

const searchDeveloper =
  (query: ParsedUrlQuery, config: Record<string, any> = {}) =>
  () =>
    appFetch<GetDeveloperData>({
      url: "/developers/search",
      query,
      withAuth: true,
      ...config,
    });

const Developers: FC = () => {
  const { query } = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [keyword, keywordParam, handleKeywordChange, handleSearch] =
    useSearch();
  const { data, refetch } = useQuery(
    ["developers", query],
    searchDeveloper(query)
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const deleteCategories = useDeleteDevelopers(refetch);
  const [createDialogOpen, handleOpenCreateDialog, handleCloseCreateDialog] =
    useDialog();

  if (!data) return null;

  const { developers, count } = data;

  const handleOpenDialog = (): void => {
    setDialogOpen(true);
  };

  const handleCloseDialog = (): void => {
    setDialogOpen(false);
  };

  const handleDeleteDeveloper = (): void => {
    deleteCategories.mutate(selected, {
      onSuccess: () => {
        setSelected([]);
        handleCloseDialog();
      },
      onError: (error) => {},
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
      if (prevSelected.length === developers.length) {
        return [];
      }

      return developers.map((article) => article._id);
    });
  };

  return (
    <>
      {createDialogOpen && (
        <DeveloperCreateDialog open onClose={handleCloseCreateDialog} />
      )}
      <Head>
        <title>Article developers</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title="Developer"
            action={{
              onClick: handleOpenCreateDialog,
              label: "Add",
              icon: PlusIcon,
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
                //@ts-ignore
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
                  placeholder="Search developers..."
                  value={keyword}
                />
              </form>
            </Box>
            <DataTable count={count}>
              <DataTableHead
                headCells={headCells}
                selectedLength={selected.length}
                itemsLength={developers.length}
                onSelectAll={handleSelectAll}
              />
              <TableBody>
                {developers.map((developer) => (
                  <DeveloperTableRow
                    developer={developer}
                    key={developer._id}
                    onSelect={() => {
                      handleSelect(developer._id);
                    }}
                    selected={selected.includes(developer._id)}
                  />
                ))}
              </TableBody>
            </DataTable>
          </Card>
        </Container>
      </Box>
      <AlertDialog
        content="Are you sure you want to permanently delete these developers"
        isLoading={deleteCategories.isLoading}
        onClose={handleCloseDialog}
        onSubmit={handleDeleteDeveloper}
        open={dialogOpen}
        title={`Delete ${selected.length} developers`}
      />
    </>
  );
};

// export const getServerSideProps: GetServerSideProps = async ({
//   locale,
//   query,
//   req,
//   res,
// }) => {
//   const queryClient = new QueryClient();

//   try {
//     await queryClient.fetchQuery(
//       ["developers", query],
//       getCategories(query, { req, res })
//     );
//   } catch (error) {
//     console.error(error);
//   }
//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient),
//     },
//   };
// };

export default Developers;
