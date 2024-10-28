import type { FC } from "react";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import { Box, Container } from "@mui/material";
import { HydrationBoundary, QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { listTags } from "@/api/article-tags";
import { PageHeader } from "@/components/page-header";
import { listArticleCategories } from "../api-calls";
import { ArticleForm } from "./article-form";

export default async function ArticleCreate() {
  return (
    <>
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
    </>
  );
};
