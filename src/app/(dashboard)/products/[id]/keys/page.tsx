"use client"

import type { FC } from "react";
import Head from "next/head";
import { getProduct, searchProductKeys } from "../../api-calls";
import { dehydrate, HydrationBoundary, QueryClient, useQuery } from "@tanstack/react-query";
import { ProductLayout } from "../product-layout";
import { useGetProduct, useSearchProductKeys } from "../../api-calls-hooks";
import { KeysTable } from "@/components/keys-table";

export default function ProductKeys() {
  const { data, refetch, isError, isLoading } = useSearchProductKeys();
  const { keys, count } = data || {};

  return (
    <>
      <Head>
        <title>Keys</title>
      </Head>
      <ProductLayout>
        <KeysTable
          keys={keys}
          count={count}
          isError={isError}
          isLoading={isLoading}
          refetch={refetch}
        />
      </ProductLayout>
    </>
  );
};
