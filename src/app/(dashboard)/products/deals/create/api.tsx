import { appFetch } from '@/utils/app-fetch';
import { useMutation } from '@tanstack/react-query';

export const useCreateDeal = () =>
  useMutation<any, Error, BodyInit>({
    mutationFn: (values) =>
      appFetch({
        url: '/deals',
        noContentType: true,
        config: {
          body: values,
          method: 'POST',
        },
        withAuth: true,
      }),
  });
