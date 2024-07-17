"use client"

import { PageHeader } from '@/components/page-header';
import { PublisherDialog } from '@/components/products/publishers/publisher-dialog';
import { useDialog } from '@/hooks/useDialog';
import { Plus } from '@/icons/plus';
import type { FC } from 'react'

interface PublishersHeaderProps {

}

export const PublishersHeader: FC<PublishersHeaderProps> = (props) => {
  const [addDialogOpen, handleOpenAddDialog, handleCloseAddDialog] =
    useDialog();

  return (
    <>
      <PageHeader
        title="Publishers"
        action={{
          label: "Add publisher",
          icon: Plus,
          onClick: handleOpenAddDialog,
        }}
      />
      {addDialogOpen && <PublisherDialog open onClose={handleCloseAddDialog} />}

    </>
  )
};
