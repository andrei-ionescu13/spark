import { Discount } from '@/types/discounts';
import { appFetch } from '@/utils/app-fetch';
import { useMutation } from '@tanstack/react-query';

export const useCreateDiscount = (onSuccess?: () => Promise<any>) =>
  useMutation<Discount, Error, Record<string, any>>({
    mutationFn: (values) =>
      appFetch({
        url: '/discounts',
        config: {
          body: JSON.stringify(values),
          method: 'POST',
        },
        withAuth: true,
      }),
    onSuccess,
  });

export const useDeleteDiscount = (onSuccess?: () => Promise<any>) =>
  useMutation<Discount, Error, string>({
    mutationFn: (id) =>
      appFetch({
        url: `/discounts/${id}`,
        config: { method: 'DELETE' },
        withAuth: true,
      }),
    onSuccess,
  });

export const useDeactivateDiscount = (onSuccess?: () => Promise<any>) =>
  useMutation<Discount, Error, string>({
    mutationFn: (id) =>
      appFetch({
        url: `/discounts/${id}/deactivate`,
        config: { method: 'PUT' },
        withAuth: true,
      }),
    onSuccess,
  });

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
