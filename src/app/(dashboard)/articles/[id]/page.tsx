'use client';

import { Box, Container, Grid } from '@mui/material';
import Head from 'next/head';
import { useState } from 'react';
import { useListArticleCategories } from '../api';
import { useGetArticle } from './api';
import { ArticleGeneral } from './article-general';
import { ArticleGeneralForm } from './article-general-form';
import { ArticleMeta } from './article-meta';
import { ArticleUpdateMetaForm } from './article-meta-form';
import { ArticlePageHeader } from './article-page-header';
import { ArticleStatusCategory } from './article-status-category';
import { ArticleTags } from './article-tags';

type DisplayedForm = 'details' | 'meta' | null;

export default function Article() {
  const { data: article } = useGetArticle();
  const { data: categories } = useListArticleCategories();
  const [displayedForm, setDisplayedForm] = useState<DisplayedForm>();

  const isEditDisabled = article?.status === 'archived';

  const handleDisplayForm = (displayedForm: DisplayedForm) => {
    window.scrollTo(0, 0);
    setDisplayedForm(displayedForm);
  };

  const handleHideForm = () => {
    window.scrollTo(0, 0);
    setDisplayedForm(null);
  };

  if (!article || !categories) return null;

  return (
    <>
      <Head>
        <title>Article</title>
      </Head>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="lg">
          <ArticlePageHeader article={article} />
          {article && displayedForm === 'details' && (
            <ArticleGeneralForm
              article={article}
              onClose={handleHideForm}
            />
          )}
          {article && displayedForm === 'meta' && (
            <ArticleUpdateMetaForm
              article={article}
              onClose={handleHideForm}
            />
          )}
          {!!article && !displayedForm && (
            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                md={8}
                xs={12}
              >
                <ArticleGeneral
                  article={article}
                  isEditDisabled={isEditDisabled}
                  onEdit={() => {
                    handleDisplayForm('details');
                  }}
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
                  <ArticleTags
                    article={article}
                    isEditDisabled={isEditDisabled}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                >
                  <ArticleMeta
                    article={article}
                    isEditDisabled={isEditDisabled}
                    onEdit={() => {
                      handleDisplayForm('meta');
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
    </>
  );
}
