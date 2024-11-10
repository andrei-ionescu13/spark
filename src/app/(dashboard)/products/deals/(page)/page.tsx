'use client';

import { PageHeader } from '@/components/page-header';
import { Plus } from '@/icons/plus';
import { Box, Container } from '@mui/material';
import Head from 'next/head';
import { useSearchDealsQuery } from './api';
import { DealsTable } from './deals-table';

export default function Deals() {
  const { data, refetch, isError, isLoading } = useSearchDealsQuery();
  const { deals, count } = data || {};

  return (
    <>
      <Head>
        <title>Deals</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title="Deals"
            action={{
              href: '/products/deals/create',
              label: 'Create',
              icon: Plus,
            }}
          />
          <DealsTable
            deals={deals}
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
