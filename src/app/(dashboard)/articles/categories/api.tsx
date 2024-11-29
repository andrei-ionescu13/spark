import { useSearchParamsQuery } from '@/hooks/useSearchParamsQuery';
import { ArticleCategory } from '@/types/article-category';
import { appFetch } from '@/utils/app-fetch';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ParsedUrlQuery } from 'querystring';

interface SearchArticleCategoriesData {
  categories: ArticleCategory[];
  count: number;
}

export const searchArticleCategories =
  (query: ParsedUrlQuery, config: Record<string, any> = {}) =>
  () =>
    appFetch<SearchArticleCategoriesData>({
      url: '/article-categories/search',
      query,
      withAuth: true,
      ...config,
    });

export const useSearchArticleCategories = () => {
  const query = useSearchParamsQuery();

  return useQuery({
    queryKey: ['article-categories', query],
    queryFn: searchArticleCategories(query),
  });
};

export const useCreateArticleCategory = (onSuccess: any) =>
  useMutation<{ name: string }, Error, Record<string, unknown>>({
    mutationFn: (values) =>
      appFetch({
        url: '/article-categories',
        config: {
          body: JSON.stringify(values),
          method: 'POST',
        },
        withAuth: true,
      }),
    onSuccess,
  });

export const useUpdateArticleCategory = (
  articleCategoryId: string,
  onSuccess: any
) =>
  useMutation<ArticleCategory, Error, Record<string, unknown>>({
    mutationFn: (values) =>
      appFetch({
        url: `/article-categories/${articleCategoryId}`,
        config: {
          body: JSON.stringify(values),
          method: 'PUT',
        },
        withAuth: true,
      }),
    onSuccess,
  });

export const useDeleteCategories = (onSuccess?: () => Promise<any>) =>
  useMutation<{}, Error, string[]>({
    mutationFn: (categoryIds) =>
      appFetch({
        url: `/article-categories`,
        config: {
          body: JSON.stringify({ ids: categoryIds }),
          method: 'DELETE',
        },
        withAuth: true,
      }),
    onSuccess,
  });

export const useDeleteArticleCategory = (onSuccess?: () => Promise<any>) =>
  useMutation<{}, Error, string>({
    mutationFn: (categoryId) =>
      appFetch({
        url: `/article-categories/${categoryId}`,
        config: {
          method: 'DELETE',
        },
        withAuth: true,
      }),
    onSuccess,
  });
