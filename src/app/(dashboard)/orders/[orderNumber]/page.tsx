'use client';

import Head from 'next/head';
import { OrderLayout } from '../order-layout';
import { useGetOrder } from './api';

export default function Order() {
  const { data: order } = useGetOrder();

  return (
    <>
      <Head>
        <title>Order</title>
      </Head>
      <OrderLayout>To be continued</OrderLayout>
    </>
  );
}
