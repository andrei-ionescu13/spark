import { useState } from 'react';
import type { FC } from 'react';
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useTheme
} from '@mui/material';
import { TranslationNamespaceDialog } from '@/components/translations/translation-namespace-dialog';
import { TranslationsTableRow } from '@/components/translations/translations-table-row';
import { ActionsItem } from '@/components/actions-menu';
import { AlertDialog } from '@/components/alert-dialog';
import { ActionsIconButton } from '@/components/icon-actions';
import { Link } from '@/components/link';
import { ChevronRight as ChevronRightIcon } from '@/icons/chevron-right';
import { Pencil as PencilIcon } from '@/icons/pencil';
import { Trash as TrashIcon } from '@/icons/trash';
import { Plus as PlusIcon } from '@/icons/plus';
import { useDialog } from '@/hooks/useDialog';
import type { Language, Namespace } from '@/types/translations';
import { TranslationsDialog } from '../translations-dialog';
import { useDeleteNamespace } from '@/api/translations';
import { useQueryClient } from '@tanstack/react-query';

interface NamespaceTableRowProps {
  namespace: Namespace;
  shownLanguages: Language[];
  languages: Language[];
}

export const NamespaceTableRow: FC<NamespaceTableRowProps> = (props) => {
  const { namespace, shownLanguages, languages } = props;
  const [editDialogOpen, handleOpenEditDialog, handleCloseEditDialog] = useDialog();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] = useDialog();
  const [addDialogOpen, handleOpenAddDialog, handleCloseAddDialog] = useDialog();
  const queryClient = useQueryClient();
  const deleteNamespace = useDeleteNamespace(() => queryClient.invalidateQueries({ queryKey: ['namespaces'] }));
  const [open, setOpen] = useState(false);
  const theme = useTheme()

  const openStyles = {
    "::after": {
      position: 'absolute',
      content: '""',
      top: '0px',
      left: '0px',
      backgroundColor: theme.palette.primary.main,
      width: '3px',
      height: 'calc(100%)',
    },
  }

  const handleClick = (): void => {
    setOpen((prevOpen) => !prevOpen);
  }

  const actionItems: ActionsItem[] = [
    {
      label: 'Edit',
      icon: PencilIcon,
      onClick: handleOpenEditDialog
    },
    {
      label: 'Add',
      icon: PlusIcon,
      onClick: handleOpenAddDialog
    },
    {
      label: 'Delete',
      icon: TrashIcon,
      onClick: handleOpenDeleteDialog,
      color: 'error'
    },
  ]

  const handleDeleteNamespace = () => {
    deleteNamespace.mutate(namespace._id, {
      onSuccess: () => {
        handleCloseDeleteDialog();
      }
    })
  }

  return (
    <>
      {editDialogOpen && (
        <TranslationNamespaceDialog
          open
          onClose={handleCloseEditDialog}
          mode="edit"
          namespace={namespace}
        />
      )}
      {addDialogOpen && (
        <TranslationsDialog
          languages={languages}
          onClose={handleCloseAddDialog}
          open
          namespaceId={namespace._id}
        />
      )}
      {deleteDialogOpen && (
        <AlertDialog
          open
          onClose={handleCloseDeleteDialog}
          title={`Delete ${namespace.name} namespace`}
          content="Are you sure you want to permanently this namespace?"
          onSubmit={handleDeleteNamespace}
          isLoading={deleteNamespace.isPending}
        />
      )}
      <TableRow
        key={namespace.name}
        sx={{
          position: 'relative',
          ...(open && openStyles),
          'td:first-of-type': {
            pl: 1
          }
        }}
      >
        <TableCell>
          <IconButton
            color="secondary"
            onClick={handleClick}
            sx={{ mr: 1.5 }}
          >
            <ChevronRightIcon
              sx={{ transform: open ? 'rotate(90deg)' : 'rotate(0)' }}
            />
          </IconButton>
          <Link
            href={`/translations/${namespace._id}`}
            color="inherit"
            underline="hover"
          >
            {namespace.name}
          </Link>
        </TableCell>
        <TableCell align="right">
          <ActionsIconButton items={actionItems} />
        </TableCell>
      </TableRow>
      {open && (
        <TableRow
          sx={{
            border: 'none',
            position: 'relative',
            ...(open && openStyles)
          }}
        >
          <TableCell
            colSpan={4}
            padding="none"
            sx={{ border: 'none' }}
          >
            <Box>
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      th: {
                        fontWeight: 600,
                        textTransform: 'uppercase'
                      }
                    }}
                  >
                    <TableCell>
                      Key
                    </TableCell>
                    {shownLanguages.map((language) => (
                      <TableCell key={language.code}>
                        {language.name}
                      </TableCell>
                    ))}
                    <TableCell align="right">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {namespace.translations.map((item) => (
                    <TranslationsTableRow
                      languages={languages}
                      namespaceId={namespace._id}
                      translation={item}
                      key={item.key}
                      shownLanguages={shownLanguages}
                    />
                  ))}
                </TableBody>
              </Table>
            </Box>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};