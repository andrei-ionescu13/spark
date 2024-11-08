'use client';

import { Box, Container } from '@mui/material';
import Head from 'next/head';
import { PromoCodeForm } from '../promo-code-form';
import { usePromoCode } from './api';
import { PromoCodeHeader } from './promo-code-header';

export default function PromoCode() {
  const { data: promoCode, isLoading, isRefetching } = usePromoCode();

  return (
    <>
      <Head>
        <title>Promo Code</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <PromoCodeHeader
            promoCode={promoCode}
            isLoading={isLoading}
          />
          {!!promoCode && (
            <PromoCodeForm
              promoCode={promoCode}
              mode="update"
              promoCodeIsRefetching={isRefetching}
            />
          )}
        </Container>
      </Box>
    </>
  );
}
