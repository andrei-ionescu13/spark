'use client';

import { Box, Container } from '@mui/material';
import Head from 'next/head';
import { useSearchFeaturesQuery } from './api';
import { FeaturesHeader } from './features-header';
import { FeaturesTable } from './features-table';

export default function Features() {
  const { data, refetch, isError, isLoading } = useSearchFeaturesQuery();
  const { features, count } = data || {};

  return (
    <>
      <Head>
        <title>Features</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <FeaturesHeader />
          <FeaturesTable
            features={features}
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
