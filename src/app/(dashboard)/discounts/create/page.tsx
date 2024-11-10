'use client';

import { PageHeader } from '@/components/page-header';
import { Box, Container } from '@mui/material';
import Head from 'next/head';
import { CreateDiscountForm } from './create-discount-form';

export default function DiscountCreate() {
  return (
    <>
      <Head>
        <title>Discount Create</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <PageHeader
            backHref="/discounts"
            backLabel="Discounts"
            title="Create discount"
          />
          <CreateDiscountForm />
        </Container>
      </Box>
    </>
  );
}
