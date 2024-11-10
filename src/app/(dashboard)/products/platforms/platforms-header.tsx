'use client';

import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { Plus } from '@/icons/plus';
import { useQueryClient } from '@tanstack/react-query';
import type { FC } from 'react';
import { CreatePlatformDialog } from './create-platform-dialog';

interface PlatformsHeaderProps {}

export const PlatformsHeader: FC<PlatformsHeaderProps> = (props) => {
  const queryClient = useQueryClient();
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
        <CreatePlatformDialog
          open
          onClose={handleCloseAddDialog}
        />
      )}
    </>
  );
};
