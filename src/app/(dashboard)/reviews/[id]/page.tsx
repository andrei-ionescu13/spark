"use client"

import type { FC } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import type { GetServerSideProps } from "next";
import { toast } from "react-toastify";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  colors,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  Link,
  MenuItem,
  Rating,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import { formatDate } from "@/utils/format-date";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { getReview } from "../api-calls";
import { useGetReview } from "../api-calls-hooks";
import { ReviewStatus } from "./review-status";
import Image from "next/image";
import { ReviewHeader } from "./review-header";
import { ReviewsDetails } from "./reviews-details";
import { ReviewProduct } from "./review-product";

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
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <ReviewsDetails review={review} />
              </Grid>
              <Grid item xs={12} md={4} container spacing={2}>
                <Grid item xs={12}>
                  <ReviewStatus review={review} />
                </Grid>
                <Grid item xs={12}>
                  <ReviewProduct review={review} />
                </Grid>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
    </>
  );
};
