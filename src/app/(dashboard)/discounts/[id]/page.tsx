'use client';

import { Box, Container } from '@mui/material';
import Head from 'next/head';
import { DiscountForm } from '../discount-form';
import { useGetDiscount } from './api';
import { DiscountHeader } from './discount-header';

export default function Discount() {
  const { data: discount, isLoading, isRefetching } = useGetDiscount();

  return (
    <>
      <Head>
        <title>Discount</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <DiscountHeader
            discount={discount}
            isLoading={isLoading}
          />
          {discount && (
            <DiscountForm
              discount={discount}
              mode="update"
              discountIsRefetching={isRefetching}
            />
          )}
        </Container>
      </Box>
    </>
  );
}
