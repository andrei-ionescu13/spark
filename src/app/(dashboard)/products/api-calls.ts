import { Collection } from "@/types/collection";
import { Developer } from "@/types/developer";
import { Feature } from "@/types/feature";
import { Genre } from "@/types/genres";
import { Key } from "@/types/keys";
import { OperatingSystem } from "@/types/operating-sistem";
import { Platform } from "@/types/platforms";
import { Product } from "@/types/products";
import { Publisher } from "@/types/publishers";
import { Review } from "@/types/review";
import { Language } from "@/types/translations";
import { appFetch } from "@/utils/app-fetch";

interface SearchProductsData {
  products: Product[];
  count: number;
}

interface SearchProductKeysData {
  keys: Key[];
  count: number;
}

interface SearchUserReviews {
  reviews: Review[];
  count: number;
}

interface GetCollectionsData {
  collections: any[];
  count: number;
}

interface SearchPlatformsData {
  platforms: Platform[];
  count: number;
}

interface GetKeysData {
  keys: Key[];
  count: number;
}

interface GetPublishers {
  publishers: Publisher[];
  count: number;
}

interface GetGenresData {
  genres: Genre[];
  count: number;
}

interface GetDeveloperData {
  developers: Developer[];
  count: number;
}

interface GetFeatureData {
  features: Feature[];
  count: number;
}

interface GetOperatingSystemData {
  operatingSystems: OperatingSystem[];
  count: number;
}

export const searchProducts = (query: Record<string, any>) => () =>
  appFetch<SearchProductsData>({
    url: "/products",
    query,
    withAuth: true
  });

export const getProduct =
  (id: string) =>
    () =>
      appFetch<Product>({ url: `/products/${id}`, withAuth: true });

export const searchProductKeys =
  (id: string, query: Record<string, any>) =>
    () =>
      appFetch<SearchProductKeysData>({
        url: `/products/${id}/keys`,
        query,
      });

export const searchProductReviews =
  (id: string, query: Record<string, any>) =>
    () =>
      appFetch<SearchUserReviews>({
        url: `/products/${id}/reviews`,
        query,
        withAuth: true,
      });

export const searchCollections =
  (query: Record<string, any>) =>
    () =>
      appFetch<GetCollectionsData>({
        url: "/collections/search",
        query,
        withAuth: true,
      });

export const getCollection =
  (id: string) =>
    () =>
      appFetch<Collection>({
        url: `/collections/${id}`,
        withAuth: true,
      });

export const searchPlatforms =
  (query: Record<string, any>) =>
    () =>
      appFetch<SearchPlatformsData>({
        url: "/platforms/search",
        query,
        withAuth: true
      });


export const searchKeys =
  (query: Record<string, any>) =>
    () =>
      appFetch<GetKeysData>({
        url: "/keys",
        query,
        withAuth: true,
      });



export const searchPublishers =
  (query: Record<string, any>) =>
    () =>
      appFetch<GetPublishers>({
        url: "/publishers/search",
        query,
        withAuth: true,
      });

export const searchGenres =
  (query: Record<string, any>) =>
    () =>
      appFetch<GetGenresData>({
        url: "/genres/search",
        query,
        withAuth: true,
      });

export const searchDevelopers =
  (query: Record<string, any>) =>
    () =>
      appFetch<GetDeveloperData>({
        url: "/developers/search",
        query,
        withAuth: true,
      });

export const searchFeatures =
  (query: Record<string, any> = {}) =>
    () =>
      appFetch<GetFeatureData>({
        url: "/features/search",
        query,
        withAuth: true,
      });

export const searchOperatingSystems =
  (query: Record<string, any> = {}) =>
    () =>
      appFetch<GetOperatingSystemData>({
        url: "/operating-systems/search",
        query,
        withAuth: true,
      });