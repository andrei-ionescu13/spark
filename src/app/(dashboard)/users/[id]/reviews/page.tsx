"use client"

import ReviewsTable from "@/components/reviews-table";
import { UserLayout } from "@/components/users/user-layout";
import { useSearchUserReviews } from "../../api-calls-hooks";
import Head from "next/head";

export default function UserReviews() {
  const { data, refetch, isError, isLoading } = useSearchUserReviews();
  const { reviews, count } = data || {};

  return (
    <>
      <Head>
        <title>Reviews</title>
      </Head>
      <UserLayout>
        <ReviewsTable
          reviews={reviews}
          count={count}
          showUser={false}
          refetch={refetch}
          isError={isError}
          isLoading={isLoading}
        />
      </UserLayout>
    </>
  );
};