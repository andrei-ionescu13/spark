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
