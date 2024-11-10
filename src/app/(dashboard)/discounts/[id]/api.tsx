'use client';

import { Discount } from '@/types/discounts';
import { appFetch } from '@/utils/app-fetch';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export const getDiscount =
  (id: string, config: Record<string, any> = {}) =>
  () =>
    appFetch<Discount>({
      url: `/discounts/${id}`,
      withAuth: true,
      ...config,
    });

export const useGetDiscount = () => {
  const { id } = useParams<{ id: string }>();

  return useQuery({
    queryKey: ['product', id],
    queryFn: getDiscount(id),
  });
};

export const useUpdateDiscount = (onSuccess: () => Promise<any>) =>
  useMutation<Discount, Error, { id: string; body: Record<string, any> }>({
    mutationFn: ({ id, body }) =>
      appFetch({
        url: `/discounts/${id}`,
        config: {
          method: 'PUT',
          body: JSON.stringify(body),
        },
        withAuth: true,
      }),
    onSuccess,
  });
