'use client';
import { Button } from '@/components/button';
import { InfoList } from '@/components/info-list';
import { InfoListItem } from '@/components/info-list-item';
import { Card, CardContent, CardHeader, Divider } from '@mui/material';
import type { FC } from 'react';
import { useState } from 'react';
import { Article } from '../../../types/articles';
import { ArticleDetailsMetaForm } from './article-details-meta-form';

interface ArticleDetailsMetaProps {
  article: Article;
  isEditDisabled?: boolean;
}

export const ArticleDetailsMeta: FC<ArticleDetailsMetaProps> = (props) => {
  const { article, isEditDisabled } = props;
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = (): void => {
    setOpenDialog(true);
  };

  const handleCloseDialog = (): void => {
    setOpenDialog(false);
  };

  return (
    <>
      <Card>
        <CardHeader
          action={
            <Button
              color="secondary"
              disabled={isEditDisabled}
              onClick={handleOpenDialog}
              variant="text"
            >
              Edit
            </Button>
          }
          title="Meta"
        />
        <Divider />
        <CardContent>
          <InfoList>
            <InfoListItem
              content={article.meta.title}
              title="Title"
            />
            <InfoListItem
              content={article.meta.description}
              title="Description"
            />
            <InfoListItem
              content={article.meta.keywords.join(', ')}
              title="Keywords"
            />
          </InfoList>
        </CardContent>
      </Card>
      {openDialog && (
        <ArticleDetailsMetaForm
          article={article}
          onClose={handleCloseDialog}
          open
          values={{
            description: article.meta.description,
            keywords: article.meta.keywords,
            title: article.meta.title,
          }}
        />
      )}
    </>
  );
};
