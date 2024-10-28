"use client"

import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { getOrder, searchOrders } from "./api-calls";

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

export const useGetOrder = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();

  return useQuery({
    queryKey: ["orders", orderNumber],
    queryFn: getOrder(orderNumber)
  });
}