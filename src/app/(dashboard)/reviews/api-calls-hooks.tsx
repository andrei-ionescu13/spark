"use client"

import { useParams, useSearchParams } from "next/navigation";
import { getReview, searchReviews } from "./api-calls";
import { useQuery } from "@tanstack/react-query";

export const useSearchReviews = () => {
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ["reviews", query],
    queryFn: searchReviews(query)
  });
}

export const useGetReview = () => {
  const { id } = useParams<{ id: string }>();

  return useQuery({
    queryKey: ["product", id],
    queryFn: getReview(id)
  });
}