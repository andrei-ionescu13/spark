import type { FC } from "react";
import { Box, Checkbox, TableCell, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { Trash as TrashIcon } from "../../../icons/trash";
import { useDialog } from "../../../hooks/useDialog";
import { ArticleCategory } from "../../../types/article-category";
import { Pencil as PencilIcon } from "../../../icons/pencil";
import { useDeleteArticleCategory } from "@/api/article-categories";
import Link from "@/components/link";
import { ActionsItem } from "@/components/actions-menu";
import { AlertDialog } from "@/components/alert-dialog";
import { CategoryUpdateDialog } from "app/(dashboard)/articles/categories/category-update-dialog";
import { DataTableRow } from "@/components/data-table-row";
import { ActionsIconButton } from "@/components/icon-actions";

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

interface CategoriesTableRowProps {
  articleCategory: ArticleCategory;
  onSelect: () => void;
  selected: boolean;
}

export const CategoriesTableRow: FC<CategoriesTableRowProps> = (props) => {
  const { articleCategory, selected, onSelect } = props;
  const queryClient = useQueryClient();
  const [openDeleteDialog, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog();

  const [updateDialogOpen, handleOpenUpdateDialog, handleCloseUpdateDialog] =
    useDialog();
  const deleteArticle = useDeleteArticleCategory(() =>
    queryClient.invalidateQueries({ queryKey: ["article-categories"] })
  );

  const handleDeleteArticle = () => {
    deleteArticle.mutate(articleCategory._id, {
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
        <CategoryUpdateDialog
          articleCategory={articleCategory}
          open
          onClose={handleCloseUpdateDialog}
        />
      )}
      <AlertDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        title="Delete article"
        content="Are you sure you want to delete this article?"
        onSubmit={handleDeleteArticle}
        isLoading={deleteArticle.isPending}
      />
      <DataTableRow key={articleCategory._id} selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox color="primary" onChange={onSelect} checked={selected} />
        </TableCell>
        <TableCell>{articleCategory.name}</TableCell>
        <TableCell>{articleCategory.slug}</TableCell>
        <TableCell align="right">
          <ActionsIconButton items={actionItems} />
        </TableCell>
      </DataTableRow>
    </>
  );
};
