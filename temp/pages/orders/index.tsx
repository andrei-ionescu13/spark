import type { FC } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import type { GetServerSideProps } from "next";
import { Box, Container } from "@mui/material";
import { PageHeader } from "../../../src/app/components/page-header";
import { OrdersTable } from "../../../src/app/components/orders-table";
import type { ParsedUrlQuery } from "querystring";
import { appFetch } from "../../../src/app/utils/app-fetch";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import type { Order } from "../../../src/app/types/orders";

interface GetOrdersData {
  orders: Order[];
  count: number;
}

const getOrders =
  (query: ParsedUrlQuery, config: Record<string, any> = {}) =>
    () =>
      appFetch<GetOrdersData>({
        url: "/orders/search",
        query,
        withAuth: true,
        ...config,
      });

const Orders: FC = () => {
  const { query } = useRouter();
  const { error, data } = useQuery({
    queryKey: ["orders", query],
    queryFn: getOrders(query)
  });

  if (!data) return null;

  const { orders, count } = data;

  return (
    <>
      <Head>
        <title>Orders</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader title="Orders" />
          <OrdersTable orders={orders} count={count} />
        </Container>
      </Box>
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

  try {
    await queryClient.fetchQuery({
      queryKey: ["orders", query],
      queryFn: getOrders(query, { req, res })
    }


    );
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Orders;
