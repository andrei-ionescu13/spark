import { ArticleCategory } from "@/types/article-category";
import { Article } from "@/types/articles";
import { appFetch } from "@/utils/app-fetch";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { ParsedUrlQuery } from "querystring";

export const getArticle =
  (id: string, config: Record<string, any> = {}) =>
    () =>
      appFetch<Article>({
        url: `/articles/${id}`,
        withAuth: true,
        ...config,
      });


export const listArticleCategories =
  () =>
    appFetch<ArticleCategory[]>({
      url: "/article-categories",
      withAuth: true,
    });


interface SearchArticlesData {
  articles: Article[];
  count: number;
}

export const searchArticles =
  (query: ParsedUrlQuery) =>
    () =>
      appFetch<SearchArticlesData>({
        url: "/articles",
        query,
        withAuth: true
      });