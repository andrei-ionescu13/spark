"use client"

import type { FC } from 'react'
import { PageHeader } from '@/components/page-header';
import { PlatformDialog } from '@/components/products/platforms/platform-dialog';
import { Plus } from '@/icons/plus';
import { useDialog } from '@/hooks/useDialog';

interface PlatformsHeaderProps {

}

export const PlatformsHeader: FC<PlatformsHeaderProps> = (props) => {
  const [addDialogOpen, handleOpenAddDialog, handleCloseAddDialog] = useDialog();

  return (
    <>
      <PageHeader
        title="Platforms"
        action={{
          label: "Add",
          icon: Plus,
          onClick: handleOpenAddDialog,
        }}
      />
      {addDialogOpen && <PlatformDialog open onClose={handleCloseAddDialog} />}
    </>
  )
};
