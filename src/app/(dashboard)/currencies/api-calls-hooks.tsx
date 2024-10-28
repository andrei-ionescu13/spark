"use client"

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { searchCurrencies } from "./api-calls";

export const useSearchCurrencies = () => {
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ["currencies"],
    queryFn: searchCurrencies(query)
  });
}