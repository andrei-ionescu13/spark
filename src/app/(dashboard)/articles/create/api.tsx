import { appFetch } from '@/utils/app-fetch';
import { useMutation } from '@tanstack/react-query';

export const useCreateArticle = () =>
  useMutation<{ id: string }, Error, BodyInit>({
    mutationFn: (values) =>
      appFetch({
        url: '/articles',
        config: {
          body: values,
          method: 'POST',
        },
        noContentType: true,
        withAuth: true,
      }),
  });
