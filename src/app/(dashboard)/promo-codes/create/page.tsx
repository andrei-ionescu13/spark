'use client';

import { Box, Container } from '@mui/material';
import Head from 'next/head';
import { PageHeader } from '../../../components/page-header';
import { CreatePromoCodeForm } from './create-promo-code-form ';

export default function DiscountCreate() {
  return (
    <>
      <Head>
        <title>Promo code Create</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <PageHeader
            backHref="/promo-codes"
            backLabel="Promo codes"
            title="Create promo code"
          />
          <CreatePromoCodeForm />
        </Container>
      </Box>
    </>
  );
}
