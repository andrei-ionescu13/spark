import Head from "next/head";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import { Box, colors, Grid, useTheme } from "@mui/material";
import { ProductGeneral } from "@/components/products/product/product-general";
import { ProductMeta } from "@/components/products/product/product-meta";
import { ProductStatus } from "@/components/products/product/product-status";
import { ProductLayout } from "@/components/products/product-layout";
import { ProductMedia } from "@/components/products/product/product-media";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { appFetch } from "@/utils/app-fetch";
import {
  Product as ProductI,
  ProductStatus as ProductStatusI,
} from "@/types/products";
import { ProductDiscount } from "@/components/products/product/product-discount";

const getProduct =
  (id: string, config: Record<string, any> = {}) =>
  () =>
    appFetch<ProductI>({ url: `/products/${id}`, withAuth: true, ...config });

export const Product = () => {
  const theme = useTheme();
  const router = useRouter();
  const id = router.query.id as string;
  const { data: product } = useQuery(["product", id], getProduct(id));

  if (!product) return null;

  const isEditDisabled = product.status === "archived";

  const mappedColors: Record<ProductStatusI, string> = {
    draft: colors.grey[500],
    published: theme.palette.success.main,
    archived: theme.palette.error.main,
  };

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
            {product.discount && (
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
    await queryClient.fetchQuery(["product", id], getProduct(id, { req, res }));
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
