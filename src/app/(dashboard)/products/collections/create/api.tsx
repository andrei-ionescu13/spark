import { appFetch } from '@/utils/app-fetch';
import { useMutation } from '@tanstack/react-query';

export const useCreateCollection = () =>
  useMutation<any, Error, BodyInit>({
    mutationFn: (values) =>
      appFetch({
        url: '/collections',
        noContentType: true,
        config: {
          body: values,
          method: 'POST',
        },
        withAuth: true,
      }),
  });
