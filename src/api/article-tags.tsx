import { ArticleTag } from "../app/types/article-tag";
import { appFetch } from "../app/utils/app-fetch";
import { useMutation } from "@tanstack/react-query";

export const useCreateArticleTag = (onSuccess: any) =>
  useMutation<{ name: string }, Error, Record<string, unknown>>({
    mutationFn: (values) =>
      appFetch({
        url: "/article-tags",
        config: {
          body: JSON.stringify(values),
          method: "POST",
        },
        withAuth: true,
      }),
    onSuccess
  }
  );

export const useDeleteArticleTag = (onSuccess?: () => Promise<any>) =>
  useMutation<{}, Error, string>({
    mutationFn: (tagId) =>
      appFetch({
        url: `/article-tags/${tagId}`,
        config: {
          method: "DELETE",
        },
        withAuth: true,
      }),
    onSuccess
  }
  );

export const useUpdateArticleTag = (
  id: string,
  onSuccess: () => Promise<any>
) =>
  useMutation<{ name: string }, Error, { name: string; slug: string }>({
    mutationFn: (value) =>
      appFetch({
        withAuth: true,
        url: `/article-tags/${id}`,
        config: {
          body: JSON.stringify(value),
          method: "PUT",
        },
      }),
    onSuccess
  }
  );

export const listTags =
  (config: Record<string, any> = {}) =>
    () =>
      appFetch<ArticleTag[]>({
        url: "/article-tags",
        withAuth: true,
        ...config,
      });

export const useDeleteArticleTags = (onSuccess?: () => Promise<any>) =>
  useMutation<{}, Error, string[]>({
    mutationFn: (articleTagIds) =>
      appFetch({
        url: `/article-tags`,
        config: {
          body: JSON.stringify({ ids: articleTagIds }),
          method: "DELETE",
        },
        withAuth: true,
      }),
    onSuccess
  }
  );
