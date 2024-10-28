import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { Plus } from '@/icons/plus';
import type { FC } from 'react';
import { CurrencyDialog } from './currency-dialog';

interface CurrenciesHeaderProps {}

export const CurrenciesHeader: FC<CurrenciesHeaderProps> = () => {
  const [openDialog, handleOpenDialog, handleCloseDialog] = useDialog();

  return (
    <>
      <PageHeader
        title="Currencies"
        action={{
          label: 'Add',
          icon: Plus,
          onClick: handleOpenDialog,
        }}
      />
      {openDialog && <CurrencyDialog open onClose={handleCloseDialog} />}
    </>
  );
};
