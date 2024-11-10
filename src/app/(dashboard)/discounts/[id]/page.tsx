'use client';

import { Box, Container } from '@mui/material';
import Head from 'next/head';
import { useGetDiscount } from './api';
import { DiscountHeader } from './discount-header';
import { UpdateDiscountForm } from './update-discount-form';

export default function Discount() {
  const { data: discount, isLoading } = useGetDiscount();

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
          {discount && <UpdateDiscountForm discount={discount} />}
        </Container>
      </Box>
    </>
  );
}
