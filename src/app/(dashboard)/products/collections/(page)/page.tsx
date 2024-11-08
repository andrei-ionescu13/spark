'use client';

import { PageHeader } from '@/components/page-header';
import { Plus } from '@/icons/plus';
import { Box, Container } from '@mui/material';
import Head from 'next/head';
import { useSearchCollectionsQuery } from './api';
import { CollectionsTable } from './collections-table';

export default function Collections() {
  const { data, refetch, isError, isLoading } = useSearchCollectionsQuery();
  const { collections, count } = data || {};

  return (
    <>
      <Head>
        <title>Collections</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title="Collections"
            action={{
              href: '/products/collections/create',
              label: 'Create',
              icon: Plus,
            }}
          />
          <CollectionsTable
            collections={collections}
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
