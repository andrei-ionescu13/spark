'use client';

import { Product } from '@/types/products';
import { appFetch } from '@/utils/app-fetch';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export const getProduct = (id: string) => () =>
  appFetch<Product>({ url: `/products/${id}`, withAuth: true });

export const useGetProduct = () => {
  const { id } = useParams<{ id: string }>();

  return useQuery({
    queryKey: ['product', id],
    queryFn: getProduct(id),
  });
};
