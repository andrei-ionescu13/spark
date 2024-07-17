import Head from "next/head";
import { Grid } from "@mui/material";
import { ProductLayout } from "@/components/products/product-layout";
import { getStatusFromInterval } from "@/utils/get-status-from-interval";
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getProduct } from "../api-calls";
import { ProductGeneral } from "@/components/products/product/product-general";
import { ProductMedia } from "@/components/products/product/product-media";
import { ProductStatus } from "@/components/products/product/product-status";
import { ProductMeta } from "@/components/products/product/product-meta";
import { ProductDiscount } from "@/components/products/product/product-discount";



export default async function Product({ params }) {
  const { id } = params;
  const queryClient = new QueryClient()
  const product = await queryClient.fetchQuery({
    queryKey: ["product", id],
    queryFn: getProduct(id)
  });
  console.log(product)
  if (!product) return null;

  const discountStatus =
    product.discount &&
    getStatusFromInterval(product.discount.startDate, product.discount.endDate);
  const isEditDisabled = product.status === "archived";

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Head>Game</Head>
      <ProductLayout>
        <Grid container spacing={2}>
          <Grid container item xs={12} md={8} spacing={2}>
            <Grid item xs={12}>
              <ProductGeneral
                isEditDisabled={isEditDisabled}
              />
            </Grid>
            <Grid item xs={12}>
              <ProductMedia isEditDisabled={isEditDisabled} />
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
              <ProductStatus />
            </Grid>
            <Grid item xs={12}>
              <ProductMeta isEditDisabled={isEditDisabled} />
            </Grid>
            {product.discount && discountStatus != "expired" && (
              <Grid item xs={12}>
                <ProductDiscount discount={product.discount} />
              </Grid>
            )}
          </Grid>
        </Grid>
      </ProductLayout>
    </HydrationBoundary>
  );
};
