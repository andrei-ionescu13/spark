"use client"

import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { Plus } from '@/icons/plus';
import type { FC } from 'react'
import { ArticleCategoryCreateDialog } from './category-create-dialog';

interface CategoriesHeaderProps {
}

export const CategoriesHeader: FC<CategoriesHeaderProps> = () => {
  const [createDialogOpen, handleOpenCreateDialog, handleCloseCreateDialog] = useDialog();

  return (
    <div>
      <PageHeader
        title="Categories"
        action={{
          onClick: handleOpenCreateDialog,
          label: "Add",
          icon: Plus,
        }}
      />
      {createDialogOpen && (
        <ArticleCategoryCreateDialog open onClose={handleCloseCreateDialog} />
      )}
    </div>
  )
};
