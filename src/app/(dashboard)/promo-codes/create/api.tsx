import { appFetch } from '@/utils/app-fetch';
import { useMutation } from '@tanstack/react-query';

export const useCreatePromoCode = () =>
  useMutation<any, Error, Record<string, any>>({
    mutationFn: (values) =>
      appFetch({
        url: '/promo-codes',
        config: {
          body: JSON.stringify(values),
          method: 'POST',
        },
        withAuth: true,
      }),
  });
