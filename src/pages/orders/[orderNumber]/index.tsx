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
    url: `/orders/${orderNumber}`,
    withAuth: true,
  });

const Order = () => {
  const router = useRouter();
  const orderNumber = router.query.orderNumber as string;
  const { data: order } = useQuery(
    ["orders", orderNumber],
    getOrder(orderNumber)
  );
  return (
    <>
      <Head>
        <title>Order</title>
      </Head>
      {/* <OrderLayout orderNumber={orderNumber}></OrderLayout> */}
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
    await queryClient.fetchQuery(["orders", orderNumber], () =>
      appFetch<OrderI>({
        withAuth: true,
        url: `/orders/${orderNumber}`,
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

export default Order;
