'use client';

import { ActionsItem } from '@/components/actions-menu';
import { AlertDialog } from '@/components/alert-dialog';
import { Label } from '@/components/label';
import { MarkdownPreview } from '@/components/markdown-preview';
import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { Duplicate } from '@/icons/duplicate';
import { Eye } from '@/icons/eye';
import { Trash } from '@/icons/trash';
import { Article, ArticleStatus } from '@/types/articles';
import { Box, colors, Link, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useDuplicateArticle } from '../(page)/api';
import { useDeleteArticle } from '../api';
import { ArticleDuplicateDialog } from '../article-duplicate-dialog';

interface ArticlePageHeaderProps {
  article: Article;
}

const ToastSuccess = (id: string) => (
  <Box>
    <Typography
      variant="body1"
      color="textPrimary"
    >
      Article duplicated
    </Typography>
    <Link
      color="textPrimary"
      href={`/articles/${id}`}
      underline="hover"
      variant="body1"
    >
      Go to the created article
    </Link>
  </Box>
);

export const ArticlePageHeader: FC<ArticlePageHeaderProps> = (props) => {
  const { article } = props;
  const router = useRouter();
  const theme = useTheme();
  const [openDeleteDialog, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog();
  const [
    openDuplicateDialog,
    handleOpenDuplicateDialog,
    handleCloseDuplicateDialog,
  ] = useDialog();
  const [openPreviewDialog, handleOpenPreviewDialog, handleClosePreviewDialog] =
    useDialog();
  const deleteArticle = useDeleteArticle();
  const duplicateArticle = useDuplicateArticle(article?._id || '');

  const actionItems: ActionsItem[] = [
    {
      label: 'Preview',
      icon: Eye,
      onClick: handleOpenPreviewDialog,
    },
    {
      label: 'Duplicate',
      icon: Duplicate,
      onClick: handleOpenDuplicateDialog,
    },
    {
      label: 'Delete',
      icon: Trash,
      onClick: handleOpenDeleteDialog,
      color: 'error',
    },
  ];

  const mappedColors: Record<ArticleStatus, string> = {
    draft: colors.grey[500],
    published: theme.palette.success.main,
    archived: theme.palette.error.main,
  };

  if (!article) return null;

  const handleDeleteArticle = () => {
    deleteArticle.mutate(article._id, {
      onSuccess: () => {
        router.push('/articles');
      },
    });
  };

  return (
    <>
      <PageHeader
        actions={actionItems}
        backHref="/articles"
        backLabel="Articles"
        title={article.title}
      >
        <Label color={mappedColors[article.status]}>{article.status}</Label>
      </PageHeader>
      <AlertDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        title={`Delete article ${article._id}`}
        content="Are you sure you want to permanently delete this article?"
        onSubmit={handleDeleteArticle}
        isLoading={deleteArticle.isPending}
      />
      <ArticleDuplicateDialog
        open={openDuplicateDialog}
        onClose={handleCloseDuplicateDialog}
        articleId={article._id}
      />
      <MarkdownPreview
        open={openPreviewDialog}
        onClose={handleClosePreviewDialog}
        markdown={article.markdown}
        title={article.title}
        cover={article.cover.url}
      />
    </>
  );
};
