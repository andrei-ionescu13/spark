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
import { searchOrders } from "./api-calls";
import { OrdersTable } from "./orders-table";

interface GetOrdersData {
  orders: Order[];
  count: number;
}

export default async function Orders({ searchParams }: { searchParams: Record<string, string> }) {
  const queryClient = new QueryClient()
  const query: any = {};
  for (const [key, value] of Object.entries(searchParams)) {
    query[key] = value;
  }

  await queryClient.prefetchQuery({
    queryKey: ["orders", query],
    queryFn: searchOrders(query)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Head>
        <title>Orders</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader title="Orders" />
          <OrdersTable />
        </Container>
      </Box>
    </HydrationBoundary>
  );
};
