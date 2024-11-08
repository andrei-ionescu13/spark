import { Review } from '@/types/review';
import { appFetch } from '@/utils/app-fetch';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
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
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ['reviews', query],
    queryFn: searchReviews(query),
  });
};
