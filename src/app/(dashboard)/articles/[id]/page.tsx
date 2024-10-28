"use client"

import type { FC } from "react";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import { toast } from "react-toastify";
import {
  Box,
  colors,
  Container,
  Grid,
  Link,
  Typography,
  useTheme,
} from "@mui/material";
import { useDeleteArticle, useDuplicateArticle } from "@/api/articles";
import { ActionsItem } from "@/components/actions-menu";
import { AlertDialog } from "@/components/alert-dialog";
import { MarkdownPreview } from "@/components/markdown-preview";
import { PageHeader } from "@/components/page-header";
import { useDialog } from "@/hooks/useDialog";
import { ArticleCategory, ArticleStatus } from "@/types/articles";
import { appFetch } from "@/utils/app-fetch";
import { useQuery, QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Label } from "@/components/label";
import { ArticleDetailsGeneral } from "./article-details-general";
import { ArticleDetailsMeta } from "./article-details-meta";
import { ArticleDetailsTags } from "./article-details-tags";
import { ArticleStatusCategory } from "./article-status-category";
import { ArticlePageHeader } from "./article-page-header";
import { getArticle } from "../api-calls";
import { useGetArticle, useListArticleTags } from "../api-calls-hooks";

export default function Article() {
  const { data: article } = useGetArticle();
  const { data: categories } = useListArticleTags();

  if (!article || !categories) return null;

  const isEditDisabled = article?.status === "archived";

  return (
    <>
      <Head>
        <title>Article</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <ArticlePageHeader article={article} />
          <Grid container spacing={2}>
            <Grid item md={8} xs={12}>
              <ArticleDetailsGeneral
                article={article}
                isEditDisabled={isEditDisabled}
              />
            </Grid>
            <Grid
              container
              item
              md={4}
              spacing={2}
              sx={{ height: "fit-content" }}
              xs={12}
            >
              <Grid item xs={12}>
                <ArticleStatusCategory
                  article={article}
                  categories={categories}
                  isEditDisabled={isEditDisabled}
                />
              </Grid>
              <Grid item xs={12}>
                <ArticleDetailsTags
                  article={article}
                  isEditDisabled={isEditDisabled}
                />
              </Grid>
              <Grid item xs={12}>
                <ArticleDetailsMeta
                  article={article}
                  isEditDisabled={isEditDisabled}
                />
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};
