'use client';

import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { Plus } from '@/icons/plus';
import type { FC } from 'react';
import { PublisherDialog } from './publisher-dialog';

interface PublishersHeaderProps {}

export const PublishersHeader: FC<PublishersHeaderProps> = (props) => {
  const [addDialogOpen, handleOpenAddDialog, handleCloseAddDialog] =
    useDialog();

  return (
    <>
      <PageHeader
        title="Publishers"
        action={{
          label: 'Add publisher',
          icon: Plus,
          onClick: handleOpenAddDialog,
        }}
      />
      {addDialogOpen && (
        <PublisherDialog
          open
          onClose={handleCloseAddDialog}
        />
      )}
    </>
  );
};
