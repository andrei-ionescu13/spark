'use client';

import { useSearchParamsQuery } from '@/hooks/useSearchParamsQuery';
import { Discount } from '@/types/discounts';
import { appFetch } from '@/utils/app-fetch';
import { useMutation, useQuery } from '@tanstack/react-query';

interface SearchDiscountsData {
  discounts: Discount[];
  count: number;
}

export const searchDiscounts =
  (query: Record<string, any>, config: Record<string, any> = {}) =>
  () =>
    appFetch<SearchDiscountsData>({
      url: '/discounts/search',
      query,
      withAuth: true,
      ...config,
    });

export const useSearchDiscounts = () => {
  const query = useSearchParamsQuery();

  return useQuery({
    queryKey: ['discounts', query],
    queryFn: searchDiscounts(query),
  });
};

export const useDeleteDiscounts = (onSuccess: () => Promise<any>) =>
  useMutation({
    mutationFn: (ids: string[]) =>
      appFetch({
        url: '/discounts',
        config: {
          body: JSON.stringify({ ids: ids }),
          method: 'DELETE',
        },
        withAuth: true,
      }),
    onSuccess,
  });
