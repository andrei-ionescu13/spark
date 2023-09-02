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
import { Feature } from "@/types/feature";
import { useDeleteFeatures } from "@/api/features";
import { FeatureCreateDialog } from "@/components/products/features/feature-create-dialog";
import { FeatureTableRow } from "@/components/products/features/feature-table-row";

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

interface GetFeatureData {
  features: Feature[];
  count: number;
}

const searchFeature =
  (query: ParsedUrlQuery, config: Record<string, any> = {}) =>
  () =>
    appFetch<GetFeatureData>({
      url: "/features/search",
      query,
      withAuth: true,
      ...config,
    });

const Features: FC = () => {
  const { query } = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [keyword, keywordParam, handleKeywordChange, handleSearch] =
    useSearch();
  const { data, refetch } = useQuery(["features", query], searchFeature(query));
  const [dialogOpen, setDialogOpen] = useState(false);
  const deleteCategories = useDeleteFeatures(refetch);
  const [createDialogOpen, handleOpenCreateDialog, handleCloseCreateDialog] =
    useDialog();

  if (!data) return null;

  const { features, count } = data;

  const handleOpenDialog = (): void => {
    setDialogOpen(true);
  };

  const handleCloseDialog = (): void => {
    setDialogOpen(false);
  };

  const handleDeleteFeature = (): void => {
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
      if (prevSelected.length === features.length) {
        return [];
      }

      return features.map((article) => article._id);
    });
  };

  return (
    <>
      {createDialogOpen && (
        <FeatureCreateDialog open onClose={handleCloseCreateDialog} />
      )}
      <Head>
        <title>Article features</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title="Feature"
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
                  placeholder="Search features..."
                  value={keyword}
                />
              </form>
            </Box>
            <DataTable count={count}>
              <DataTableHead
                headCells={headCells}
                selectedLength={selected.length}
                itemsLength={features.length}
                onSelectAll={handleSelectAll}
              />
              <TableBody>
                {features.map((feature) => (
                  <FeatureTableRow
                    feature={feature}
                    key={feature._id}
                    onSelect={() => {
                      handleSelect(feature._id);
                    }}
                    selected={selected.includes(feature._id)}
                  />
                ))}
              </TableBody>
            </DataTable>
          </Card>
        </Container>
      </Box>
      <AlertDialog
        content="Are you sure you want to permanently delete these features"
        isLoading={deleteCategories.isLoading}
        onClose={handleCloseDialog}
        onSubmit={handleDeleteFeature}
        open={dialogOpen}
        title={`Delete ${selected.length} features`}
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
//       ["features", query],
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

export default Features;
