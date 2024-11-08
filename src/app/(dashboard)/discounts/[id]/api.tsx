'use client';

import { Discount } from '@/types/discounts';
import { appFetch } from '@/utils/app-fetch';
import { useQuery } from '@tanstack/react-query';
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
