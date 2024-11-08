import { Platform } from '@/types/platforms';
import { appFetch } from '@/utils/app-fetch';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

interface SearchPlatformsData {
  platforms: Platform[];
  count: number;
}

export const searchPlatforms = (query: Record<string, any>) => () =>
  appFetch<SearchPlatformsData>({
    url: '/platforms/search',
    query,
    withAuth: true,
  });

export const useSearchPlatformsQuery = () => {
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ['platforms', query],
    queryFn: searchPlatforms(query),
  });
};

export const useCreatePlatform = (onSuccess: () => Promise<any>) =>
  useMutation({
    mutationFn: (values: any) =>
      appFetch({
        url: '/platforms',
        config: {
          body: values,
          method: 'POST',
        },
        withAuth: true,
        noContentType: true,
      }),
    onSuccess,
  });

export const useDeletePlatform = (onSuccess: () => Promise<any>) =>
  useMutation({
    mutationFn: (platformId: string) =>
      appFetch({
        url: `/platforms/${platformId}`,
        config: { method: 'DELETE' },
        withAuth: true,
      }),
    onSuccess,
  });

export const useDeletePlatforms = (onSuccess: () => Promise<any>) =>
  useMutation({
    mutationFn: (platformIds: string[]) =>
      appFetch({
        url: '/platforms',
        config: {
          body: JSON.stringify({ ids: platformIds }),
          method: 'DELETE',
        },
        withAuth: true,
      }),
    onSuccess,
  });

export const useUpdatePlatform = (onSuccess: () => Promise<any>) =>
  useMutation<{}, Error, { id: String; body: BodyInit }>({
    mutationFn: ({ id, body }) =>
      appFetch({
        url: `/platforms/${id}`,
        config: {
          body: body,
          method: 'PUT',
        },
        noContentType: true,
        withAuth: true,
      }),
    onSuccess,
  });
