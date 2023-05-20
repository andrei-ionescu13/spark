import { useState } from "react";
import type { FC, SyntheticEvent, ChangeEvent } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Divider,
  Tab,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  MenuItem,
  TableSortLabel,
  TextField,
} from "@mui/material";
import { dehydrate, QueryClient, useQuery, useQueryClient } from "react-query";
import { RaviewTableRow } from "@/components/reviews/review-list/review-table-row";
import { AlertDialog } from "@/components/alert-dialog";
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/search-input";
import { Plus as PlusIcon } from "@/icons/plus";
// import { useDeleteArticles } from '@/api/reviews';
import { useSearch } from "@/hooks/useSearch";
import { useSort } from "@/hooks/useSort";
import { useQueryValue } from "@/hooks/useQueryValue";
import { appFetch } from "@/utils/app-fetch";
import { DataTable } from "@/components/data-table";
import { ParsedUrlQuery } from "querystring";
import { DataTableHead } from "@/components/data-table-head";
import type { HeadCell } from "@/components/data-table-head";
import type { Review } from "@/types/review";
import ReviewsTable from "@/components/reviews-table";

interface GetReviewsData {
  reviews: Review[];
  count: number;
}

const getReviews =
  (query: ParsedUrlQuery, config: Record<string, any> = {}) =>
  () =>
    appFetch<GetReviewsData>({
      url: "/reviews",
      query,
      withAuth: true,
      ...config,
    });

const Reviews: FC = (props) => {
  const { query } = useRouter();
  const { error, data, refetch } = useQuery(
    ["reviews", query],
    getReviews(query)
  );

  if (!data) return null;

  const { reviews, count } = data;

  return (
    <>
      <Head>
        <title>Reviews</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title="Reviews"
            action={{
              href: "/reviews/create",
              isLink: true,
              label: "Create",
              icon: PlusIcon,
            }}
          />
          <ReviewsTable reviews={reviews} count={count} refetch={refetch} />
        </Container>
      </Box>
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

  try {
    await queryClient.fetchQuery(
      ["reviews", query],
      getReviews(query, { req, res })
    );
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
