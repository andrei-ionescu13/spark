import { ArticleCategory } from "@/types/article-category";
import { appFetch } from "@/utils/app-fetch";
import { useMutation } from "@tanstack/react-query";

export const useDeleteCategories = (onSuccess?: () => Promise<any>) =>
  useMutation<{}, Error, string[]>({
    mutationFn:
      (categoryIds) =>
        appFetch({
          url: `/article-categories`,
          config: {
            body: JSON.stringify({ ids: categoryIds }),
            method: "DELETE",
          },
          withAuth: true,
        }),
    onSuccess
  });

export const useDeleteArticleCategory = (onSuccess?: () => Promise<any>) =>
  useMutation<{}, Error, string>({
    mutationFn: (categoryId) =>
      appFetch({
        url: `/article-categories/${categoryId}`,
        config: {
          method: "DELETE",
        },
        withAuth: true,
      }),
    onSuccess
  }
  );

export const useCreateArticleCategory = (onSuccess: any) =>
  useMutation<{ name: string }, Error, Record<string, unknown>>({
    mutationFn: (values) =>
      appFetch({
        url: "/article-categories",
        config: {
          body: JSON.stringify(values),
          method: "POST",
        },
        withAuth: true,
      }),
    onSuccess
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
          method: "PUT",
        },
        withAuth: true,
      }),
    onSuccess
  }
  );

export const listArticleCategories =
  (config: Record<string, any> = {}) =>
    () =>
      appFetch<ArticleCategory[]>({
        url: "/article-categories",
        withAuth: true,
        ...config,
      });
