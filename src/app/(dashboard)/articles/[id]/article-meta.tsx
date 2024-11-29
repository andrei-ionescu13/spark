'use client';
import { Button } from '@/components/button';
import { InfoList } from '@/components/info-list';
import { InfoListItem } from '@/components/info-list-item';
import { Card, CardContent, CardHeader, Divider } from '@mui/material';
import type { FC } from 'react';
import { Article } from '../../../types/articles';

interface ArticleMetaProps {
  article: Article;
  isEditDisabled?: boolean;
  onEdit: () => void;
}

export const ArticleMeta: FC<ArticleMetaProps> = (props) => {
  const { article, isEditDisabled, onEdit } = props;

  return (
    <Card>
      <CardHeader
        action={
          <Button
            color="secondary"
            disabled={isEditDisabled}
            onClick={onEdit}
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
  );
};
