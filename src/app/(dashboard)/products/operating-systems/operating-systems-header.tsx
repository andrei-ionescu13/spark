"use client"

import { PageHeader } from '@/components/page-header';
import { OperatingSystemCreateDialog } from '@/components/products/operating-systems/operating-system-create-dialog';
import { useDialog } from '@/hooks/useDialog';
import { Plus } from '@/icons/plus';
import type { FC } from 'react'

interface OperatingSystemsHeaderProps {

}

export const OperatingSystemsHeader: FC<OperatingSystemsHeaderProps> = (props) => {
  const [createDialogOpen, handleOpenCreateDialog, handleCloseCreateDialog] =
    useDialog();

  return (
    <>
      <PageHeader
        title="Operating Systems"
        action={{
          onClick: handleOpenCreateDialog,
          label: "Add",
          icon: Plus,
        }}
      />
      {createDialogOpen && (
        <OperatingSystemCreateDialog open onClose={handleCloseCreateDialog} />
      )}
    </>
  )
};
