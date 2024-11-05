'use client';

import { Box, Container } from '@mui/material';
import Head from 'next/head';
import { PageHeader } from '../../../components/page-header';
import { useSearchUsers } from '../api-calls-hooks';
import { UsersTable } from './users-table';

export default function Users() {
  const { data, refetch, isError, isLoading } = useSearchUsers();
  const { users, count } = data || {};

  return (
    <>
      <Head>
        <title>Users</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader title="Users" />
          <UsersTable
            users={users}
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
