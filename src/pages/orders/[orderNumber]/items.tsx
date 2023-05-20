import { appFetch } from "@/utils/app-fetch";
import type { GetServerSideProps } from "next";
import type { ParsedUrlQuery } from "querystring";
import { dehydrate, QueryClient, useQuery } from "react-query";
import type { Order as OrderI } from "@/types/orders";
import { useRouter } from "next/router";
import { OrderLayout } from "@/components/orders/order-layout";
import Head from "next/head";

const getOrder = (orderNumber: string) => () =>
  appFetch<OrderI>({
    url: `/orders/${orderNumber}/items`,
    withAuth: true,
  });

const OrderItems = () => {
  const router = useRouter();
  const orderNumber = router.query.orderNumber as string;
  const { data: order } = useQuery(
    ["order-items", orderNumber],
    getOrder(orderNumber)
  );
  return (
    <>
      <Head>
        <title>Order Items</title>
      </Head>
      <OrderLayout orderNumber={orderNumber}>Items</OrderLayout>
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
  const { orderNumber } = query;

  try {
    await queryClient.fetchQuery(["order-items", orderNumber], () =>
      appFetch<OrderI>({
        withAuth: true,
        url: `/orders/${orderNumber}/items`,
        req,
        res,
      })
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

export default OrderItems;
