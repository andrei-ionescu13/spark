'use client';

import { PageHeader } from '@/components/page-header';
import { Box, Container } from '@mui/material';
import { useGetProduct } from 'app/(dashboard)/products/api-calls-hooks';
import Head from 'next/head';

export default function ProductDetailsUpdate() {
  const { data: product } = useGetProduct();
  const isEditDisabled = product?.status === 'archived';

  return (
    <>
      <Head>Game</Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <PageHeader
            title={product?.title && `${product?.title} details`}
            isLoading={true}
          />
        </Container>
      </Box>
    </>
  );
}
