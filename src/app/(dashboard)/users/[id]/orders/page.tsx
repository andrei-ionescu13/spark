"use client"

import type { FC } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import type { GetServerSideProps } from "next";
import { UserLayout } from "../../../../components/users/user-layout";
import { OrdersTable } from "../../../../components/orders-table";
import type { ParsedUrlQuery } from "querystring";
import { appFetch } from "../../../../utils/app-fetch";
import type { Order } from "../../../../types/orders";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import type { User as UserOrders } from "../../../../types/user";
import { useSearchUserOrders } from "../../api-calls-hooks";

export default function UserOrders() {
  const { data, refetch, isError, isLoading } = useSearchUserOrders();
  const { orders, count } = data || {};

  return (
    <>
      <Head>
        <title>User Orders</title>
      </Head>
      <UserLayout>
        <OrdersTable
          showCustomer={false}
          orders={orders}
          count={count}
          refetch={refetch}
          isError={isError}
          isLoading={isLoading}
        />
      </UserLayout>
    </>
  );
};