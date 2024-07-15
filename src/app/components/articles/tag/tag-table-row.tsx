import type { FC } from "react";
import { Box, Checkbox, TableCell, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { ActionsItem } from "../../actions-menu";
import { AlertDialog } from "../../alert-dialog";
import { ActionsIconButton } from "../../icon-actions";
import { Link } from "../../link";
import { Trash as TrashIcon } from "../../../icons/trash";
import { DataTableRow } from "../../data-table-row";
import { useDialog } from "../../../hooks/useDialog";
import { ArticleCategory } from "../../../types/article-category";
import { Pencil as PencilIcon } from "../../../icons/pencil";
import { useDeleteArticleCategory } from "@/api/article-categories";
import { ArticleCategoryUpdateDialog } from "../categories/category-update-dialog";
import { useDeleteArticleTag } from "@/api/article-tags";
import { ArticleTag } from "../../../types/article-tag";
import { ArticleTagUpdateDialog } from "./tag-update-dialog";

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

interface CategoryTableRowProps {
  articleTag: ArticleTag;
  onSelect: () => void;
  selected: boolean;
}

export const TagTableRow: FC<CategoryTableRowProps> = (props) => {
  const { articleTag, selected, onSelect } = props;
  const queryClient = useQueryClient();

  const [openDeleteDialog, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog();
  const [updateDialogOpen, handleOpenUpdateDialog, handleCloseUpdateDialog] =
    useDialog();

  const deleteArticleTag = useDeleteArticleTag(() =>
    queryClient.invalidateQueries({ queryKey: ["article-tags"] })
  );

  const handleDeleteArticleTag = () => {
    deleteArticleTag.mutate(articleTag._id, {
      onSuccess: () => {
        handleCloseDeleteDialog();
      },
    });
  };

  const actionItems: ActionsItem[] = [
    {
      label: "Edit",
      icon: PencilIcon,
      onClick: handleOpenUpdateDialog,
    },
    {
      label: "Delete",
      icon: TrashIcon,
      onClick: handleOpenDeleteDialog,
      color: "error",
    },
  ];

  return (
    <>
      {updateDialogOpen && (
        <ArticleTagUpdateDialog
          articleTag={articleTag}
          open
          onClose={handleCloseUpdateDialog}
        />
      )}
      <AlertDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        title="Delete article tag"
        content="Are you sure you want to delete this article tag?"
        onSubmit={handleDeleteArticleTag}
        isLoading={deleteArticleTag.isPending}
      />
      <DataTableRow key={articleTag._id} selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox color="primary" onChange={onSelect} checked={selected} />
        </TableCell>
        <TableCell>{articleTag.name}</TableCell>
        <TableCell>{articleTag.slug}</TableCell>
        <TableCell align="right">
          <ActionsIconButton items={actionItems} />
        </TableCell>
      </DataTableRow>
    </>
  );
};
