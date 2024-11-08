import { Box, Checkbox, TableCell, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import type { FC } from 'react';
import { ActionsItem } from '../../../components/actions-menu';
import { AlertDialog } from '../../../components/alert-dialog';
import { DataTableRow } from '../../../components/data-table-row';
import { ActionsIconButton } from '../../../components/icon-actions';
import { Link } from '../../../components/link';
import { useDialog } from '../../../hooks/useDialog';
import { Pencil as PencilIcon } from '../../../icons/pencil';
import { Trash as TrashIcon } from '../../../icons/trash';
import { ArticleTag } from '../../../types/article-tag';
import { useDeleteArticleTag } from './api';
import { TagUpdateDialog } from './tag-update-dialog';

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

interface TagsTableRowProps {
  articleTag: ArticleTag;
  onSelect: () => void;
  selected: boolean;
}

export const TagsTableRow: FC<TagsTableRowProps> = (props) => {
  const { articleTag, selected, onSelect } = props;
  const queryClient = useQueryClient();

  const [openDeleteDialog, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog();
  const [updateDialogOpen, handleOpenUpdateDialog, handleCloseUpdateDialog] =
    useDialog();

  const deleteArticleTag = useDeleteArticleTag(() =>
    queryClient.invalidateQueries({ queryKey: ['article-tags'] })
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
      label: 'Edit',
      icon: PencilIcon,
      onClick: handleOpenUpdateDialog,
    },
    {
      label: 'Delete',
      icon: TrashIcon,
      onClick: handleOpenDeleteDialog,
      color: 'error',
    },
  ];

  return (
    <>
      {updateDialogOpen && (
        <TagUpdateDialog
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
      <DataTableRow
        key={articleTag._id}
        selected={selected}
      >
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            onChange={onSelect}
            checked={selected}
          />
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
