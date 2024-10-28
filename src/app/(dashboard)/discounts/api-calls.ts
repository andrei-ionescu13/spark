import { Discount } from "@/types/discounts";
import { appFetch } from "@/utils/app-fetch";

interface SearchDiscountsData {
  discounts: Discount[];
  count: number;
}

export const searchDiscounts =
  (query: Record<string, any>, config: Record<string, any> = {}) =>
    () =>
      appFetch<SearchDiscountsData>({
        url: "/discounts/search",
        query,
        withAuth: true,
        ...config,
      });

export const getDiscount =
  (id: string, config: Record<string, any> = {}) =>
    () =>
      appFetch<Discount>({
        url: `/discounts/${id}`,
        withAuth: true,
        ...config,
      });