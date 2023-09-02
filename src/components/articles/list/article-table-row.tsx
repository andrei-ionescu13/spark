import type { FC } from "react";
import {
  Box,
  Checkbox,
  colors,
  TableCell,
  Typography,
  useTheme,
} from "@mui/material";
import { useQueryClient } from "react-query";
import { ActionsItem } from "@/components/actions-menu";
import { AlertDialog } from "@/components/alert-dialog";
import { ActionsIconButton } from "@/components/icon-actions";
import { Link } from "@/components/link";
import { Trash as TrashIcon } from "@/icons/trash";
import { useDeleteArticle, useDuplicateArticle } from "@/api/articles";
import { Label } from "@/components/label";
import type { Article } from "@/types/articles";
import { formatDate } from "@/utils/format-date";
import { DataTableRow } from "@/components/data-table-row";
import { useDialog } from "@/hooks/useDialog";
import { MarkdownPreview } from "@/components/markdown-preview";
import { Duplicate as DuplicateIcon } from "@/icons/duplicate";
import { Eye as EyeIcon } from "@/icons/eye";
import { ArticleDuplicateDialog } from "../article-duplicate-dialog";

interface ArticleTableRowProps {
  article: Article;
  onSelect: () => void;
  selected: boolean;
}

export const ArticleTableRow: FC<ArticleTableRowProps> = (props) => {
  const { article, selected, onSelect } = props;
  const queryClient = useQueryClient();
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
  const deleteArticle = useDeleteArticle(() =>
    queryClient.invalidateQueries("articles")
  );
  const duplicateArticle = useDuplicateArticle(() =>
    queryClient.invalidateQueries("articles")
  );

  const handleDeleteArticle = () => {
    deleteArticle.mutate(article._id, {
      onSuccess: () => {
        handleCloseDeleteDialog();
      },
    });
  };

  const actionItems: ActionsItem[] = [
    {
      label: "Preview",
      icon: EyeIcon,
      onClick: handleOpenPreviewDialog,
    },
    {
      label: "Duplicate",
      icon: DuplicateIcon,
      onClick: handleOpenDuplicateDialog,
    },
    {
      label: "Delete",
      icon: TrashIcon,
      onClick: handleOpenDeleteDialog,
      color: "error",
    },
  ];

  const mappedColors = {
    draft: colors.grey[500],
    published: theme.palette.success.main,
    archived: theme.palette.error.main,
  };

  return (
    <>
      <AlertDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        title="Delete article"
        content="Are you sure you want to delete this article?"
        onSubmit={handleDeleteArticle}
        isLoading={deleteArticle.isLoading}
      />
      <ArticleDuplicateDialog
        open={openDuplicateDialog}
        onClose={handleCloseDuplicateDialog}
        articleId={article._id}
      />
      {/* <AlertDialog
        open={openDuplicateDialog}
        onClose={handleCloseDuplicateDialog}
        title={`Duplicate article`}
        content="Are you sure you want to duplicate this article?"
        onSubmit={handleDuplicateArticle}
        isLoading={duplicateArticle.isLoading}
      /> */}
      <MarkdownPreview
        open={openPreviewDialog}
        onClose={handleClosePreviewDialog}
        markdown={article.markdown}
        title={article.title}
        cover={article.cover.url}
      />
      <DataTableRow key={article._id} selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox color="primary" onChange={onSelect} checked={selected} />
        </TableCell>
        <TableCell>
          <Link href={`/articles/${article._id}`} underline="hover">
            {article.title}
          </Link>
        </TableCell>
        <TableCell>{article.slug}</TableCell>
        <TableCell>{article.category}</TableCell>
        <TableCell>{formatDate(article.createdAt)}</TableCell>
        <TableCell>
          <Label color={mappedColors[article.status]}>{article.status}</Label>
        </TableCell>
        <TableCell align="right">
          <ActionsIconButton items={actionItems} />
        </TableCell>
      </DataTableRow>
    </>
  );
};
