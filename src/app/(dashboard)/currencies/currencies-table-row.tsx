import { AlertDialog } from '@/components/alert-dialog';
import { useDialog } from '@/hooks/useDialog';
import { Trash } from '@/icons/trash';
import { Currency } from '@/types/currencies';
import { IconButton, TableCell, TableRow } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { FC } from 'react';
import { useDeleteCurrency } from './api';

interface CurrenciesTableRowProps {
  currency: Currency;
}

export const CurrenciesTableRow: FC<CurrenciesTableRowProps> = (props) => {
  const { currency } = props;
  const queryClient = useQueryClient();
  const deleteLanguage = useDeleteCurrency(() =>
    queryClient.invalidateQueries({ queryKey: ['currencies'] })
  );
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog();

  const handleDeleteLanguage = () => {
    deleteLanguage.mutate(currency._id, {
      onSuccess: () => {
        handleCloseDeleteDialog();
      },
    });
  };

  return (
    <>
      <TableRow key={currency._id}>
        <TableCell>{currency.name}</TableCell>
        <TableCell>{currency.code}</TableCell>
        <TableCell>{currency.symbol}</TableCell>
        <TableCell align="right">
          <IconButton
            color="error"
            onClick={handleOpenDeleteDialog}
          >
            <Trash />
          </IconButton>
        </TableCell>
      </TableRow>
      <AlertDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        title={`Delete ${currency.name} currency`}
        content="Are you sure you want to permanently delete this language?"
        onSubmit={handleDeleteLanguage}
        isLoading={deleteLanguage.isPending}
      />
    </>
  );
};
