'use client';

import { Box, Container } from '@mui/material';
import Head from 'next/head';
import { useSearchDevelopersQuery } from './api';
import { DevelopersHeader } from './developers-header';
import { DevelopersTable } from './developers-table';

export default function Developers() {
  const { data, refetch, isError, isLoading } = useSearchDevelopersQuery();
  const { developers, count } = data || {};

  return (
    <>
      <Head>
        <title>Developers</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <DevelopersHeader />
          <DevelopersTable
            developers={developers}
            count={count}
            isError={isError}
            isLoading={isLoading}
            refetch={refetch}
          />
        </Container>
      </Box>
    </>
  );
}
