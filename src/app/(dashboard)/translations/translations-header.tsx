"use client"

import { ActionsItem } from '@/components/actions-menu';
import { PageHeader } from '@/components/page-header';
import { TranslationNamespaceDialog } from '@/components/translations/translation-namespace-dialog';
import { useDialog } from '@/hooks/useDialog';
import { Download } from '@/icons/download';
import { Plus } from '@/icons/plus';
import { appFetch } from '@/utils/app-fetch';
import { download } from '@/utils/download';
import type { FC } from 'react'

interface TranslationsHeaderProps {

}

export const TranslationsHeader: FC<TranslationsHeaderProps> = (props) => {
  const [
    openAddGroupDialog,
    handleOpenAddGroupDialog,
    handleCloseAddGroupDialog,
  ] = useDialog();

  const exportTranslations = async () => {
    const blob = await appFetch({
      url: "/namespaces/export",
      responseType: "blob",
      withAuth: true,
    });
    download(blob, "translations.zip");
  };

  const actionItems: ActionsItem[] = [
    {
      label: "Add",
      icon: Plus,
      onClick: handleOpenAddGroupDialog,
    },
    {
      label: "Export",
      icon: Download,
      onClick: exportTranslations,
    },
  ];

  return (
    <div>
      <PageHeader title="Namespaces" actions={actionItems} />
      {openAddGroupDialog && (
        <TranslationNamespaceDialog open onClose={handleCloseAddGroupDialog} />
      )}
    </div>
  )
};
