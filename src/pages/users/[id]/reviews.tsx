import { useRouter } from "next/router";
import Head from "next/head";
import type { GetServerSideProps, NextPage } from "next";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { appFetch } from "@/utils/app-fetch";
import { ParsedUrlQuery } from "querystring";
import type { Review } from "@/types/review";
import { UserLayout } from "@/components/users/user-layout";
import ReviewsTable from "@/components/reviews-table";
import type { User } from "@/types/user";

interface GetUserReviews {
  reviews: Review[];
  count: number;
}

const getUserReviews =
  (id: string, query: ParsedUrlQuery, config: Record<string, any> = {}) =>
    () =>
      appFetch<GetUserReviews>({
        url: `/users/${id}/reviews`,
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

const Reviews: NextPage = () => {
  const router = useRouter();
  const { id, ...query } = router.query as {
    id: string;
    [key: string]: string;
  };
  const { data, refetch } = useQuery({
    queryKey: ["user-reviews", id, query],
    queryFn: getUserReviews(id, query)
  }


  );
  const { data: user } = useQuery({
    queryKey: ["users", id],
    queryFn: getUser(id)
  });

  if (!data || !user) return null;

  const { reviews, count } = data;

  return (
    <>
      <Head>
        <title>Reviews</title>
      </Head>
      <UserLayout user={user}>
        <ReviewsTable
          reviews={reviews}
          count={count}
          showUser={false}
          refetch={refetch}
        />
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
    [key: string]: string;
  };

  try {
    await queryClient.fetchQuery({
      queryKey: ["user-reviews", id, query],
      queryFn: getUserReviews(id, queryRest, { req, res })
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

export default Reviews;
