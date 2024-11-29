'use client';

import { useListNamespaceLanguagesQuery } from '@/api/*';
import { Box, Container } from '@mui/material';
import Head from 'next/head';
import { TranslationsTable } from '../translations-table';
import { useSearchNamespaceTranslations } from './api';
import { NamespaceHeader } from './namespace-header';

export default function Namespace() {
  const listLanguagesQuery = useListNamespaceLanguagesQuery();
  const searchNamespaceTranslationsQuery = useSearchNamespaceTranslations();

  const isLoading =
    searchNamespaceTranslationsQuery.isLoading || listLanguagesQuery.isLoading;

  const isError =
    searchNamespaceTranslationsQuery.isError || listLanguagesQuery.isError;

  return (
    <>
      <Head>
        <title>Translations</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <NamespaceHeader
            namespace={searchNamespaceTranslationsQuery.data}
            languages={listLanguagesQuery.data}
            isLoading={isLoading}
          />
          <TranslationsTable
            languages={listLanguagesQuery.data}
            namespace={searchNamespaceTranslationsQuery.data}
            count={searchNamespaceTranslationsQuery?.data?.count}
            isLoading={isLoading}
            isError={isError}
            refetch={searchNamespaceTranslationsQuery.refetch}
          />
        </Container>
      </Box>
    </>
  );
}
