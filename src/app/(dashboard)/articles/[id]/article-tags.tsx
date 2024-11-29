'use client';

import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, Chip, Divider } from '@mui/material';
import type { FC } from 'react';
import { useDialog } from '../../../hooks/useDialog';
import { Article } from '../../../types/articles';
import { ArticleTagsForm } from './article-tags-form';

interface ArticleStatusTagProps {
  article: Article;
  isEditDisabled?: boolean;
}

export const ArticleTags: FC<ArticleStatusTagProps> = (props) => {
  const { article, isEditDisabled } = props;
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();

  return (
    <>
      <Card>
        <CardHeader
          title="Tags"
          action={
            <Button
              color="secondary"
              onClick={handleOpenDialog}
              variant="text"
              disabled={isEditDisabled}
            >
              Edit
            </Button>
          }
        />
        <Divider />
        <CardContent
          sx={{
            display: 'flex',
            gap: 1,
          }}
        >
          {article.tags.map((tag) => (
            <Chip
              size="small"
              label={tag.name}
            />
          ))}
        </CardContent>
      </Card>
      {dialogOpen && (
        <ArticleTagsForm
          article={article}
          onClose={handleCloseDialog}
          open
        />
      )}
    </>
  );
};
