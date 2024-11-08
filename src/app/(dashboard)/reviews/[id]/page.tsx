'use client';

import { Box, Container, Grid } from '@mui/material';
import Head from 'next/head';
import { useGetReview } from './api';
import { ReviewHeader } from './review-header';
import { ReviewProduct } from './review-product';
import { ReviewStatus } from './review-status';
import { ReviewsDetails } from './reviews-details';

export default function Review() {
  const { data: review, isLoading } = useGetReview();

  return (
    <>
      <Head>
        <title>Review</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <ReviewHeader
            review={review}
            isLoading={isLoading}
          />
          {!!review && (
            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                xs={12}
                md={8}
              >
                <ReviewsDetails review={review} />
              </Grid>
              <Grid
                item
                xs={12}
                md={4}
                container
                spacing={2}
              >
                <Grid
                  item
                  xs={12}
                >
                  <ReviewStatus review={review} />
                </Grid>
                <Grid
                  item
                  xs={12}
                >
                  <ReviewProduct review={review} />
                </Grid>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
    </>
  );
}
