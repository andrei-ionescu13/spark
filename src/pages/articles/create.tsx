import type { FC } from "react";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import { Box, Container } from "@mui/material";
import { PageHeader } from "@/components/page-header";
import { ArticleForm } from "@/components/articles/create/article-form";
import { ArticleCategory } from "@/types/article-category";
import { appFetch } from "@/utils/app-fetch";
import { QueryClient, dehydrate, useQuery } from "react-query";
import { listArticleCategories } from "@/api/article-categories";
import { listTags } from "@/api/article-tags";

const ArticleCreate: FC = () => {
  const { data: articleCategories } = useQuery(
    "article-categories",
    listArticleCategories()
  );

  const { data: articleTags } = useQuery("article-tags", listTags());

  if (!articleCategories || !articleTags) return null;

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
          <ArticleForm categories={articleCategories} tags={articleTags} />
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
      "article-categories",
      listArticleCategories({ req, res })
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

export default ArticleCreate;
