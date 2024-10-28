import { Order } from "@/types/orders";
import { Review } from "@/types/review";
import { User } from "@/types/user";
import { appFetch } from "@/utils/app-fetch";
import { ParsedUrlQuery } from "querystring";

interface SearchUsersData {
  users: User[];
  count: number;
}

interface SearchUserOrdersData {
  orders: Order[];
  count: number;
}

export const searchUsers =
  (query: Record<string, any>, config: Record<string, any> = {}) =>
    () =>
      appFetch<SearchUsersData>({
        url: "/users/search",
        query,
        withAuth: true,
        ...config,
      });

export const getUser =
  (id: string, config: Record<string, any> = {}) =>
    () =>
      appFetch<User>({
        url: `/users/${id}`,
        withAuth: true,
        ...config,
      });

//change hooks
//use /user/id/orders/search as url
export const searchUserOrders =
  (query: ParsedUrlQuery, config: Record<string, any> = {}) =>
    () =>
      appFetch<SearchUserOrdersData>({
        url: "/orders/search",
        query,
        withAuth: true,
        ...config,
      });

interface SearchUserReviewsData {
  reviews: Review[];
  count: number;
}

export const searchUserReviews =
  (id: string, query: ParsedUrlQuery, config: Record<string, any> = {}) =>
    () =>
      appFetch<SearchUserReviewsData>({
        url: `/users/${id}/reviews`,
        query,
        withAuth: true,
        ...config,
      });