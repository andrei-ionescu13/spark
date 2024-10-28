'use client';

import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { Plus } from '@/icons/plus';
import type { FC } from 'react';
import { GenreDialog } from './genre-dialog';

interface GenresHeaderProps {}

export const GenresHeader: FC<GenresHeaderProps> = (props) => {
  const [addDialogOpen, handleOpenAddDialog, handleCloseAddDialog] =
    useDialog();

  return (
    <>
      <PageHeader
        title="Genres"
        action={{
          label: 'Add genre',
          icon: Plus,
          onClick: handleOpenAddDialog,
        }}
      />
      {addDialogOpen && (
        <GenreDialog
          open
          onClose={handleCloseAddDialog}
        />
      )}
    </>
  );
};
