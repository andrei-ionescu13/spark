import { Language, Namespace } from "@/types/translations";
import { appFetch } from "@/utils/app-fetch";
import { ParsedUrlQuery } from "querystring";

interface GetNamespacesData {
  namespaces: Namespace[];
  count: number;
}

export const listLanguages =
  (config: Record<string, any> = {}) =>
    () =>
      appFetch<Language[]>({
        url: "/translations/languages",
        withAuth: true,
        ...config,
      });

export const searchNamespaces =
  (query: ParsedUrlQuery, config: Record<string, any> = {}) =>
    () =>
      appFetch<GetNamespacesData>({
        url: "/translations/namespaces/search",
        query,
        ...config,
      });
