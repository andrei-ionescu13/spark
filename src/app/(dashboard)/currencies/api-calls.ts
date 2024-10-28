import { Currency } from "@/types/currencies";
import { appFetch } from "@/utils/app-fetch";

export const searchCurrencies =
  (config: Record<string, any> = {}) =>
    () =>
      appFetch<{ currencies: Currency[]; count: number }>({
        url: "/currencies/search",
        withAuth: true,
        ...config,
      });