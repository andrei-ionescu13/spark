"use client"

import { useRouter } from "next/navigation";
import Head from "next/head";
import type { GetServerSideProps, NextPage } from "next";
import { dehydrate, HydrationBoundary, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { ParsedUrlQuery } from "querystring";
import ReviewsTable from "@/components/reviews-table";
import { Product } from "@/types/products";
import { Review } from "@/types/review";
import { appFetch } from "@/utils/app-fetch";
import { getProduct, searchProductReviews } from "../../api-calls";
import { ProductLayout } from "../product-layout";
import { useGetProduct, useSearchProductReviews } from "../../api-calls-hooks";

export default function getProductReviews() {
  const { data, isLoading, isError, refetch } = useSearchProductReviews();
  const { reviews, count } = data || {};

  return (
    <>
      <Head>
        <title>Reviews</title>
      </Head>
      <ProductLayout>
        <ReviewsTable
          reviews={reviews}
          count={count}
          isError={isError}
          isLoading={isLoading}
          refetch={refetch}
        />
      </ProductLayout>
    </>
  );
};