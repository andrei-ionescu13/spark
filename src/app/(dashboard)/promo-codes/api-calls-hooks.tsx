"use client"

import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { getPromoCode, searchPromoCodes } from "./api-calls";

export const useSearchPromoCodes = () => {
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ["promo-codes", query],
    queryFn: searchPromoCodes(query)
  });
}


export const usePromoCode = () => {
  const { id } = useParams<{ id: string }>();

  return useQuery({
    queryKey: ["promo-code", id],
    queryFn: getPromoCode(id)
  });
}