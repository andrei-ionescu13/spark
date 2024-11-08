'use client';

import { Box, Container } from '@mui/material';
import Head from 'next/head';
import { useSearchOperatingSystemsQuery } from './api';
import { OperatingSystemsHeader } from './operating-systems-header';
import { OperatingSystemsTable } from './operating-systems-table';

export default function OperatingSystems() {
  const { data, refetch, isError, isLoading } =
    useSearchOperatingSystemsQuery();
  const { operatingSystems, count } = data || {};

  return (
    <>
      <Head>
        <title>Operating Systems</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <OperatingSystemsHeader />
          <OperatingSystemsTable
            operatingSystems={operatingSystems}
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
