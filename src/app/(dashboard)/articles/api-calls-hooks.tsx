"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { getArticle, listArticleCategories, searchArticles } from "./api-calls";

export const useGetArticle = () => {
  const { id } = useParams<{ id: string }>();

  return useQuery({
    queryKey: ["articles", id],
    queryFn: getArticle(id),
  });
}

export const useListArticleCategories = () => useQuery({
  queryKey: ["article-categories"],
  queryFn: listArticleCategories
});

export const useSearchArticles = () => {
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ["articles", query],
    queryFn: searchArticles(query)
  });
}