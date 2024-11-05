'use client';

import { Box, Container, Grid } from '@mui/material';
import Head from 'next/head';
import { useGetArticle, useListArticleTags } from '../api-calls-hooks';
import { ArticleDetailsGeneral } from './article-details-general';
import { ArticleDetailsMeta } from './article-details-meta';
import { ArticleDetailsTags } from './article-details-tags';
import { ArticlePageHeader } from './article-page-header';
import { ArticleStatusCategory } from './article-status-category';

export default function Article() {
  const { data: article } = useGetArticle();
  const { data: categories } = useListArticleTags();

  if (!article || !categories) return null;

  const isEditDisabled = article?.status === 'archived';

  return (
    <>
      <Head>
        <title>Article</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <ArticlePageHeader article={article} />
          <Grid
            container
            spacing={2}
          >
            <Grid
              item
              md={8}
              xs={12}
            >
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
              sx={{ height: 'fit-content' }}
              xs={12}
            >
              <Grid
                item
                xs={12}
              >
                <ArticleStatusCategory
                  article={article}
                  categories={categories}
                  isEditDisabled={isEditDisabled}
                />
              </Grid>
              <Grid
                item
                xs={12}
              >
                <ArticleDetailsTags
                  article={article}
                  isEditDisabled={isEditDisabled}
                />
              </Grid>
              <Grid
                item
                xs={12}
              >
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
}
