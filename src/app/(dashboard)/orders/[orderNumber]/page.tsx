"use client"

import { OrderLayout } from "@/components/orders/order-layout";
import Head from "next/head";
import { useGetOrder } from "../api-calls-hooks";


export default function Order() {
  const { data: order } = useGetOrder();

  return (
    <>
      <Head>
        <title>Order</title>
      </Head>
      <OrderLayout>
        Data
      </OrderLayout>
    </>
  );
};
