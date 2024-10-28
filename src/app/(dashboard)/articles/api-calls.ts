import { ArticleCategory } from '@/types/article-category';
import { ArticleTag } from '@/types/article-tag';
import { Article } from '@/types/articles';
import { appFetch } from '@/utils/app-fetch';
import { ParsedUrlQuery } from 'querystring';

export const getArticle =
  (id: string, config: Record<string, any> = {}) =>
  () =>
    appFetch<Article>({
      url: `/articles/${id}`,
      withAuth: true,
      ...config,
    });

export const listArticleCategories = () =>
  appFetch<ArticleCategory[]>({
    url: '/article-categories',
    withAuth: true,
  });

interface SearchArticlesData {
  articles: Article[];
  count: number;
}

export const searchArticles = (query: ParsedUrlQuery) => () =>
  appFetch<SearchArticlesData>({
    url: '/articles',
    query,
    withAuth: true,
  });

interface SearchArticleTagsData {
  tags: ArticleTag[];
  count: number;
}

export const searchArticleTags = (query: ParsedUrlQuery) => () =>
  appFetch<SearchArticleTagsData>({
    url: '/article-tags/search',
    query,
    withAuth: true,
  });

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
