'use client';

import { Box, Container } from '@mui/material';
import Head from 'next/head';
import { useSearchGenresQuery } from './api';
import { GenresHeader } from './genres-header';
import { GenresTable } from './genres-table';

export default function Genres() {
  const { data, refetch, isError, isLoading } = useSearchGenresQuery();
  const { genres, count } = data || {};

  return (
    <>
      <Head>
        <title>Genres</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <GenresHeader />
          <GenresTable
            genres={genres}
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
