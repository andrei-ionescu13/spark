import { useSearchParamsQuery } from '@/hooks/useSearchParamsQuery';
import { Review } from '@/types/review';
import { appFetch } from '@/utils/app-fetch';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { ParsedUrlQuery } from 'querystring';

interface SearchUserReviewsData {
  reviews: Review[];
  count: number;
}

export const searchUserReviews =
  (id: string, query: ParsedUrlQuery, config: Record<string, any> = {}) =>
  () =>
    appFetch<SearchUserReviewsData>({
      url: `/users/${id}/reviews`,
      query,
      withAuth: true,
      ...config,
    });

export const useSearchUserReviews = () => {
  const query = useSearchParamsQuery();
  const { id } = useParams<{ id: string }>();

  return useQuery({
    queryKey: ['user-reviews', query],
    queryFn: searchUserReviews(id, query),
  });
};
