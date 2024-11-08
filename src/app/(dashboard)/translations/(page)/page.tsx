'use client';

import { Box, Container } from '@mui/material';
import Head from 'next/head';
import { useListNamespaceLanguagesQuery } from '../api-calls';
import { useSearchNamespacesQuery } from './api';
import { NamespacesHeader } from './namespaces-header';
import { NamespacesTable } from './namespaces-table';

export default function Namespaces() {
  const searchNamespacesQuery = useSearchNamespacesQuery();
  const listLanguagesQuery = useListNamespaceLanguagesQuery();
  const isLoading =
    searchNamespacesQuery.isLoading || listLanguagesQuery.isLoading;
  const isError = searchNamespacesQuery.isError || listLanguagesQuery.isError;

  return (
    <>
      <Head>
        <title>Translations</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <NamespacesHeader />
          <NamespacesTable
            languages={listLanguagesQuery.data}
            namespaces={searchNamespacesQuery.data?.namespaces}
            count={searchNamespacesQuery.data?.count}
            isLoading={isLoading}
            isError={isError}
            refetch={searchNamespacesQuery.refetch}
          />
        </Container>
      </Box>
    </>
  );
}
