import { Article } from '@/types/articles';
import { appFetch } from '@/utils/app-fetch';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { ParsedUrlQuery } from 'querystring';

interface SearchArticlesData {
  articles: Article[];
  count: number;
}

export const searchArticles = (query: ParsedUrlQuery) =>
  appFetch<SearchArticlesData>({
    url: '/articles',
    query,
    withAuth: true,
  });

export const useSearchArticles = () => {
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ['articles', query],
    queryFn: () => searchArticles(query),
  });
};

export const useDeleteArticles = (onSuccess?: () => Promise<any>) =>
  useMutation<{}, Error, string[]>({
    mutationFn: (articleIds) =>
      appFetch({
        url: `/articles`,
        config: {
          body: JSON.stringify({ ids: articleIds }),
          method: 'DELETE',
        },
        withAuth: true,
      }),
    onSuccess,
  });

export const useDuplicateArticle = (
  id: string,
  onSuccess?: () => Promise<any>
) =>
  useMutation<{ id: string }, Error, { title: string; slug: string }>({
    mutationFn: (values) =>
      appFetch({
        url: `/articles/duplicate/${id}`,
        config: {
          body: JSON.stringify(values),
          method: 'POST',
        },
        withAuth: true,
      }),
    onSuccess,
  });
