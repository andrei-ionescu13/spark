"use client"

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { searchOrders } from "./api-calls";

export const useSearchOrders = () => {
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ["orders", query],
    queryFn: searchOrders(query)
  });
}