'use client';

import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { Plus } from '@/icons/plus';
import type { FC } from 'react';
import { DeveloperCreateDialog } from './developer-create-dialog';

interface DevelopersHeaderProps {}

export const DevelopersHeader: FC<DevelopersHeaderProps> = (props) => {
  const [createDialogOpen, handleOpenCreateDialog, handleCloseCreateDialog] =
    useDialog();

  return (
    <>
      <PageHeader
        title="Developer"
        action={{
          onClick: handleOpenCreateDialog,
          label: 'Add',
          icon: Plus,
        }}
      />
      {createDialogOpen && (
        <DeveloperCreateDialog open onClose={handleCloseCreateDialog} />
      )}
    </>
  );
};
