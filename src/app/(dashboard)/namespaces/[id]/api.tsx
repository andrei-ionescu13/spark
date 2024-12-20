import { useSearchParamsQuery } from '@/hooks/useSearchParamsQuery';
import { Namespace } from '@/types/translations';
import { appFetch } from '@/utils/app-fetch';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { ParsedUrlQuery } from 'querystring';

const searchNamespaceTranslations =
  (id: string, query: ParsedUrlQuery, config: Record<string, any> = {}) =>
  () =>
    appFetch<Namespace & { count: number }>({
      url: `/translations/namespaces/${id}/translations/search`,
      query,
      withAuth: true,
      ...config,
    });

export const useSearchNamespaceTranslations = () => {
  const { id } = useParams<{ id: string }>();
  const query = useSearchParamsQuery();

  return useQuery({
    queryKey: ['namespace-translations', id, query],
    queryFn: searchNamespaceTranslations(id, query),
  });
};
