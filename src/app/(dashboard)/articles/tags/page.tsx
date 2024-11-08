'use client';
import { Box, Container } from '@mui/material';
import Head from 'next/head';
import { useSearchArticleTags } from './api';
import { TagsHeader } from './tags-header';
import { TagsTable } from './tags-table';

export default function ArticleTags() {
  const { data, refetch, isError, isLoading } = useSearchArticleTags();
  const { tags, count } = data || {};

  return (
    <>
      <Head>
        <title>Article categories</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth={false}>
          <TagsHeader />
          <TagsTable
            tags={tags}
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
