'use client';

import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { Plus } from '@/icons/plus';
import type { FC } from 'react';
import { PlatformDialog } from './platform-dialog';

interface PlatformsHeaderProps {}

export const PlatformsHeader: FC<PlatformsHeaderProps> = (props) => {
  const [addDialogOpen, handleOpenAddDialog, handleCloseAddDialog] =
    useDialog();

  return (
    <>
      <PageHeader
        title="Platforms"
        action={{
          label: 'Add',
          icon: Plus,
          onClick: handleOpenAddDialog,
        }}
      />
      {addDialogOpen && (
        <PlatformDialog
          open
          onClose={handleCloseAddDialog}
        />
      )}
    </>
  );
};
