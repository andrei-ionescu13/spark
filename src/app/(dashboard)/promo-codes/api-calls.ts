import { PromoCode } from "@/types/promo-code";
import { appFetch } from "@/utils/app-fetch";

interface searchPromoCodesData {
  promoCodes: PromoCode[];
  count: number;
}

export const searchPromoCodes =
  (query: Record<string, any>, config: Record<string, any> = {}) =>
    () =>
      appFetch<searchPromoCodesData>({
        url: "/promo-codes/search",
        query,
        withAuth: true,
        ...config,
      });

export const getPromoCode =
  (id: string, config: Record<string, any> = {}) =>
    () =>
      appFetch<PromoCode>({
        url: `/promo-codes/${id}`,
        withAuth: true,
        ...config,
      });