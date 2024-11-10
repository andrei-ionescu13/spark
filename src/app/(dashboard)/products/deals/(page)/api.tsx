import { appFetch } from '@/utils/app-fetch';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

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
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

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
