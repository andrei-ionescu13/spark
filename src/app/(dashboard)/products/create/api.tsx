import { appFetch } from '@/utils/app-fetch';
import { useMutation } from '@tanstack/react-query';

export const useCreateProduct = () =>
  useMutation<{ id: string }, Error, BodyInit>({
    mutationFn: (values) =>
      appFetch({
        url: '/products',
        noContentType: true,
        config: {
          body: values,
          method: 'POST',
        },
        withAuth: true,
      }),
  });
