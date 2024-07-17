import type { FC } from "react";
import Head from "next/head";
import { getProduct, searchProductKeys } from "../../api-calls";
import { dehydrate, HydrationBoundary, QueryClient, useQuery } from "@tanstack/react-query";
import { ProductLayout } from "@/components/products/product-layout";
import { ProductKeysTable } from "./product-keys-table";

export default async function ProductKeys({ params, searchParams }) {
  const queryClient = new QueryClient()
  const query: any = {};

  for (const [key, value] of Object.entries(searchParams)) {
    query[key] = value;
  }
  const { id } = params;

  await queryClient.prefetchQuery({
    queryKey: ["product-keys", id, query],
    queryFn: searchProductKeys(id, query)
  });
  await queryClient.prefetchQuery({
    queryKey: ["product", id],
    queryFn: getProduct(id)
  });


  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Head>
        <title>Keys</title>
      </Head>
      <ProductLayout>
        <ProductKeysTable />
      </ProductLayout>
    </HydrationBoundary>
  );
};
