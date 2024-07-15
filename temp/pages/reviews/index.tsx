import { useState } from "react";
import type { FC, SyntheticEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
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
import { dehydrate, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { RaviewTableRow } from "../../../src/app/components/reviews/review-list/review-table-row";
import { AlertDialog } from "../../../src/app/components/alert-dialog";
import { PageHeader } from "../../../src/app/components/page-header";
import { SearchInput } from "../../../src/app/components/search-input";
import { Plus as PlusIcon } from "../../../src/app/icons/plus";
// import { useDeleteArticles } from '@/api/reviews';
import { useSearch } from "../../../src/app/hooks/useSearch";
import { useSort } from "../../../src/app/hooks/useSort";
import { useQueryValue } from "../../../src/app/hooks/useQueryValue";
import { appFetch } from "../../../src/app/utils/app-fetch";
import { DataTable } from "../../../src/app/components/data-table";
import { ParsedUrlQuery } from "querystring";
import { DataTableHead } from "../../../src/app/components/data-table-head";
import type { HeadCell } from "../../../src/app/components/data-table-head";
import type { Review } from "../../../src/app/types/review";
import ReviewsTable from "../../../src/app/components/reviews-table";

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
  const { error, data, refetch } = useQuery({
    queryKey: ["reviews", query],
    queryFn: getReviews(query)
  }


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
    await queryClient.fetchQuery({
      queryKey: ["reviews", query],
      queryFn: getReviews(query, { req, res })
    }


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
