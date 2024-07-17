import { useRouter } from "next/navigation";
import Head from "next/head";
import type { GetServerSideProps, NextPage } from "next";
import { dehydrate, HydrationBoundary, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { ParsedUrlQuery } from "querystring";
import { ProductLayout } from "@/components/products/product-layout";
import ReviewsTable from "@/components/reviews-table";
import { Product } from "@/types/products";
import { Review } from "@/types/review";
import { appFetch } from "@/utils/app-fetch";
import { getProduct, searchProductReviews } from "../../api-calls";
import { ProductReviewsTable } from "./product-reviews-table";

export default function getProductReviews({ params, searchParams }) {
  const queryClient = new QueryClient()
  const query: any = {};

  for (const [key, value] of Object.entries(searchParams)) {
    query[key] = value;
  }
  const { id } = params;
  queryClient.prefetchQuery({
    queryKey: ["product-reviews", id, query],
    queryFn: searchProductReviews(id, query)
  });
  queryClient.prefetchQuery({
    queryKey: ["product", id],
    queryFn: getProduct(id)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Head>
        <title>Reviews</title>
      </Head>
      <ProductLayout>
        <ProductReviewsTable />
      </ProductLayout>
    </HydrationBoundary>
  );
};