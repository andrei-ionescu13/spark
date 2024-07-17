"use client"

import type { FC } from 'react'
import { useSearchCollectionsQuery } from '../../api-calls-hooks';
import ReviewsTable from '@/components/reviews-table';

interface ProductReviewsTableProps {
}

export const ProductReviewsTable: FC<ProductReviewsTableProps> = (props) => {
  const { data, refetch } = useSearchCollectionsQuery()

  if (!data) return null;

  const { reviews, count } = data;

  return (
    <ReviewsTable
      refetch={refetch}
      reviews={reviews}
      count={count}
      showProduct={false}
    />
  )
};
