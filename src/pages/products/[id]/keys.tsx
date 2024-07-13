import type { FC } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import { SelectChangeEvent } from "@mui/material";
import { useSearch } from "@/hooks/useSearch";
import { ProductLayout } from "@/components/products/product-layout";
import { KeysTable } from "@/components/keys-table";
import { useQueryValue } from "@/hooks/useQueryValue";
import { appFetch } from "@/utils/app-fetch";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import type { Key } from "@/types/keys";
import type { Product } from "@/types/products";

interface SearchProductKeysData {
  keys: Key[];
  count: number;
}

const getProduct =
  (id: string, config: Record<string, any> = {}) =>
    () =>
      appFetch<Product>({ url: `/products/${id}`, withAuth: true, ...config });

const searchProductKeys =
  (id: string, query: Record<string, any>, config: Record<string, any> = {}) =>
    () =>
      appFetch<SearchProductKeysData>({
        url: `/products/${id}/keys`,
        query,
        ...config,
      });

const Keys: FC = () => {
  const { query } = useRouter();
  const { id, ...queryRest } = query as {
    id: string;
    [key: string]: any;
  };

  const [keyword, keywordParam, handleKeywordChange, handleSearch] =
    useSearch();
  const [status, setStatus] = useQueryValue("status", "all", "all");
  const { error, data, isFetching, isRefetching, refetch } = useQuery({
    queryKey: ["product-keys", id, queryRest],
    queryFn: searchProductKeys(id, queryRest)
  }


  );
  const { data: product } = useQuery({
    queryKey: ["product", id],
    queryFn: getProduct(id)
  });

  if (!data || !product) return null;

  const { keys, count } = data;

  const handleStatusChange = (event: SelectChangeEvent<string>): void => {
    setStatus(event.target.value);
  };

  return (
    <>
      <Head>
        <title>Keys</title>
      </Head>
      <ProductLayout product={product}>
        <KeysTable
          keys={keys}
          count={count}
          onStatusChange={handleStatusChange}
          onKeywordChange={handleKeywordChange}
          onSearch={handleSearch}
          keyword={keyword}
          status={status}
          showProductCell={false}
          refetch={refetch}
        />
      </ProductLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
  req,
  res,
}) => {
  const queryClient = new QueryClient();
  const { id, ...queryRest } = query as {
    id: string;
    [key: string]: any;
  };

  try {
    await Promise.all([
      queryClient.fetchQuery({
        queryKey: ["product", id],
        queryFn: getProduct(id, { req, res })
      }),
      queryClient.fetchQuery({
        queryKey: ["product-keys", id, queryRest],
        queryFn: searchProductKeys(id, queryRest, { req, res })
      }


      ),
    ]);
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Keys;
