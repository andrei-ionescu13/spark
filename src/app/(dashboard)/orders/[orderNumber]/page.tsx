'use client';

import Head from 'next/head';
import { useGetOrder } from '../api-calls-hooks';
import { OrderLayout } from '../order-layout';

export default function Order() {
  const { data: order } = useGetOrder();

  return (
    <>
      <Head>
        <title>Order</title>
      </Head>
      <OrderLayout>Data</OrderLayout>
    </>
  );
}
