import { Product } from '@/types/products';
import { appFetch } from '@/utils/app-fetch';
import { useMutation } from '@tanstack/react-query';

export const useUpdateProductStatus = (id: string) =>
  useMutation<string, Error, Record<string, any>>({
    mutationFn: (values) =>
      appFetch({
        url: `/products/${id}/status`,
        config: {
          body: JSON.stringify(values),
          method: 'PUT',
        },
        withAuth: true,
      }),
  });

export const useUpdateProductMeta = (id: string) =>
  useMutation<Product, Error, Record<string, any>>({
    mutationFn: (values) =>
      appFetch({
        url: `/products/${id}/meta`,
        config: {
          body: JSON.stringify(values),
          method: 'PUT',
        },
        withAuth: true,
      }),
  });

export const useUpdateProductGeneral = (id: string) =>
  useMutation<Product, Error, Record<string, any>>({
    mutationFn: (values) =>
      appFetch({
        withAuth: true,
        url: `/products/${id}/general`,
        config: {
          body: JSON.stringify(values),
          method: 'PUT',
        },
      }),
  });

export const useUpdateProductMedia = (id: string) =>
  useMutation<Product, Error, BodyInit>({
    mutationFn: (values) =>
      appFetch({
        url: `/products/${id}/media`,
        config: {
          body: values,
          method: 'PUT',
        },
        withAuth: true,
        noContentType: true,
      }),
  });
