'use client';

import { Box, Container } from '@mui/material';
import Head from 'next/head';
import { usePromoCode } from './api';
import { PromoCodeHeader } from './promo-code-header';
import { UpdatePromoCodeForm } from './update-promo-code-form';

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
            <UpdatePromoCodeForm
              promoCode={promoCode}
              promoCodeIsRefetching={isRefetching}
            />
          )}
        </Container>
      </Box>
    </>
  );
}
