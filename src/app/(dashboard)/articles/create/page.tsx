import type { FC } from "react";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import { Box, Container } from "@mui/material";
import { HydrationBoundary, QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { listTags } from "@/api/article-tags";
import { ArticleForm } from "@/components/articles/create/article-form";
import { PageHeader } from "@/components/page-header";
import { listArticleCategories } from "../api-calls";

export default async function ArticleCreate() {
  const queryClient = new QueryClient()

  await Promise.resolve([
    queryClient.prefetchQuery({
      queryKey: ["article-categories"],
      queryFn: listArticleCategories
    }),
    queryClient.prefetchQuery({
      queryKey: ["article-tags"],
      queryFn: listTags()
    })
  ])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Head>
        <title>Article Create</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <PageHeader
            backHref="/articles"
            backLabel="Articles"
            title="Create article"
          />
          <ArticleForm />
        </Container>
      </Box>
    </HydrationBoundary>
  );
};
