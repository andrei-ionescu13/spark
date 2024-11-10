'use client';

import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { Plus } from '@/icons/plus';
import type { FC } from 'react';
import { CreateOperatingSystemDialog } from './create-operating-system-dialog';

interface OperatingSystemsHeaderProps {}

export const OperatingSystemsHeader: FC<OperatingSystemsHeaderProps> = () => {
  const [createDialogOpen, handleOpenCreateDialog, handleCloseCreateDialog] =
    useDialog();

  return (
    <>
      <PageHeader
        title="Operating Systems"
        action={{
          onClick: handleOpenCreateDialog,
          label: 'Add',
          icon: Plus,
        }}
      />
      {createDialogOpen && (
        <CreateOperatingSystemDialog
          open
          onClose={handleCloseCreateDialog}
        />
      )}
    </>
  );
};
