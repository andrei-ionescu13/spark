'use client';
import { Box, Container } from '@mui/material';
import Head from 'next/head';
import { PageHeader } from '../../../components/page-header';
import { Plus as PlusIcon } from '../../../icons/plus';
import { useSearchPromoCodes } from './api';
import { PromoCodesTable } from './promo-codes-table';

export default function PromoCodes() {
  const { data, isError, isLoading, refetch } = useSearchPromoCodes();
  const { promoCodes, count } = data || {};

  return (
    <>
      <Head>
        <title>Promo codes</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title="Promo codes"
            action={{
              href: '/promo-codes/create',
              label: 'Create',
              icon: PlusIcon,
            }}
          />
          <PromoCodesTable
            promoCodes={promoCodes}
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
