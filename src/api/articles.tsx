import { useMutation } from "react-query";
import { appFetch } from "@/utils/app-fetch";
import type { ArticleGeneral, ArticleMeta, ArticleStatus, ArticleCategory } from "@/types/articles";

export const useDeleteArticle = (onSuccess?: () => Promise<any>) => useMutation<{}, Error, string>((articleId) => appFetch({
  url: `/articles/${articleId}`,
  config: {
    method: 'DELETE'
  },
  withAuth: true
}), { onSuccess })

export const useDeleteArticles = (onSuccess?: () => Promise<any>) => useMutation<{}, Error, string[]>((articleIds) => appFetch({
  url: `/articles`,
  config: {
    body: JSON.stringify({ ids: articleIds }),
    method: 'DELETE'
  },
  withAuth: true
}), { onSuccess })

export const useCreateArticle = () => useMutation<{ id: string }, Error, BodyInit>((values) => appFetch({
  url: '/articles',
  config: {
    body: values,
    method: 'POST'
  },
  noContentType: true,
  withAuth: true
}))

export const useUpdateArticle = (id: string) => useMutation((values: BodyInit) => appFetch({
  url: `/articles/${id}`,
  config: {
    body: values,
    method: 'PUT'
  },
  noContentType: true,
  withAuth: true
}))

interface UpdateArticleMetaData extends ArticleMeta {
  updatedAt: string;
}

export const useUpdateArticleMeta = (id: string) => useMutation<UpdateArticleMetaData, Error, Record<string, any>>((values) => appFetch({
  url: `/articles/${id}/meta`,
  config: {
    body: JSON.stringify(values),
    method: 'PUT'
  },
  withAuth: true
}))

interface UpdateArticleGeneral extends ArticleGeneral {
  updatedAt: string;
}

export const useUpdateArticleGeneral = (id: string) => useMutation<UpdateArticleGeneral, Error, BodyInit>((values) => appFetch({
  url: `/articles/${id}/details`,
  config: {
    body: values,
    method: 'PUT'
  },
  noContentType: true,
  withAuth: true
}))

export const useDuplicateArticle = (onSuccess?: () => Promise<any>) => useMutation<{ id: string }, Error, string>((articleId) => appFetch({
  url: `/articles/duplicate/${articleId}`,
  config: {
    method: 'POST'
  },
  withAuth: true
}), { onSuccess })

export const useUpdateArticleStatus = (id: string) => useMutation<{ status: ArticleStatus }, Error, Record<string, any>>((values) => appFetch({
  url: `/articles/${id}/status`,
  config: {
    body: JSON.stringify(values),
    method: 'PUT'
  },
  withAuth: true
}))

export const useUpdateArticleCategory = (id: string) => useMutation<{ category: ArticleCategory }, Error, Record<string, any>>((values) => appFetch({
  url: `/articles/${id}/category`,
  config: {
    body: JSON.stringify(values),
    method: 'PUT'
  },
  withAuth: true
}))