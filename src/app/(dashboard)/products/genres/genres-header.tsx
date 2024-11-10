'use client';

import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { Plus } from '@/icons/plus';
import { useQueryClient } from '@tanstack/react-query';
import type { FC } from 'react';
import { useCreateGenre } from './api';
import { GenreDialog } from './genre-dialog';

interface GenresHeaderProps {}

export const GenresHeader: FC<GenresHeaderProps> = () => {
  const queryClient = useQueryClient();
  const [addDialogOpen, handleOpenAddDialog, handleCloseAddDialog] =
    useDialog();

  const createGenre = useCreateGenre(() =>
    queryClient.invalidateQueries({ queryKey: ['genres'] })
  );

  const handleSubmit = (values: { name: string; slug: string }) => {
    createGenre.mutate(values, {
      onSuccess: () => {
        handleCloseAddDialog();
      },
    });
  };

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
          isPending={createGenre.isPending}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};
