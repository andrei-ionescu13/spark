'use client';

import { Box, Container } from '@mui/material';
import Head from 'next/head';
import { useSearchArticleCategories } from './api';
import { CategoriesHeader } from './categories-header';
import { CategoriesTable } from './categories-table';

export default function ArticleCategories() {
  const { data, refetch, isError, isLoading } = useSearchArticleCategories();
  const { categories, count } = data || {};

  return (
    <>
      <Head>
        <title>Article categories</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <CategoriesHeader />
          <CategoriesTable
            categories={categories}
            count={count}
            isError={isError}
            isLoading={isLoading}
            refetch={refetch}
          />
        </Container>
      </Box>
    </>
  );
}
