import type { FC } from 'react'
import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { Plus } from '@/icons/plus';

interface TagsHeaderProps {
}

export const TagsHeader: FC<TagsHeaderProps> = (props) => {
  const [createDialogOpen, handleOpenCreateDialog, handleCloseCreateDialog] =
    useDialog();

  return (
    <>
      <PageHeader
        title="Tags"
        action={{
          onClick: handleOpenCreateDialog,
          label: "Add",
          icon: Plus,
        }}
      />
      {/* {createDialogOpen && (
        <ArticleTagCreateDialog open onClose={handleCloseCreateDialog} />
      )} */}
    </>
  )
};
