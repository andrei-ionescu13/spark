import { PromoCode } from '@/types/promo-code';
import { appFetch } from '@/utils/app-fetch';
import { useMutation } from '@tanstack/react-query';

export const useDeletePromoCode = (onSuccess?: () => Promise<any>) =>
  useMutation<PromoCode, Error, string>({
    mutationFn: (id) =>
      appFetch({
        url: `/promo-codes/${id}`,
        config: { method: 'DELETE' },
        withAuth: true,
      }),
    onSuccess,
  });

export const useDeactivatePromoCode = (onSuccess: () => Promise<any>) =>
  useMutation<PromoCode, Error, string>({
    mutationFn: (id) =>
      appFetch({
        url: `/promo-codes/${id}/deactivate`,
        config: { method: 'PUT' },
        withAuth: true,
      }),
    onSuccess,
  });
