import type { FC } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import { UserLayout } from "@/components/users/user-layout";
import { OrdersTable } from "@/components/orders-table";
import type { ParsedUrlQuery } from "querystring";
import { appFetch } from "@/utils/app-fetch";
import type { Order } from "@/types/orders";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import type { User } from "@/types/user";

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

const getUser =
  (id: string, config: Record<string, any> = {}) =>
    () =>
      appFetch<User>({
        url: `/users/${id}`,
        withAuth: true,
        ...config,
      });

const User: FC = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { query } = useRouter();
  const { error, data } = useQuery({
    queryKey: ["user-orders", query],
    queryFn: getOrders(query)
  });
  const { data: user } = useQuery({
    queryKey: ["users", id],
    queryFn: getUser(id)
  });

  if (!data || !user) return null;

  const { orders, count } = data;
  return (
    <>
      <Head>
        <title>User Orders</title>
      </Head>
      <UserLayout user={user}>
        <OrdersTable showCustomer={false} orders={orders} count={count} />
      </UserLayout>
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
  const { id, ...queryRest } = query as {
    id: string;
    [key: string]: any;
  };

  try {
    await queryClient.fetchQuery({
      queryKey: ["user-orders", query],
      queryFn: getOrders(queryRest, { req, res })
    });
    await queryClient.fetchQuery({
      queryKey: ["users", id],
      queryFn: getUser(id, { req, res })
    });
  } catch (error) {
    console.error(error);
  }
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default User;
