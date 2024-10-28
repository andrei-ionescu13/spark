import { Review } from "@/types/review";
import { appFetch } from "@/utils/app-fetch";
import { ParsedUrlQuery } from "querystring";

interface SearchReviewsData {
  reviews: Review[];
  count: number;
}

export const searchReviews =
  (query: ParsedUrlQuery, config: Record<string, any> = {}) =>
    () =>
      appFetch<SearchReviewsData>({
        url: "/reviews",
        query,
        withAuth: true,
        ...config,
      });


export const getReview =
  (id: string, config: Record<string, any> = {}) =>
    () =>
      appFetch<Review>({
        url: `/reviews/${id}`,
        withAuth: true,
        ...config,
      });