"use client"

import Head from "next/head";
import {
  Box,
  Container,
} from "@mui/material";
import { PageHeader } from "@/components/page-header";
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Plus } from "@/icons/plus";
import { ProductsTable } from "./products-table";
import { searchProducts } from "../api-calls";
import { useSearchProducts } from "../api-calls-hooks";

export default function Products() {
  const { data, refetch, isError, isLoading } = useSearchProducts();
  const { products, count } = data || {};

  return (
    <>
      <Head>
        <title>Products</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title="Products"
            action={{
              href: "/products/create",
              label: "Add",
              icon: Plus,
            }}
          />
          <ProductsTable
            products={products}
            count={count}
            isError={isError}
            isLoading={isLoading}
            refetch={refetch}
          />
        </Container>
      </Box>
    </>
  );
};
