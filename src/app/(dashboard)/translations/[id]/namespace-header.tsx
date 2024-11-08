import { ActionsItem } from '@/components/actions-menu';
import { AlertDialog } from '@/components/alert-dialog';
import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { Plus } from '@/icons/plus';
import { Trash } from '@/icons/trash';
import { Language, Namespace } from '@/types/translations';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { TranslationsDialog } from '../(page)/translations-dialog';
import { useDeleteNamespace } from '../api-calls';

interface NamespaceHeaderProps {
  namespace?: Namespace;
  languages?: Language[];
}

export const NamespaceHeader: FC<NamespaceHeaderProps> = (props) => {
  const { namespace, languages } = props;
  const [addDialogOpen, handleOpenAddDialog, handleCloseAddDialog] =
    useDialog();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog();
  const deleteNamespace = useDeleteNamespace();
  const queryClient = useQueryClient();
  const { push } = useRouter();

  const actionItems: ActionsItem[] = [
    {
      label: 'Add',
      icon: Plus,
      onClick: handleOpenAddDialog,
    },
    {
      label: 'Delete',
      icon: Trash,
      onClick: handleOpenDeleteDialog,
      color: 'error',
    },
  ];

  const handleDeleteNamespace = () => {
    namespace &&
      deleteNamespace.mutate(namespace._id, {
        onSuccess: async () => {
          await push('/translations');
          queryClient.invalidateQueries({ queryKey: ['namespace'] });
        },
      });
  };

  return (
    <>
      {addDialogOpen && namespace && languages && (
        <TranslationsDialog
          onClose={handleCloseAddDialog}
          open
          namespaceId={namespace._id}
          languages={languages}
        />
      )}
      {deleteDialogOpen && (
        <AlertDialog
          open
          onClose={handleCloseDeleteDialog}
          title={`Delete ${namespace?.name} namespace`}
          content="Are you sure you want to permanently this namespace?"
          onSubmit={handleDeleteNamespace}
          isLoading={deleteNamespace.isPending}
        />
      )}
      <PageHeader
        title={`${namespace?.name} namespace`}
        actions={actionItems}
        backHref="/translations"
        backLabel="Namespaces"
      />
    </>
  );
};
