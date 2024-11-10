'use client';

import { Box, Container } from '@mui/material';
import Head from 'next/head';
import { useGetDealQuery } from './api';
import { DealHeader } from './deal-header';
import { UpdateDealForm } from './update-deal-form';

export default function Deal() {
  const { data: deal } = useGetDealQuery();

  return (
    <>
      <Head>
        <title>Deal</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <DealHeader />
          {deal && <UpdateDealForm deal={deal} />}
        </Container>
      </Box>
    </>
  );
}
