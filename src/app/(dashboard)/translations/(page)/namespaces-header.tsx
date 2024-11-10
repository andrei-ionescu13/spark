'use client';

import { ActionsItem } from '@/components/actions-menu';
import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { ArrowUpTray } from '@/icons/arrow-up-tray';
import { Download } from '@/icons/download';
import { Plus } from '@/icons/plus';
import { appFetch } from '@/utils/app-fetch';
import { download } from '@/utils/download';
import { useMutation } from '@tanstack/react-query';
import type { FC } from 'react';
import { toast } from 'react-toastify';
import { CreateNamespaceDialog } from './create-namespace-dialog';

interface NamespacesHeaderProps {}

export const useUploadTranslations = () =>
  useMutation<{}, Error>({
    mutationFn: () =>
      appFetch({
        url: `/translations/namespaces/upload`,
        config: {
          method: 'POST',
        },
        withAuth: true,
      }),
  });

export const NamespacesHeader: FC<NamespacesHeaderProps> = (props) => {
  const [
    openAddGroupDialog,
    handleOpenAddGroupDialog,
    handleCloseAddGroupDialog,
  ] = useDialog();
  const uploadTranslations = useUploadTranslations();

  const exportTranslations = async () => {
    const blob = await appFetch({
      url: '/translations/namespaces/export',
      responseType: 'blob',
      withAuth: true,
    });
    download(blob, 'translations.zip');
  };

  const actionItems: ActionsItem[] = [
    {
      label: 'Add',
      icon: Plus,
      onClick: handleOpenAddGroupDialog,
    },
    {
      label: 'Export',
      icon: Download,
      onClick: exportTranslations,
    },
    {
      label: 'Upload',
      icon: ArrowUpTray,
      onClick: () =>
        uploadTranslations.mutate(undefined, {
          onSuccess: () => {
            console.log('done');
            toast.success('Translations uploaded');
          },
        }),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Namespaces"
        actions={actionItems}
      />
      {openAddGroupDialog && (
        <CreateNamespaceDialog
          open
          onClose={handleCloseAddGroupDialog}
        />
      )}
    </div>
  );
};
