'use client';

import ReviewsTable from '@/components/reviews-table';
import Head from 'next/head';
import { ProductLayout } from '../product-layout';
import { useSearchProductReviews } from './api';

export default function getProductReviews() {
  const { data, isLoading, isError, refetch } = useSearchProductReviews();
  const { reviews, count } = data || {};

  return (
    <>
      <Head>
        <title>Reviews</title>
      </Head>
      <ProductLayout>
        <ReviewsTable
          reviews={reviews}
          count={count}
          isError={isError}
          isLoading={isLoading}
          refetch={refetch}
        />
      </ProductLayout>
    </>
  );
}
