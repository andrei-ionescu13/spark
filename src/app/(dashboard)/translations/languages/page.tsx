'use client';

import { Box, Container } from '@mui/material';
import Head from 'next/head';
import { useListNamespaceLanguagesQuery } from '../api-calls';
import { LanguagesHeader } from './languages-header';
import { LanguagesTable } from './languages-table';

export default function Languages() {
  const { data, refetch, isError, isLoading } =
    useListNamespaceLanguagesQuery();
  const languages = data || [];

  return (
    <>
      <Head>
        <title>Languages</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <LanguagesHeader />
          <LanguagesTable
            languages={languages}
            count={0}
            isError={isError}
            isLoading={isLoading}
            refetch={refetch}
          />
        </Container>
      </Box>
    </>
  );
}
