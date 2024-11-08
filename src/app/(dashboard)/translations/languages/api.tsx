import { appFetch } from '@/utils/app-fetch';
import { useMutation } from '@tanstack/react-query';

export const useCreateTranslationsLanguage = (onSuccess?: () => Promise<any>) =>
  useMutation<{}, Error, Record<string, unknown>>({
    mutationFn: (values) =>
      appFetch({
        url: '/translations/languages',
        config: {
          body: JSON.stringify(values),
          method: 'POST',
        },
        withAuth: true,
      }),
    onSuccess,
  });

export const useDeleteLanguage = (onSuccess?: () => Promise<any>) =>
  useMutation<{}, Error, { id: string; shouldDeleteTranslations: boolean }>({
    mutationFn: ({ id, shouldDeleteTranslations }) =>
      appFetch({
        url: `/translations/languages/${id}`,
        config: {
          body: JSON.stringify({ shouldDeleteTranslations }),
          method: 'DELETE',
        },
        withAuth: true,
      }),
    onSuccess,
  });
