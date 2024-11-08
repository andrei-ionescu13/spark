import { Review } from '@/types/review';
import { appFetch } from '@/utils/app-fetch';
import { useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'next/navigation';

interface SearchUserReviewsData {
  reviews: Review[];
  count: number;
}

export const searchProductReviews =
  (id: string, query: Record<string, any>) => () =>
    appFetch<SearchUserReviewsData>({
      url: `/products/${id}/reviews`,
      query,
      withAuth: true,
    });

export const useSearchProductReviews = () => {
  const query: any = {};
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ['product-reviews', id, query],
    queryFn: searchProductReviews(id, query),
  });
};
