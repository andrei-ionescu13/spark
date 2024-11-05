'use client';

import { Box, Container } from '@mui/material';
import Head from 'next/head';
import { useSearchParams } from 'next/navigation';
import { useListLanguagesQuery } from '../api-calls-hooks';
import { useSearchNamespaceTranslations } from './api-calls';
import { NamespaceHeader } from './namespace-header';
import { TranslationsTable } from './translations-table';

export default function Namespace() {
  const listLanguagesQuery = useListLanguagesQuery();
  const searchNamespaceTranslationsQuery = useSearchNamespaceTranslations();

  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

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
