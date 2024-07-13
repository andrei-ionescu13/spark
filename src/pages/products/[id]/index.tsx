import Head from "next/head";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import { Grid } from "@mui/material";
import { ProductGeneral } from "@/components/products/product/product-general";
import { ProductMeta } from "@/components/products/product/product-meta";
import { ProductStatus } from "@/components/products/product/product-status";
import { ProductLayout } from "@/components/products/product-layout";
import { ProductMedia } from "@/components/products/product/product-media";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { appFetch } from "@/utils/app-fetch";
import { Product as ProductI } from "@/types/products";
import { ProductDiscount } from "@/components/products/product/product-discount";
import { getStatusFromInterval } from "@/utils/get-status-from-interval";

const getProduct =
  (id: string, config: Record<string, any> = {}) =>
    () =>
      appFetch<ProductI>({ url: `/products/${id}`, withAuth: true, ...config });

export const Product = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data: product } = useQuery({
    queryKey: ["product", id],
    queryFn: getProduct(id)
  });

  if (!product) return null;

  const discountStatus =
    product.discount &&
    getStatusFromInterval(product.discount.startDate, product.discount.endDate);
  const isEditDisabled = product.status === "archived";

  return (
    <>
      <Head>Game</Head>
      <ProductLayout product={product}>
        <Grid container spacing={2}>
          <Grid container item xs={12} md={8} spacing={2}>
            <Grid item xs={12}>
              <ProductGeneral
                isEditDisabled={isEditDisabled}
                product={product}
              />
            </Grid>
            <Grid item xs={12}>
              <ProductMedia isEditDisabled={isEditDisabled} product={product} />
            </Grid>
          </Grid>
          <Grid
            container
            item
            xs={12}
            md={4}
            spacing={2}
            sx={{ height: "fit-content" }}
          >
            <Grid item xs={12}>
              <ProductStatus product={product} />
            </Grid>
            <Grid item xs={12}>
              <ProductMeta isEditDisabled={isEditDisabled} product={product} />
            </Grid>
            {product.discount && discountStatus != "expired" && (
              <Grid item xs={12}>
                <ProductDiscount discount={product.discount} />
              </Grid>
            )}
          </Grid>
        </Grid>
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
  const { id } = query as { id: string };
  const queryClient = new QueryClient();

  try {
    await queryClient.fetchQuery({
      queryKey: ["product", id],
      queryFn: getProduct(id, { req, res })
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

export default Product;
