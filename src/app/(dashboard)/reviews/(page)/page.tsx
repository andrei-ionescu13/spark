'use client';

import { PageHeader } from '@/components/page-header';
import ReviewsTable from '@/components/reviews-table';
import { Box, Container } from '@mui/material';
import Head from 'next/head';
import { useSearchReviews } from './api';

export default function Reviews() {
  const { data, refetch, isError, isLoading } = useSearchReviews();
  const { reviews, count } = data || {};

  return (
    <>
      <Head>
        <title>Reviews</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader title="Reviews" />
          <ReviewsTable
            reviews={reviews}
            count={count}
            refetch={refetch}
            isError={isError}
            isLoading={isLoading}
          />
        </Container>
      </Box>
    </>
  );
}
