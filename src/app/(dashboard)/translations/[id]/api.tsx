import { Namespace } from '@/types/translations';
import { appFetch } from '@/utils/app-fetch';
import { useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'next/navigation';
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
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    if (query[key]) {
      if (typeof query[key] === 'string') {
        query[key] = [query[key], value];
      } else {
        query[key].push(value);
      }
    } else query[key] = value;
  }

  return useQuery({
    queryKey: ['namespace-languages', id, query],
    queryFn: searchNamespaceTranslations(id, query),
  });
};
