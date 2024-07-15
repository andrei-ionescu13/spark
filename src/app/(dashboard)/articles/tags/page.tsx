"use client"
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
  Button,
} from "@mui/material";
import { dehydrate, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDeleteArticleTags } from "@/api/article-tags";
import { AlertDialog } from "@/components/alert-dialog";
import { ArticleTagCreateDialog } from "@/components/articles/tag/tag-create-dialog";
import { TagTableRow } from "@/components/articles/tag/tag-table-row";
import { DataTable } from "@/components/data-table";
import { HeadCell, DataTableHead } from "@/components/data-table-head";
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/search-input";
import { useDialog } from "@/hooks/useDialog";
import { useSearch } from "@/hooks/useSearch";
import { ArticleTag } from "@/types/article-tag";
import { appFetch } from "@/utils/app-fetch";
import { ParsedUrlQuery } from "querystring";
import { Plus } from "@/icons/plus";

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

interface GetTagsData {
  tags: ArticleTag[];
  count: number;
}

const searchTags =
  (query: ParsedUrlQuery, config: Record<string, any> = {}) =>
    () =>
      appFetch<GetTagsData>({
        url: "/article-tags/search",
        query,
        withAuth: true,
        ...config,
      });

const ArticleTags: FC = () => {
  const { query } = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [keyword, keywordParam, handleKeywordChange, handleSearch] =
    useSearch();
  const { data, refetch } = useQuery({
    queryKey: ["article-tags", query],
    queryFn: searchTags(query)
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const deleteCategories = useDeleteArticleTags(refetch);
  const [createDialogOpen, handleOpenCreateDialog, handleCloseCreateDialog] =
    useDialog();

  if (!data) return null;

  const { tags, count } = data;

  const handleOpenDialog = (): void => {
    setDialogOpen(true);
  };

  const handleCloseDialog = (): void => {
    setDialogOpen(false);
  };

  const handleDeleteTags = (): void => {
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
      if (prevSelected.length === tags.length) {
        return [];
      }

      return tags.map((article) => article._id);
    });
  };

  return (
    <>
      {createDialogOpen && (
        <ArticleTagCreateDialog open onClose={handleCloseCreateDialog} />
      )}
      <Head>
        <title>Article categories</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title="Tags"
            action={{
              onClick: handleOpenCreateDialog,
              label: "Add",
              icon: Plus,
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
                  placeholder="Search tags..."
                  value={keyword}
                />
              </form>
            </Box>
            <DataTable count={count}>
              <DataTableHead
                headCells={headCells}
                selectedLength={selected.length}
                itemsLength={tags.length}
                onSelectAll={handleSelectAll}
              />
              <TableBody>
                {tags.map((tag) => (
                  <TagTableRow
                    articleTag={tag}
                    key={tag._id}
                    onSelect={() => {
                      handleSelect(tag._id);
                    }}
                    selected={selected.includes(tag._id)}
                  />
                ))}
              </TableBody>
            </DataTable>
          </Card>
        </Container>
      </Box>
      <AlertDialog
        content="Are you sure you want to permanently delete these categories"
        isLoading={deleteCategories.isPending}
        onClose={handleCloseDialog}
        onSubmit={handleDeleteTags}
        open={dialogOpen}
        title={`Delete ${selected.length} categories`}
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
//       ["article-tags", query],
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

export default ArticleTags;
