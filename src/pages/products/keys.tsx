import { useEffect, useState } from "react";
import type { FC } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import { Box, Container } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { PageHeader } from "@/components/page-header";
import { useDialog } from "@/hooks/useDialog";
import { usePage } from "@/hooks/usePage";
import { useLimit } from "@/hooks/usePerPage";
import { useSearch } from "@/hooks/useSearch";
import { Key as KeyIcon } from "@/icons/key";
import { Download as DownloadIcon } from "@/icons/download";
import { Upload as UploadIcon } from "@/icons/upload";
import type { ActionsItem } from "@/components/actions-menu";
import { KeysExportDialog } from "@/components/products/keys/keys-export-dialog";
import { KeysImportDialog } from "@/components/products/keys/keys-import-dialog";
import { KeysTable } from "@/components/keys-table";
import { useQueryValue } from "@/hooks/useQueryValue";
import { appFetch } from "@/utils/app-fetch";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { Key } from "@/types/keys";
import { KeysAddDialog } from "@/components/products/keys/keys-add-dialog";

interface GetKeysData {
  keys: Key[];
  count: number;
}

const getKeys =
  (query: Record<string, any>, config: Record<string, any> = {}) =>
  () =>
    appFetch<GetKeysData>({
      url: "/keys",
      query,
      withAuth: true,
      ...config,
    });

const Keys: FC = () => {
  const { query } = useRouter();
  const [keyword, keywordParam, handleKeywordChange, handleSearch] =
    useSearch();
  const [addKeyDialogOpen, handleOpenAddKey, handleCloseAddKey] = useDialog();
  const [status, setStatus] = useQueryValue("status", "all", "all");
  const { data, isError, isRefetching, refetch } = useQuery(
    ["keys", query],
    getKeys(query)
  );
  const [importKeysDialogOpen, handleOpenImportKeys, handleCloseImportKeys] =
    useDialog(false);

  if (!data) return null;

  const { keys, count } = data;

  const actionItems: ActionsItem[] = [
    {
      label: "Add key",
      icon: KeyIcon,
      onClick: handleOpenAddKey,
    },
    {
      label: "Import",
      icon: DownloadIcon,
      onClick: handleOpenImportKeys,
    },
  ];

  const handleStatusChange = (event: SelectChangeEvent): void => {
    setStatus(event.target.value);
  };

  return (
    <>
      {addKeyDialogOpen && <KeysAddDialog onClose={handleCloseAddKey} open />}
      <KeysImportDialog
        open={importKeysDialogOpen}
        onClose={handleCloseImportKeys}
      />
      <Head>
        <title>Keys</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader title="Keys" actions={actionItems} />
          <KeysTable
            count={count}
            keys={keys}
            onStatusChange={handleStatusChange}
            onKeywordChange={handleKeywordChange}
            onSearch={handleSearch}
            keyword={keyword}
            status={status}
            refetch={refetch}
          />
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
    await queryClient.fetchQuery(["keys", query], getKeys(query, { req, res }));
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Keys;
