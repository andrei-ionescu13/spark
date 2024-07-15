import { useRouter } from "next/navigation";
import Head from "next/head";
import type { GetServerSideProps, NextPage } from "next";
import { dehydrate, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { appFetch } from "../../../../src/app/utils/app-fetch";
import { ParsedUrlQuery } from "querystring";
import type { Review } from "../../../../src/app/types/review";
import { UserLayout } from "../../../../src/app/components/users/user-layout";
import ReviewsTable from "../../../../src/app/components/reviews-table";
import { ProductLayout } from "../../../../src/app/components/products/product-layout";
import type { Product } from "../../../../src/app/types/products";

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
  const { data, refetch } = useQuery({
    queryKey: ["product-reviews", id, query],
    queryFn: getProductReviews(id, query)
  }


  );
  const { data: product } = useQuery({
    queryKey: ["product", id],
    queryFn: getProduct(id)
  });

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
      queryClient.fetchQuery({
        queryKey: ["product", id],
        queryFn: getProduct(id, { req, res })
      }),
      queryClient.fetchQuery({
        queryKey: ["product-reviews", id, queryRest],
        queryFn: getProductReviews(id, queryRest, { req, res })
      }


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
