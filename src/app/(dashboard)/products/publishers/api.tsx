import { Publisher } from '@/types/publishers';
import { appFetch } from '@/utils/app-fetch';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

interface SearchPublishersData {
  publishers: Publisher[];
  count: number;
}

export const searchPublishers = (query: Record<string, any>) => () =>
  appFetch<SearchPublishersData>({
    url: '/publishers/search',
    query,
    withAuth: true,
  });

export const useSearchPublishersQuery = () => {
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ['publishers', query],
    queryFn: searchPublishers(query),
  });
};

export const useListPublishers = () =>
  useQuery({
    queryKey: ['publishers'],
    queryFn: () =>
      appFetch<Publisher[]>({ url: '/publishers', withAuth: true }),
  });

export const useCreatePublisher = (onSuccess: () => Promise<any>) =>
  useMutation({
    mutationFn: (values: any) =>
      appFetch({
        url: '/publishers',
        config: {
          body: values,
          method: 'POST',
        },
        withAuth: true,
        noContentType: true,
      }),
    onSuccess,
  });

export const useDeletePublisher = () =>
  useMutation({
    mutationFn: (publisherId: string) =>
      appFetch({
        url: `/publishers/${publisherId}`,
        config: { method: 'DELETE' },
        withAuth: true,
      }),
  });

export const useDeletePublishers = (onSuccess: () => Promise<any>) =>
  useMutation({
    mutationFn: (publisherIds: string[]) =>
      appFetch({
        url: '/publishers',
        config: {
          body: JSON.stringify({ ids: publisherIds }),
          method: 'DELETE',
        },
        withAuth: true,
      }),
    onSuccess,
  });

export const useUpdatePublisher = (onSuccess: () => Promise<any>) =>
  useMutation<{}, Error, { id: string; body: BodyInit }>({
    mutationFn: ({ id, body }) =>
      appFetch({
        url: `/publishers/${id}`,
        config: {
          body: body,
          method: 'PUT',
        },
        noContentType: true,
        withAuth: true,
      }),
    onSuccess,
  });
