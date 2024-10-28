import { PageHeader } from '@/components/page-header';
import { LanguageDialog } from 'app/(dashboard)/translations/languages/language-dialog';
import { useDialog } from '@/hooks/useDialog';
import { Plus } from '@/icons/plus';
import type { FC } from 'react'

interface LanguagesHeaderProps {

}

export const LanguagesHeader: FC<LanguagesHeaderProps> = (props) => {
  const [openDialog, handleOpenDialog, handleCloseDialog] = useDialog();

  return (
    <>
      <PageHeader
        title="Languages"
        action={{
          label: "Add",
          icon: Plus,
          onClick: handleOpenDialog,
        }}
      />
      {openDialog && <LanguageDialog open onClose={handleCloseDialog} />}
    </>
  )
};
