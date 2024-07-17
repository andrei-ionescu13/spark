"use client"

import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { getCollection, getProduct, searchCollections, searchDevelopers, searchFeatures, searchGenres, searchKeys, searchOperatingSystems, searchPlatforms, searchProductKeys, searchProductReviews, searchProducts, searchPublishers } from "./api-calls";

export const useSearchProducts = () => {
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ["products", query],
    queryFn: searchProducts(query)
  });
}

export const useGetProduct = () => {
  const { id } = useParams<{ id: string }>();

  return useQuery({
    queryKey: ["product", id],
    queryFn: getProduct(id)
  });
}

export const useSearchProductKeys = () => {
  const query: any = {};
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ["product-keys", id, query],
    queryFn: searchProductKeys(id, query)
  });
}


export const useSearchProductReviews = () => {
  const query: any = {};
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ["product-reviews", id, query],
    queryFn: searchProductReviews(id, query)
  });
}

export const useSearchCollectionsQuery = () => {
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ["collections", query],
    queryFn: searchCollections(query)
  });
}

export const useGetCollectionQuery = () => {
  const { id } = useParams<{ id: string }>();

  return useQuery({
    queryKey: ["collection", id],
    queryFn: getCollection(id),
    enabled: !!id
  });
}

export const useSearchPlatformsQuery = () => {
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ["platforms", query],
    queryFn: searchPlatforms(query)
  });
}

export const useSearchKeysQuery = () => {
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ["keys", query],
    queryFn: searchKeys(query)
  });
}

export const useSearchPublishersQuery = () => {
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ["publishers", query],
    queryFn: searchPublishers(query)
  });
}

export const useSearchGenresQuery = () => {
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ["genres", query],
    queryFn: searchGenres(query)
  });
}

export const useSearchDevelopersQuery = () => {
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ["developers", query],
    queryFn: searchDevelopers(query)
  });
}

export const useSearchFeaturesQuery = () => {
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ["features", query],
    queryFn: searchFeatures(query)
  });
}

export const useSearchOperatingSystemsQuery = () => {
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ["operatingSystems", query],
    queryFn: searchOperatingSystems(query)
  });
}