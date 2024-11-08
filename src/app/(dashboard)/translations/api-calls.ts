import { Language } from '@/types/translations';
import { appFetch } from '@/utils/app-fetch';
import { useMutation, useQuery } from '@tanstack/react-query';

export const listLanguages =
  (config: Record<string, any> = {}) =>
  () =>
    appFetch<Language[]>({
      url: '/translations/languages',
      withAuth: true,
      ...config,
    });

export const useListNamespaceLanguagesQuery = () =>
  useQuery({
    queryKey: ['namespace-languages'],
    queryFn: listLanguages(),
  });

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

export const useDeleteNamespaceTranslation = () =>
  useMutation<{}, Error, { id: string; translationKey: string }>({
    mutationFn: ({ id, translationKey }) =>
      appFetch({
        url: `/translations/namespaces/${id}/translations/${translationKey}`,
        config: { method: 'DELETE' },
        withAuth: true,
      }),
  });
