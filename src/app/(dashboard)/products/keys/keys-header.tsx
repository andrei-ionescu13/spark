'use client';

import { ActionsItem } from '@/components/actions-menu';
import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { Download } from '@/icons/download';
import { Key } from '@/icons/key';
import type { FC } from 'react';
import { KeyAddDialog } from './key-add-dialog';
import { KeysImportDialog } from './keys-import-dialog';

interface KeysHeaderProps {}

export const KeysHeader: FC<KeysHeaderProps> = (props) => {
  const [addKeyDialogOpen, handleOpenAddKey, handleCloseAddKey] = useDialog();
  const [importKeysDialogOpen, handleOpenImportKeys, handleCloseImportKeys] =
    useDialog(false);

  const actionItems: ActionsItem[] = [
    {
      label: 'Add key',
      icon: Key,
      onClick: handleOpenAddKey,
    },
    {
      label: 'Import',
      icon: Download,
      onClick: handleOpenImportKeys,
    },
  ];

  return (
    <>
      <PageHeader title="Keys" actions={actionItems} />
      {addKeyDialogOpen && <KeyAddDialog onClose={handleCloseAddKey} open />}
      <KeysImportDialog
        open={importKeysDialogOpen}
        onClose={handleCloseImportKeys}
      />
    </>
  );
};
