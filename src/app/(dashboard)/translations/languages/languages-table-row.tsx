import { ActionsItem } from "@/components/actions-menu";
import { DataTableRow } from "@/components/data-table-row";
import { ActionsIconButton } from "@/components/icon-actions";
import { useDialog } from "@/hooks/useDialog";
import { Trash } from "@/icons/trash";
import { Language } from "@/types/translations";
import { TableCell, Checkbox } from "@mui/material";
import { FC } from "react";

interface LanguagesTableRowProps {
  language: Language;
  onSelect: () => void;
  selected: boolean;
}

export const LanguagesTableRow: FC<LanguagesTableRowProps> = (props) => {
  const { language, selected, onSelect } = props;
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog();

  const actionItems: ActionsItem[] = [
    {
      label: 'Delete',
      icon: Trash,
      onClick: handleOpenDeleteDialog,
      color: 'error'
    }
  ]

  return (
    <>
      {/* <LanguagesDeleteDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        language={language}
      /> */}
      <DataTableRow selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            onChange={onSelect}
            checked={selected}
          />
        </TableCell>
        <TableCell>{language.name}</TableCell>
        <TableCell>{language.nativeName}</TableCell>
        <TableCell>{language.code}</TableCell>
        <TableCell align="right">
          <ActionsIconButton items={actionItems} />
        </TableCell>
      </DataTableRow>
    </>
  );
};