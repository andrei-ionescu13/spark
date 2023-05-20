import type { FC } from "react";
import Head from "next/head";
import type { GetServerSideProps } from "next";
import { Box, Container } from "@mui/material";
import { PageHeader } from "@/components/page-header";
import { ArticleForm } from "@/components/articles/create/article-form";

const ArticleCreate: FC = () => {
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

export default ArticleCreate;
