'use client';

import { PageHeader } from '@/components/page-header';
import { Plus } from '@/icons/plus';
import { Box, Container } from '@mui/material';
import Head from 'next/head';
import { useSearchDiscounts } from './api';
import { DiscountsTable } from './discounts-table';

export default function Discounts() {
  const { data, refetch, isError, isLoading } = useSearchDiscounts();
  const { discounts, count } = data || {};

  return (
    <>
      <Head>
        <title>Discounts</title>
      </Head>

      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title="Discounts"
            action={{
              href: '/discounts/create',
              label: 'Create',
              icon: Plus,
            }}
          />
          <DiscountsTable
            refetch={refetch}
            isError={isError}
            isLoading={isLoading}
            discounts={discounts}
            count={count}
          />
        </Container>
      </Box>
    </>
  );
}
