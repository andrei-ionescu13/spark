'use client';

import ReviewsTable from '@/components/reviews-table';
import Head from 'next/head';
import { useSearchUserReviews } from './api';

export default function UserReviews() {
  const { data, refetch, isError, isLoading } = useSearchUserReviews();
  const { reviews, count } = data || {};

  return (
    <>
      <Head>
        <title>Reviews</title>
      </Head>
      <ReviewsTable
        reviews={reviews}
        count={count}
        showUser={false}
        refetch={refetch}
        isError={isError}
        isLoading={isLoading}
      />
    </>
  );
}
