import { Discount } from '@/types/discounts';
import { appFetch } from '@/utils/app-fetch';
import { useMutation } from '@tanstack/react-query';

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
