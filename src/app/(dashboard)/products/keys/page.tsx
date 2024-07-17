import { useEffect, useState } from "react";
import type { FC } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import type { GetServerSideProps } from "next";
import { Box, Container } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { PageHeader } from "../../../src/app/components/page-header";
import { useDialog } from "../../../src/app/hooks/useDialog";
import { usePage } from "../../../src/app/hooks/usePage";
import { useLimit } from "../../../src/app/hooks/usePerPage";
import { useSearch } from "../../../src/app/hooks/useSearch";
import { Key as KeyIcon } from "../../../src/app/icons/key";
import { Download as DownloadIcon } from "../../../src/app/icons/download";
import { Upload as UploadIcon } from "../../../src/app/icons/upload";
import type { ActionsItem } from "../../../src/app/components/actions-menu";
import { KeysExportDialog } from "../../../src/app/components/products/keys/keys-export-dialog";
import { KeysImportDialog } from "../../../src/app/components/products/keys/keys-import-dialog";
import { KeysTable } from "../../../src/app/components/keys-table";
import { useQueryValue } from "../../../src/app/hooks/useQueryValue";
import { appFetch } from "../../../src/app/utils/app-fetch";
import { dehydrate, HydrationBoundary, QueryClient, useQuery } from "@tanstack/react-query";
import { Key } from "../../../src/app/types/keys";
import { KeysAddDialog } from "../../../src/app/components/products/keys/keys-add-dialog";
import { searchKeys } from "../api-calls";
import { KeysHeader } from "./keys-header";
import { ProductKeysTable } from "./product-keys-table";

interface GetKeysData {
  keys: Key[];
  count: number;
}



export default async function Keys({ searchParams }) {
  const queryClient = new QueryClient();
  const query: any = {};

  for (const [key, value] of Object.entries(searchParams)) {
    query[key] = value;
  }

  await queryClient.prefetchQuery({
    queryKey: ["keys", query],
    queryFn: searchKeys(query)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Head>
        <title>Keys</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <KeysHeader />
          <ProductKeysTable />
        </Container>
      </Box>
    </HydrationBoundary>
  );
};

