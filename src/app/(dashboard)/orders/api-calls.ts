import { Order } from "@/types/orders";
import { appFetch } from "@/utils/app-fetch";
import { ParsedUrlQuery } from "querystring";

interface SearchOrdersData {
  orders: Order[];
  count: number;
}

export const searchOrders =
  (query: ParsedUrlQuery) =>
    () =>
      appFetch<SearchOrdersData>({
        url: "/orders/search",
        query,
        withAuth: true,
      });


export const getOrder = (orderNumber: string) => () =>
  appFetch<Order>({
    url: `/orders/${orderNumber}`,
    withAuth: true,
  });