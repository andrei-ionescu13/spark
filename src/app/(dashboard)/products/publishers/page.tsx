'use client';

import { Box, Container } from '@mui/material';
import Head from 'next/head';
import { useSearchPublishersQuery } from './api';
import { PublishersHeader } from './publishers-header';
import { PublishersTable } from './publishers-table';

export default function Publishers() {
  const { data, refetch, isError, isLoading } = useSearchPublishersQuery();
  const { publishers, count } = data || {};

  return (
    <>
      <Head>
        <title>Publishers</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PublishersHeader />
          <PublishersTable
            publishers={publishers}
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
