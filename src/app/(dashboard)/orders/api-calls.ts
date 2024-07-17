import { Order } from "@/types/orders";
import { appFetch } from "@/utils/app-fetch";
import { ParsedUrlQuery } from "querystring";

interface GetOrdersData {
  orders: Order[];
  count: number;
}

export const searchOrders =
  (query: ParsedUrlQuery) =>
    () =>
      appFetch<GetOrdersData>({
        url: "/orders/search",
        query,
        withAuth: true,
      });