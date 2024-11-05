'use client';

import { Grid } from '@mui/material';
import Head from 'next/head';
import { useGetUser } from '../../api-calls-hooks';
import { UserDetails } from './user-general-details';

export default function User() {
  const { data: user } = useGetUser();

  return (
    <>
      <Head>
        <title>User</title>
      </Head>
      {!!user && (
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            xs={12}
            md={7}
          >
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
    </>
  );
}
