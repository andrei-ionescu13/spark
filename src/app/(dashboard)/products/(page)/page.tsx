'use client';

import { PageHeader } from '@/components/page-header';
import { Plus } from '@/icons/plus';
import { Box, Container } from '@mui/material';
import Head from 'next/head';
import { useSearchProducts } from './api';
import { ProductsTable } from './products-table';

export default function Products() {
  const { data, refetch, isError, isLoading } = useSearchProducts();
  const { products, count } = data || {};

  return (
    <>
      <Head>
        <title>Products</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title="Products"
            action={{
              href: '/products/create',
              label: 'Add',
              icon: Plus,
            }}
          />
          <ProductsTable
            products={products}
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
