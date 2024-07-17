"use client"

import { useDeleteArticle, useDuplicateArticle } from '@/api/articles';
import { ActionsItem } from '@/components/actions-menu';
import { AlertDialog } from '@/components/alert-dialog';
import { MarkdownPreview } from '@/components/markdown-preview';
import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { Duplicate } from '@/icons/duplicate';
import { Eye } from '@/icons/eye';
import { Trash } from '@/icons/trash';
import { Article, ArticleStatus } from '@/types/articles';
import { Box, colors, Link, Typography } from '@mui/material';
import type { FC } from 'react'
import { toast } from 'react-toastify';
import { useTheme } from '@mui/material';
import { Label } from '@/components/label';
import { useGetArticle } from '../api-calls-hooks';

interface ArticlePageHeaderProps {
}

const ToastSuccess = (id: string) => (
  <Box>
    <Typography variant="body1" color="textPrimary">
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

export const ArticlePageHeader: FC<ArticlePageHeaderProps> = () => {
  const { data: article } = useGetArticle();
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
  const duplicateArticle = useDuplicateArticle(article?._id || "");

  const actionItems: ActionsItem[] = [
    {
      label: "Preview",
      icon: Eye,
      onClick: handleOpenPreviewDialog,
    },
    {
      label: "Duplicate",
      icon: Duplicate,
      onClick: handleOpenDuplicateDialog,
    },
    {
      label: "Delete",
      icon: Trash,
      onClick: handleOpenDeleteDialog,
      color: "error",
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
        // router.push("/articles");
      },
    });
  };

  const handleDuplicateArticle = () => {
    duplicateArticle.mutate(article._id, {
      onSuccess: ({ id }) => {
        handleCloseDuplicateDialog();
        toast.success(ToastSuccess(id));
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
        <Label color={mappedColors['draft']}>{article.status}</Label>
      </PageHeader>
      <AlertDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        title="Delete article"
        content="Are you sure you want to delete this article?"
        onSubmit={handleDeleteArticle}
        isLoading={deleteArticle.isPending}
      />
      <AlertDialog
        open={openDuplicateDialog}
        onClose={handleCloseDuplicateDialog}
        title={`Duplicate article`}
        content="Are you sure you want to duplicate this article?"
        onSubmit={handleDuplicateArticle}
        isLoading={duplicateArticle.isPending}
      />
      <MarkdownPreview
        open={openPreviewDialog}
        onClose={handleClosePreviewDialog}
        markdown={article.markdown}
        title={article.title}
        cover={article.cover.url}
      />
    </>
  )
};
