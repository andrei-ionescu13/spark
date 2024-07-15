import { useState } from "react";
import type { FC, SyntheticEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
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
import { dehydrate, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertDialog } from "../../../src/app/components/alert-dialog";
import { PageHeader } from "../../../src/app/components/page-header";
import { SearchInput } from "../../../src/app/components/search-input";
import { Plus as PlusIcon } from "../../../src/app/icons/plus";
import { useSearch } from "../../../src/app/hooks/useSearch";
import { useQueryValue } from "../../../src/app/hooks/useQueryValue";
import { appFetch } from "../../../src/app/utils/app-fetch";
import { DataTable } from "../../../src/app/components/data-table";
import { ParsedUrlQuery } from "querystring";
import { DataTableHead } from "../../../src/app/components/data-table-head";
import type { HeadCell } from "../../../src/app/components/data-table-head";
import { Button } from "../../../src/app/components/button";
import { ArticleCategory } from "../../../src/app/types/article-category";
import { useDialog } from "../../../src/app/hooks/useDialog";
import { useDeleteOperatingSystems } from "@/api/operating-systems";
import { OperatingSystemCreateDialog } from "../../../src/app/components/products/operating-systems/operating-system-create-dialog";
import { OperatingSystemTableRow } from "../../../src/app/components/products/operating-systems/operating-system-table-row";
import { OperatingSystem } from "../../../src/app/types/operating-sistem";

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
  const { data, refetch } = useQuery({
    queryKey: ["operatingSystems", query],
    queryFn: searchOperatingSystem(query)
  }


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
        isLoading={deleteCategories.isPending}
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
