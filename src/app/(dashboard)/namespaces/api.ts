import { appFetch } from '@/utils/app-fetch';
import { useMutation } from '@tanstack/react-query';

export const useDeleteNamespace = (onSuccess?: () => Promise<any>) =>
  useMutation<{}, Error, string>({
    mutationFn: (id) =>
      appFetch({
        url: `/translations/namespaces/${id}`,
        config: { method: 'DELETE' },
        withAuth: true,
      }),
    onSuccess,
  });

export const useDeleteNamespaceTranslation = (onSuccess?: () => Promise<any>) =>
  useMutation<{}, Error, { id: string; translationKey: string }>({
    mutationFn: ({ id, translationKey }) =>
      appFetch({
        url: `/translations/namespaces/${id}/translations/${translationKey}`,
        config: { method: 'DELETE' },
        withAuth: true,
      }),
    onSuccess,
  });
