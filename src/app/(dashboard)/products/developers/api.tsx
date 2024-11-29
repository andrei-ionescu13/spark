import { useSearchParamsQuery } from '@/hooks/useSearchParamsQuery';
import { Developer } from '@/types/developer';
import { appFetch } from '@/utils/app-fetch';
import { useMutation, useQuery } from '@tanstack/react-query';

interface GetDeveloperData {
  developers: Developer[];
  count: number;
}

export const searchDevelopers = (query: Record<string, any>) => () =>
  appFetch<GetDeveloperData>({
    url: '/developers/search',
    query,
    withAuth: true,
  });

export const useSearchDevelopersQuery = () => {
  const query = useSearchParamsQuery();

  return useQuery({
    queryKey: ['developers', query],
    queryFn: searchDevelopers(query),
  });
};

export const useCreateDeveloper = (onSuccess: any) =>
  useMutation<{ name: string }, Error, Record<string, unknown>>({
    mutationFn: (values) =>
      appFetch({
        url: '/developers',
        config: {
          body: JSON.stringify(values),
          method: 'POST',
        },
        withAuth: true,
      }),
    onSuccess,
  });

export const useDeleteDeveloper = (onSuccess?: () => Promise<any>) =>
  useMutation<{}, Error, string>({
    mutationFn: (developerId) =>
      appFetch({
        url: `/developers/${developerId}`,
        config: {
          method: 'DELETE',
        },
        withAuth: true,
      }),
    onSuccess,
  });

export const useUpdateDeveloper = (id: string, onSuccess: () => Promise<any>) =>
  useMutation<{ name: string }, Error, { name: string; slug: string }>({
    mutationFn: (value) =>
      appFetch({
        withAuth: true,
        url: `/developers/${id}`,
        config: {
          body: JSON.stringify(value),
          method: 'PUT',
        },
      }),
    onSuccess,
  });

export const useDeleteDevelopers = (onSuccess?: () => Promise<any>) =>
  useMutation<{}, Error, string[]>({
    mutationFn: (developerIds) =>
      appFetch({
        url: `/developers`,
        config: {
          body: JSON.stringify({ ids: developerIds }),
          method: 'DELETE',
        },
        withAuth: true,
      }),
    onSuccess,
  });
