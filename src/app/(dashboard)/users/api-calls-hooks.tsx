"use client"

import { useParams, useSearchParams } from "next/navigation";
import { getUser, searchUserOrders, searchUserReviews, searchUsers } from "./api-calls";
import { useQuery } from "@tanstack/react-query";

export const useSearchUsers = () => {
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ["users", query],
    queryFn: searchUsers(query)
  });
}

export const useGetUser = () => {
  const { id } = useParams<{ id: string }>();

  return useQuery({
    queryKey: ["users", id],
    queryFn: getUser(id)
  });
}

export const useSearchUserOrders = () => {
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ["user-orders", query],
    queryFn: searchUserOrders(query)
  });
}

export const useSearchUserReviews = () => {
  const query: any = {};
  const searchParams = useSearchParams();
  const { id } = useParams<{ id: string }>();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ["user-reviews", query],
    queryFn: searchUserReviews(id, query)
  });
}