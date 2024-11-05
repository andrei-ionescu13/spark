'use client';

import { getStatusFromInterval } from '@/utils/get-status-from-interval';
import { Grid } from '@mui/material';
import { ProductMedia } from 'app/(dashboard)/products/[id]/(page)/product-media';
import { ProductMeta } from 'app/(dashboard)/products/[id]/(page)/product-meta';
import Head from 'next/head';
import { useState } from 'react';
import { useGetProduct } from '../../api-calls-hooks';
import { ProductDiscount } from '../product-discount';
import { ProductLayout } from '../product-layout';
import { ProductStatus } from '../product-status';
import { ProductGeneral } from './product-general';
import { ProductGeneralForm } from './product-general-form';
import { ProductMediaForm } from './product-media-form';
import { ProductMetaForm } from './product-meta-form';

type DisplayedForm = 'details' | 'media' | 'meta' | null;

export default function Product() {
  const { data: product } = useGetProduct();

  const discountStatus =
    product?.discount &&
    getStatusFromInterval(product.discount.startDate, product.discount.endDate);
  const isEditDisabled = product?.status === 'archived';
  const [displayedForm, setDisplayedForm] = useState<DisplayedForm>();

  const handleDisplayForm = (displayedForm: DisplayedForm) => {
    window.scrollTo(0, 0);
    setDisplayedForm(displayedForm);
  };

  const handleHideForm = () => {
    window.scrollTo(0, 0);
    setDisplayedForm(null);
  };

  return (
    <>
      <Head>Game</Head>
      <ProductLayout>
        {product && displayedForm === 'details' && (
          <ProductGeneralForm
            product={product}
            onClose={handleHideForm}
          />
        )}
        {product && displayedForm === 'media' && (
          <ProductMediaForm
            product={product}
            onClose={handleHideForm}
          />
        )}
        {product && displayedForm === 'meta' && (
          <ProductMetaForm
            product={product}
            onClose={handleHideForm}
          />
        )}
        {!!product && !displayedForm && (
          <Grid
            container
            spacing={2}
          >
            <Grid
              container
              item
              xs={12}
              md={8}
              spacing={2}
            >
              <Grid
                item
                xs={12}
              >
                <ProductGeneral
                  product={product}
                  isEditDisabled={isEditDisabled}
                  onEdit={() => {
                    handleDisplayForm('details');
                  }}
                />
              </Grid>
              <Grid
                item
                xs={12}
              >
                <ProductMedia
                  product={product}
                  isEditDisabled={isEditDisabled}
                  onEdit={() => {
                    handleDisplayForm('media');
                  }}
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
              <Grid
                item
                xs={12}
              >
                <ProductStatus product={product} />
              </Grid>
              <Grid
                item
                xs={12}
              >
                <ProductMeta
                  product={product}
                  isEditDisabled={isEditDisabled}
                  onEdit={() => {
                    handleDisplayForm('meta');
                  }}
                />
              </Grid>
              {product?.discount && discountStatus != 'expired' && (
                <Grid
                  item
                  xs={12}
                >
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
