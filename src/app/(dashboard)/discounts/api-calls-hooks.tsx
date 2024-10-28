"use client"

import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { getDiscount, searchDiscounts } from "./api-calls";

export const useSearchDiscounts = () => {
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ["discounts", query],
    queryFn: searchDiscounts(query)
  });
}

export const useGetDiscount = () => {
  const { id } = useParams<{ id: string }>();

  return useQuery({
    queryKey: ["product", id],
    queryFn: getDiscount(id)
  });
}