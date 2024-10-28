'use client';

import { PageHeader } from '@/components/page-header';
import { Plus as PlusIcon } from '@/icons/plus';
import { Box, Container } from '@mui/material';
import Head from 'next/head';
import {
  useListArticleCategories,
  useSearchArticles,
} from '../api-calls-hooks';
import { ArticlesTable } from './articles-table';

export default function Articles() {
  const { data: categories } = useListArticleCategories();
  const { data, refetch, isError, isLoading } = useSearchArticles();
  const { articles, count } = data || {};

  return (
    <>
      <Head>
        <title>Articles</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <PageHeader
            title="Articles"
            action={{
              href: '/articles/create',
              label: 'Add',
              icon: PlusIcon,
            }}
          />
          <ArticlesTable
            articles={articles}
            count={count}
            isError={isError}
            isLoading={isLoading}
            refetch={refetch}
            categories={categories || []}
          />
        </Container>
      </Box>
    </>
  );
}
