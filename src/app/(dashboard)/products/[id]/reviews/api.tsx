import { useSearchParamsQuery } from '@/hooks/useSearchParamsQuery';
import { Review } from '@/types/review';
import { appFetch } from '@/utils/app-fetch';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

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
  const { id } = useParams<{ id: string }>();
  const query = useSearchParamsQuery();

  return useQuery({
    queryKey: ['product-reviews', id, query],
    queryFn: searchProductReviews(id, query),
  });
};
