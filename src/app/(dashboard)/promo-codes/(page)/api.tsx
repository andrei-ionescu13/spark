import { PromoCode } from '@/types/promo-code';
import { appFetch } from '@/utils/app-fetch';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

interface SearchPromoCodesData {
  promoCodes: PromoCode[];
  count: number;
}

export const searchPromoCodes =
  (query: Record<string, any>, config: Record<string, any> = {}) =>
  () =>
    appFetch<SearchPromoCodesData>({
      url: '/promo-codes/search',
      query,
      withAuth: true,
      ...config,
    });

export const useSearchPromoCodes = () => {
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ['promo-codes', query],
    queryFn: searchPromoCodes(query),
  });
};

export const useDeletePromoCodes = (onSuccess: () => Promise<any>) =>
  useMutation({
    mutationFn: (ids: string[]) =>
      appFetch({
        url: '/promo-codes',
        config: {
          body: JSON.stringify({ ids: ids }),
          method: 'DELETE',
        },
        withAuth: true,
      }),
    onSuccess,
  });
