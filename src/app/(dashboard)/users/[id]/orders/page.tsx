'use client';

import Head from 'next/head';
import { OrdersTable } from '../../../../components/orders-table';
import { useSearchUserOrders } from './api';

export default function UserOrders() {
  const { data, refetch, isError, isLoading } = useSearchUserOrders();
  const { orders, count } = data || {};

  return (
    <>
      <Head>
        <title>User Orders</title>
      </Head>
      <OrdersTable
        showCustomer={false}
        orders={orders}
        count={count}
        refetch={refetch}
        isError={isError}
        isLoading={isLoading}
      />
    </>
  );
}
