import type { FC } from "react";
import { Checkbox, TableCell } from "@mui/material";
import { useQueryClient } from "react-query";
import { ActionsItem } from "@/components/actions-menu";
import { AlertDialog } from "@/components/alert-dialog";
import { ActionsIconButton } from "@/components/icon-actions";
import { Trash as TrashIcon } from "@/icons/trash";
import { Pencil as PencilIcon } from "@/icons/pencil";
import { useDialog } from "@/hooks/useDialog";
import { GenreDialog } from "./genre-dialog";
import { useDeleteGenre } from "@/api/genres";
import { DataTableRow } from "@/components/data-table-row";
import { Language } from "@/types/translations";

interface UsersTableRowProps {
  genre: any;
  onSelect: () => void;
  selected: boolean;
  shownLanguages: Language[];
}

export const GenresTableRow: FC<UsersTableRowProps> = (props) => {
  const { genre, selected, onSelect, shownLanguages } = props;
  const queryClient = useQueryClient();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog();
  const [updateDialogOpen, handleOpenUpdateDialog, handleCloseUpdateDialog] =
    useDialog();
  const deleteGenre = useDeleteGenre(() =>
    queryClient.invalidateQueries("genres")
  );

  const actionItems: ActionsItem[] = [
    {
      label: "Edit",
      icon: PencilIcon,
      onClick: handleOpenUpdateDialog,
    },
    {
      label: "Delete",
      icon: TrashIcon,
      onClick: handleOpenDeleteDialog,
      color: "error",
    },
  ];

  const handleDeleteGenre = () => {
    deleteGenre.mutate(genre._id, {
      onSuccess: () => {
        handleCloseDeleteDialog();
      },
    });
  };

  return (
    <>
      <GenreDialog
        open={updateDialogOpen}
        onClose={handleCloseUpdateDialog}
        mode="edit"
        genre={genre}
      />
      <AlertDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        title={`Delete genre ${genre.id}`}
        content="Are you sure you want to permanently delete this genre?"
        onSubmit={handleDeleteGenre}
        isLoading={deleteGenre.isLoading}
      />
      <DataTableRow selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox color="primary" onChange={onSelect} checked={selected} />
        </TableCell>
        <TableCell>{genre.name}</TableCell>
        {shownLanguages.map((language) => (
          <TableCell key={language.code}>
            {genre.tanslations?.[language.code]}
          </TableCell>
        ))}
        <TableCell align="right">
          <ActionsIconButton items={actionItems} />
        </TableCell>
      </DataTableRow>
    </>
  );
};
