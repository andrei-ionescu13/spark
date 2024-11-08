'use client';

import { Box, Container } from '@mui/material';
import Head from 'next/head';
import { useSearchPlatformsQuery } from './api';
import { PlatformsHeader } from './platforms-header';
import { PlatformsTable } from './platforms-table';

export default function Platforms() {
  const { data, refetch, isError, isLoading } = useSearchPlatformsQuery();
  const { platforms, count } = data || {};

  return (
    <>
      <Head>
        <title>Platforms</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PlatformsHeader />
          <PlatformsTable
            platforms={platforms}
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
