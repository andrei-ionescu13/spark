import type { FC } from 'react';
import { TableCell, TableRow } from "@mui/material";
import type { TableRowProps } from "@mui/material";
import { TranslationsDialog } from "@/components/translations/translations-dialog";
import { ActionsItem } from '@/components/actions-menu';
import { AlertDialog } from "@/components/alert-dialog";
import { ActionsIconButton } from "@/components/icon-actions";
import { Pencil as PencilIcon } from '@/icons/pencil';
import { Trash as TrashIcon } from '@/icons/trash';
import { useDialog } from "@/hooks/useDialog";
import type { Language, Translation } from "@/types/translations";
import { useDeleteNamespaceTranslation } from '@/api/translations';
import { useQueryClient } from 'react-query';

interface TranslationsTableRowProps extends TableRowProps {
  translation: Translation;
  shownLanguages: Language[];
  languages: Language[];
  namespaceId: string;
}

export const TranslationsTableRow: FC<TranslationsTableRowProps> = (props) => {
  const { translation, shownLanguages, namespaceId, languages } = props;
  const queryClient = useQueryClient();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] = useDialog();
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();
  const deleteNamespaceTranslation = useDeleteNamespaceTranslation();

  const handleDelete = async () => {
    deleteNamespaceTranslation.mutate({
      id: namespaceId,
      translationKey: translation.key
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries('namespaces')
        queryClient.invalidateQueries('namespace')
        handleCloseDeleteDialog();
      }
    })
  };

  const actionItems: ActionsItem[] = [
    {
      label: 'Edit',
      icon: PencilIcon,
      onClick: handleOpenDialog
    },
    {
      label: 'Delete',
      icon: TrashIcon,
      onClick: handleOpenDeleteDialog,
      color: 'error'
    },
  ]

  return (
    <>
      <AlertDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        title={`Delete translations for ${translation.key}`}
        content="Are you sure you want to permanently delete these translations?"
        onSubmit={handleDelete}
        isLoading={false}
      />
      {dialogOpen && (
        <TranslationsDialog
          languages={languages}
          translation={translation}
          onClose={handleCloseDialog}
          open
          mode="edit"
          namespaceId={namespaceId}
        />
      )}
      <TableRow key={translation.key}>
        <TableCell>
          {translation.key}
        </TableCell>
        {shownLanguages.map((language) => (
          <TableCell key={language.code}>
            {translation?.[language.code]}
          </TableCell>
        ))}
        <TableCell align="right">
          <ActionsIconButton items={actionItems} />
        </TableCell>
      </TableRow>
    </>
  )
}