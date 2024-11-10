'use client';

import { PromoCode } from '@/types/promo-code';
import { appFetch } from '@/utils/app-fetch';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export const getPromoCode =
  (id: string, config: Record<string, any> = {}) =>
  () =>
    appFetch<PromoCode>({
      url: `/promo-codes/${id}`,
      withAuth: true,
      ...config,
    });

export const usePromoCode = () => {
  const { id } = useParams<{ id: string }>();

  return useQuery({
    queryKey: ['promo-code', id],
    queryFn: getPromoCode(id),
  });
};

export const useUpdatePromoCode = (onSuccess: () => Promise<any>) =>
  useMutation<PromoCode, Error, { id: string; body: Record<string, any> }>({
    mutationFn: ({ id, body }) =>
      appFetch({
        url: `/promo-codes/${id}`,
        config: {
          method: 'PUT',
          body: JSON.stringify(body),
        },
        withAuth: true,
      }),
    onSuccess,
  });
