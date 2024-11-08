'use client';

import { Box, Container } from '@mui/material';
import Head from 'next/head';
import { useSearchCurrencies } from './api';
import { CurrenciesHeader } from './currencies-header';
import { CurrenciesTable } from './currencies-table';

export default function Currencies() {
  const { data, refetch, isError, isLoading } = useSearchCurrencies();
  const { currencies, count } = data || {};

  return (
    <>
      <Head>
        <title>Currencies</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <CurrenciesHeader />
          <CurrenciesTable
            currencies={currencies}
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
