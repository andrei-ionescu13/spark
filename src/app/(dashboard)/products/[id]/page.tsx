'use client';

import { getStatusFromInterval } from '@/utils/get-status-from-interval';
import { Grid } from '@mui/material';
import { ProductGeneral } from 'app/(dashboard)/products/[id]/product-general';
import { ProductMedia } from 'app/(dashboard)/products/[id]/product-media';
import { ProductMeta } from 'app/(dashboard)/products/[id]/product-meta';
import Head from 'next/head';
import { useGetProduct } from '../api-calls-hooks';
import { ProductDiscount } from './product-discount';
import { ProductLayout } from './product-layout';
import { ProductStatus } from './product-status';

export default function Product() {
  const { data: product } = useGetProduct();

  const discountStatus =
    product?.discount &&
    getStatusFromInterval(product.discount.startDate, product.discount.endDate);
  const isEditDisabled = product?.status === 'archived';

  return (
    <>
      <Head>Game</Head>
      <ProductLayout>
        {!!product && (
          <Grid container spacing={2}>
            <Grid container item xs={12} md={8} spacing={2}>
              <Grid item xs={12}>
                <ProductGeneral
                  product={product}
                  isEditDisabled={isEditDisabled}
                />
              </Grid>
              <Grid item xs={12}>
                <ProductMedia
                  product={product}
                  isEditDisabled={isEditDisabled}
                />
              </Grid>
            </Grid>
            <Grid
              container
              item
              xs={12}
              md={4}
              spacing={2}
              sx={{ height: 'fit-content' }}
            >
              <Grid item xs={12}>
                <ProductStatus product={product} />
              </Grid>
              <Grid item xs={12}>
                <ProductMeta
                  product={product}
                  isEditDisabled={isEditDisabled}
                />
              </Grid>
              {product?.discount && discountStatus != 'expired' && (
                <Grid item xs={12}>
                  <ProductDiscount discount={product.discount} />
                </Grid>
              )}
            </Grid>
          </Grid>
        )}
      </ProductLayout>
    </>
  );
}
