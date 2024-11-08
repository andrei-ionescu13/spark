import { appFetch } from '@/utils/app-fetch';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

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
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

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
