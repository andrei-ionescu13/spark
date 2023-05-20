import type { FC } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import { UserLayout } from "@/components/users/user-layout";
import { Grid } from "@mui/material";
import { UserGeneralDetails } from "@/components/users/user-general/user-general-details";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { appFetch } from "@/utils/app-fetch";
import { User as UserI } from "@/types/user";

const orders = [
  {
    id: "1",
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    status: "complete",
  },
  {
    id: "2",
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    status: "pending",
  },
  {
    id: "3",
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    status: "rejected",
  },
  {
    id: "4",
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    status: "canceled",
  },
];

const getUser =
  (id: string, config: Record<string, any> = {}) =>
  () =>
    appFetch<UserI>({
      url: `/users/${id}`,
      withAuth: true,
      ...config,
    });

const User: FC = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data: user } = useQuery(["users", id], getUser(id));

  if (!user) return null;

  return (
    <>
      <Head>
        <title>User</title>
      </Head>
      <UserLayout user={user}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={7}>
            <UserGeneralDetails user={user} />
          </Grid>
          {/* <Grid
            item
            xs={12}
            md={5}
          >
            <UserGeneralOrders orders={orders} />
          </Grid> */}
        </Grid>
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
  const { id } = query as { id: string };
  const queryClient = new QueryClient();

  try {
    await queryClient.fetchQuery(["users", id], getUser(id, { req, res }));
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
