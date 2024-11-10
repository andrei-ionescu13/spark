import { PageHeader } from '@/components/page-header';
import { Box, Container } from '@mui/material';
import Head from 'next/head';
import type { FC } from 'react';
import { CreateDealForm } from './create-deal-form';

const DealCreate: FC = () => {
  return (
    <>
      <Head>
        <title>Deal Create</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <PageHeader
            backHref="/products/deals"
            backLabel="Deals"
            title="Create deal"
          />
          <CreateDealForm />
        </Container>
      </Box>
    </>
  );
};

export default DealCreate;
