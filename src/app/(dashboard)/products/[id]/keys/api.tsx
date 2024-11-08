import { appFetch } from '@/utils/app-fetch';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'next/navigation';
import { Key } from 'react';

interface SearchProductKeysData {
  keys: Key[];
  count: number;
}

export const searchProductKeys =
  (id: string, query: Record<string, any>) => () =>
    appFetch<SearchProductKeysData>({
      url: `/products/${id}/keys`,
      query,
    });

export const useSearchProductKeys = () => {
  const query: any = {};
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ['product-keys', id, query],
    queryFn: searchProductKeys(id, query),
  });
};

export const useImportProductKeys = (onSuccess: () => Promise<any>) =>
  useMutation<{}, Error, { id: string; formData: FormData }>({
    mutationFn: ({ id, formData }) =>
      appFetch({
        url: `/products/${id}/keys/import`,
        config: {
          body: formData,
          method: 'POST',
        },
        withAuth: true,
        noContentType: true,
      }),
    onSuccess,
  });
