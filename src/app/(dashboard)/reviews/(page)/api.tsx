import { useSearchParamsQuery } from '@/hooks/useSearchParamsQuery';
import { Review } from '@/types/review';
import { appFetch } from '@/utils/app-fetch';
import { useQuery } from '@tanstack/react-query';
import { ParsedUrlQuery } from 'querystring';

interface SearchReviewsData {
  reviews: Review[];
  count: number;
}

export const searchReviews =
  (query: ParsedUrlQuery, config: Record<string, any> = {}) =>
  () =>
    appFetch<SearchReviewsData>({
      url: '/reviews',
      query,
      withAuth: true,
      ...config,
    });

export const useSearchReviews = () => {
  const query = useSearchParamsQuery();

  return useQuery({
    queryKey: ['reviews', query],
    queryFn: searchReviews(query),
  });
};
