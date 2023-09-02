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
import { useDeleteOperatingSystems } from "@/api/operating-systems";
import { OperatingSystemCreateDialog } from "@/components/products/operating-systems/operating-system-create-dialog";
import { OperatingSystemTableRow } from "@/components/products/operating-systems/operating-system-table-row";
import { OperatingSystem } from "@/types/operating-sistem";

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

interface GetOperatingSystemData {
  operatingSystems: OperatingSystem[];
  count: number;
}

const searchOperatingSystem =
  (query: ParsedUrlQuery, config: Record<string, any> = {}) =>
  () =>
    appFetch<GetOperatingSystemData>({
      url: "/operating-systems/search",
      query,
      withAuth: true,
      ...config,
    });

const OperatingSystems: FC = () => {
  const { query } = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [keyword, keywordParam, handleKeywordChange, handleSearch] =
    useSearch();
  const { data, refetch } = useQuery(
    ["operatingSystems", query],
    searchOperatingSystem(query)
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const deleteCategories = useDeleteOperatingSystems(refetch);
  const [createDialogOpen, handleOpenCreateDialog, handleCloseCreateDialog] =
    useDialog();

  if (!data) return null;

  const { operatingSystems, count } = data;

  const handleOpenDialog = (): void => {
    setDialogOpen(true);
  };

  const handleCloseDialog = (): void => {
    setDialogOpen(false);
  };

  const handleDeleteOperatingSystem = (): void => {
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
      if (prevSelected.length === operatingSystems.length) {
        return [];
      }

      return operatingSystems.map((article) => article._id);
    });
  };

  return (
    <>
      {createDialogOpen && (
        <OperatingSystemCreateDialog open onClose={handleCloseCreateDialog} />
      )}
      <Head>
        <title>Operating Systems</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title="Operating Systems"
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
                  placeholder="Search Operating Systems..."
                  value={keyword}
                />
              </form>
            </Box>
            <DataTable count={count}>
              <DataTableHead
                headCells={headCells}
                selectedLength={selected.length}
                itemsLength={operatingSystems.length}
                onSelectAll={handleSelectAll}
              />
              <TableBody>
                {operatingSystems.map((operatingSystem) => (
                  <OperatingSystemTableRow
                    operatingSystem={operatingSystem}
                    key={operatingSystem._id}
                    onSelect={() => {
                      handleSelect(operatingSystem._id);
                    }}
                    selected={selected.includes(operatingSystem._id)}
                  />
                ))}
              </TableBody>
            </DataTable>
          </Card>
        </Container>
      </Box>
      <AlertDialog
        content="Are you sure you want to permanently delete these operatingSystems"
        isLoading={deleteCategories.isLoading}
        onClose={handleCloseDialog}
        onSubmit={handleDeleteOperatingSystem}
        open={dialogOpen}
        title={`Delete ${selected.length} operatingSystems`}
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
//       ["operatingSystems", query],
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

export default OperatingSystems;
