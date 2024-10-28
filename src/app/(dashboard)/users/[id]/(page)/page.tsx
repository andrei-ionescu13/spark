"use client"

import type { FC } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import type { GetServerSideProps } from "next";
import { UserLayout } from "../../../../components/users/user-layout";
import { Grid } from "@mui/material";
import { UserDetails } from "./user-general-details";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { appFetch } from "../../../../utils/app-fetch";
import { User as UserI } from "../../../../types/user";
import { useGetUser } from "../../api-calls-hooks";


export default function User() {
  const { data: user } = useGetUser();

  return (
    <>
      <Head>
        <title>User</title>
      </Head>
      <UserLayout>
        {!!user && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <UserDetails user={user} />
            </Grid>
            {/* <Grid
            item
            xs={12}
            md={5}
          >
            <UserGeneralOrders orders={orders} />
          </Grid> */}
          </Grid>
        )}
      </UserLayout>
    </>
  );
};
