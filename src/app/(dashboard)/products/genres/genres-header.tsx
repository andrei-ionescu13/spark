"use client"

import { PageHeader } from '@/components/page-header';
import { GenreDialog } from '@/components/products/genres/genre-dialog';
import { useDialog } from '@/hooks/useDialog';
import { Plus } from '@/icons/plus';
import type { FC } from 'react'

interface GenresHeaderProps {

}

export const GenresHeader: FC<GenresHeaderProps> = (props) => {
  const [addDialogOpen, handleOpenAddDialog, handleCloseAddDialog] = useDialog();

  return (
    <>
      <PageHeader
        title="Genres"
        action={{
          label: "Add genre",
          icon: Plus,
          onClick: handleOpenAddDialog,
        }}
      />
      {addDialogOpen && <GenreDialog open onClose={handleCloseAddDialog} />}
    </>
  )
};
