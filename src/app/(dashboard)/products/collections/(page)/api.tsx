import { useSearchParamsQuery } from '@/hooks/useSearchParamsQuery';
import { appFetch } from '@/utils/app-fetch';
import { useMutation, useQuery } from '@tanstack/react-query';

interface SearchCollectionsData {
  collections: any[];
  count: number;
}
export const searchCollections = (query: Record<string, any>) => () =>
  appFetch<SearchCollectionsData>({
    url: '/collections/search',
    query,
    withAuth: true,
  });

export const useSearchCollectionsQuery = () => {
  const query = useSearchParamsQuery();

  return useQuery({
    queryKey: ['collections', query],
    queryFn: searchCollections(query),
  });
};

export const useDeleteCollections = (onSuccess: () => Promise<any>) =>
  useMutation({
    mutationFn: (ids: string[]) =>
      appFetch({
        url: `/collections`,
        config: {
          body: JSON.stringify({ ids }),
          method: 'DELETE',
        },
        withAuth: true,
      }),
    onSuccess,
  });
