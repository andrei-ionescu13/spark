import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { Plus } from '@/icons/plus';
import type { FC } from 'react';
import { LanguageDialog } from './language-dialog';

interface LanguagesHeaderProps {}

export const LanguagesHeader: FC<LanguagesHeaderProps> = (props) => {
  const [openDialog, handleOpenDialog, handleCloseDialog] = useDialog();

  return (
    <>
      <PageHeader
        title="Languages"
        action={{
          label: 'Add',
          icon: Plus,
          onClick: handleOpenDialog,
        }}
      />
      {openDialog && (
        <LanguageDialog
          open
          onClose={handleCloseDialog}
        />
      )}
    </>
  );
};
