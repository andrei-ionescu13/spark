'use client';

import { Namespace } from '@/types/translations';
import { appFetch } from '@/utils/app-fetch';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { ParsedUrlQuery } from 'querystring';

interface GetNamespacesData {
  namespaces: Namespace[];
  count: number;
}
export const searchNamespaces =
  (query: ParsedUrlQuery, config: Record<string, any> = {}) =>
  () =>
    appFetch<GetNamespacesData>({
      url: '/translations/namespaces/search',
      query,
      ...config,
    });

export const useSearchNamespacesQuery = () => {
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ['namespaces', query],
    queryFn: searchNamespaces(query),
  });
};

export const useCreateNamespace = (onSuccess?: () => Promise<any>) =>
  useMutation<{}, Error, Record<string, string>>({
    mutationFn: (values) =>
      appFetch({
        url: '/translations/namespaces',
        config: {
          body: JSON.stringify(values),
          method: 'POST',
        },
        withAuth: true,
      }),
    onSuccess,
  });

export const useUpdateNamespaceName = (onSuccess?: () => Promise<any>) =>
  useMutation<{}, Error, { id: string; name: string }>({
    mutationFn: ({ id, name }) =>
      appFetch({
        url: `/translations/namespaces/${id}/name`,
        config: {
          body: JSON.stringify({ name }),
          method: 'PUT',
        },
        withAuth: true,
      }),
    onSuccess,
  });

export const useAddNamespaceTranslation = (onSuccess?: () => Promise<any>) =>
  useMutation<{}, Error, { id: string; body: Record<string, any> }>({
    mutationFn: ({ id, body }) =>
      appFetch({
        url: `/translations/namespaces/${id}/translation`,
        config: {
          body: JSON.stringify(body),
          method: 'POST',
        },
        withAuth: true,
      }),
    onSuccess,
  });

export const useUpdateNamespaceTranslation = (onSuccess?: () => Promise<any>) =>
  useMutation<
    {},
    Error,
    { id: string; translationKey: string; body: Record<string, any> }
  >({
    mutationFn: ({ id, translationKey, body }) =>
      appFetch({
        url: `/translations/namespaces/${id}/translations/${translationKey}`,
        config: {
          body: JSON.stringify(body),
          method: 'PUT',
        },
        withAuth: true,
      }),
    onSuccess,
  });
