"use client"

import { PageHeader } from '@/components/page-header';
import { FeatureCreateDialog } from '@/components/products/features/feature-create-dialog';
import { useDialog } from '@/hooks/useDialog';
import { Plus } from '@/icons/plus';
import type { FC } from 'react'

interface FeaturesHeaderProps {

}

export const FeaturesHeader: FC<FeaturesHeaderProps> = (props) => {
  const [createDialogOpen, handleOpenCreateDialog, handleCloseCreateDialog] =
    useDialog();

  return (
    <>
      <PageHeader
        title="Feature"
        action={{
          onClick: handleOpenCreateDialog,
          label: "Add",
          icon: Plus,
        }}
      />
      {createDialogOpen && (
        <FeatureCreateDialog open onClose={handleCloseCreateDialog} />
      )}
    </>
  )
};
