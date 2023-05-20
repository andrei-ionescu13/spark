import { useRouter } from "next/router";
import Head from "next/head";
import type { GetServerSideProps, NextPage } from "next";
import { dehydrate, QueryClient, useQuery, useQueryClient } from "react-query";
import { appFetch } from "@/utils/app-fetch";
import { ParsedUrlQuery } from "querystring";
import type { Review } from "@/types/review";
import { UserLayout } from "@/components/users/user-layout";
import ReviewsTable from "@/components/reviews-table";
import { ProductLayout } from "@/components/products/product-layout";
import type { Product } from "@/types/products";

interface GetUserReviews {
  reviews: Review[];
  count: number;
}

const getProduct =
  (id: string, config: Record<string, any> = {}) =>
  () =>
    appFetch<Product>({ url: `/products/${id}`, withAuth: true, ...config });
const getProductReviews =
  (id: string, query: ParsedUrlQuery, config: Record<string, any> = {}) =>
  () =>
    appFetch<GetUserReviews>({
      url: `/products/${id}/reviews`,
      query,
      withAuth: true,
      ...config,
    });

const Reviews: NextPage = () => {
  const router = useRouter();
  const { id, ...query } = router.query as {
    id: string;
    [key: string]: any;
  };
  const { data, refetch } = useQuery(
    ["product-reviews", id, query],
    getProductReviews(id, query)
  );
  const { data: product } = useQuery(["product", id], getProduct(id));

  if (!data || !product) return null;

  const { reviews, count } = data;

  return (
    <>
      <Head>
        <title>Reviews</title>
      </Head>
      <ProductLayout product={product}>
        <ReviewsTable
          refetch={refetch}
          reviews={reviews}
          count={count}
          showProduct={false}
        />
      </ProductLayout>
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
    await Promise.all([
      queryClient.fetchQuery(["product", id], getProduct(id, { req, res })),
      queryClient.fetchQuery(
        ["product-reviews", id, queryRest],
        getProductReviews(id, queryRest, { req, res })
      ),
    ]);
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
