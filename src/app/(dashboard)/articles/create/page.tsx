import { PageHeader } from '@/components/page-header';
import { Box, Container } from '@mui/material';
import Head from 'next/head';
import { ArticleForm } from './article-form';

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
}
