"use client"

import type { FC } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import type { GetServerSideProps } from "next";
import { Box, Container } from "@mui/material";
import type { ParsedUrlQuery } from "querystring";
import { dehydrate, HydrationBoundary, QueryClient, useQuery } from "@tanstack/react-query";
import { Order } from "@/types/orders";
import { appFetch } from "@/utils/app-fetch";
import { PageHeader } from "@/components/page-header";
import { searchOrders } from "../api-calls";
import { OrdersTable } from "../../../components/orders-table";
import { useSearchOrders } from "../api-calls-hooks";

export default function Orders() {
  const { data, refetch, isError, isLoading } = useSearchOrders();
  const { orders, count } = data || {};

  return (
    <>
      <Head>
        <title>Orders</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader title="Orders" />
          <OrdersTable
            orders={orders}
            count={count}
            refetch={refetch}
            isError={isError}
            isLoading={isLoading}
          />
        </Container>
      </Box>
    </>
  );
};
