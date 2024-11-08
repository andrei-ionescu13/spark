import { OperatingSystem } from '@/types/operating-sistem';
import { appFetch } from '@/utils/app-fetch';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

interface GetOperatingSystemData {
  operatingSystems: OperatingSystem[];
  count: number;
}
export const searchOperatingSystems =
  (query: Record<string, any> = {}) =>
  () =>
    appFetch<GetOperatingSystemData>({
      url: '/operating-systems/search',
      query,
      withAuth: true,
    });

export const useSearchOperatingSystemsQuery = () => {
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ['operatingSystems', query],
    queryFn: searchOperatingSystems(query),
  });
};

export const useCreateOperatingSystem = (onSuccess: any) =>
  useMutation<{ name: string }, Error, Record<string, unknown>>({
    mutationFn: (values) =>
      appFetch({
        url: '/operating-systems',
        config: {
          body: JSON.stringify(values),
          method: 'POST',
        },
        withAuth: true,
      }),
    onSuccess,
  });

export const useUpdateOperatingSystem = (
  id: string,
  onSuccess: () => Promise<any>
) =>
  useMutation<{ name: string }, Error, { name: string; slug: string }>({
    mutationFn: (value) =>
      appFetch({
        withAuth: true,
        url: `/operating-systems/${id}`,
        config: {
          body: JSON.stringify(value),
          method: 'PUT',
        },
      }),
    onSuccess,
  });

export const useDeleteOperatingSystems = (onSuccess?: () => Promise<any>) =>
  useMutation<{}, Error, string[]>({
    mutationFn: (operatingSystemIds) =>
      appFetch({
        url: `/operating-systems`,
        config: {
          body: JSON.stringify({ ids: operatingSystemIds }),
          method: 'DELETE',
        },
        withAuth: true,
      }),
    onSuccess,
  });

export const useDeleteOperatingSystem = (onSuccess?: () => Promise<any>) =>
  useMutation<{}, Error, string>({
    mutationFn: (operatingSystemId) =>
      appFetch({
        url: `/operating-systems/${operatingSystemId}`,
        config: {
          method: 'DELETE',
        },
        withAuth: true,
      }),
    onSuccess,
  });
