"use effect";

import { useQuery } from "@tanstack/react-query";
import { listLanguages, searchNamespaces } from "./api-calls";
import { useSearchParams } from "next/navigation";

export const useListLanguagesQuery = () =>
  useQuery({
    queryKey: ["namespace-languages"],
    queryFn: listLanguages()
  });

export const useSearchNamespacesQuery = () => {
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ["namespaces"],
    queryFn: searchNamespaces(query)
  });
}