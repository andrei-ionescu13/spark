import { useSearchParamsQuery } from '@/hooks/useSearchParamsQuery';
import { appFetch } from '@/utils/app-fetch';
import { useMutation, useQuery } from '@tanstack/react-query';

interface SearchDealsData {
  deals: any[];
  count: number;
}
export const searchDeals = (query: Record<string, any>) => () =>
  appFetch<SearchDealsData>({
    url: '/deals/search',
    query,
    withAuth: true,
  });

export const useSearchDealsQuery = () => {
  const query = useSearchParamsQuery();

  return useQuery({
    queryKey: ['deals', query],
    queryFn: searchDeals(query),
  });
};

export const useDeleteDeals = (onSuccess: () => Promise<any>) =>
  useMutation({
    mutationFn: (ids: string[]) =>
      appFetch({
        url: `/deals`,
        config: {
          body: JSON.stringify({ ids }),
          method: 'DELETE',
        },
        withAuth: true,
      }),
    onSuccess,
  });
