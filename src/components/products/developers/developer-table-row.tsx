import type { FC } from "react";
import { Box, Checkbox, TableCell, Typography } from "@mui/material";
import { useQueryClient } from "react-query";
import { ActionsItem } from "@/components/actions-menu";
import { AlertDialog } from "@/components/alert-dialog";
import { ActionsIconButton } from "@/components/icon-actions";
import { Link } from "@/components/link";
import { Trash as TrashIcon } from "@/icons/trash";
import { DataTableRow } from "@/components/data-table-row";
import { useDialog } from "@/hooks/useDialog";
import { Pencil as PencilIcon } from "@/icons/pencil";
import { useDeleteDeveloper } from "@/api/developers";
import { Developer } from "@/types/developer";
import { DeveloperUpdateDialog } from "./developer-update-dialog";

interface DeveloperTableRowProps {
  developer: Developer;
  onSelect: () => void;
  selected: boolean;
}

export const DeveloperTableRow: FC<DeveloperTableRowProps> = (props) => {
  const { developer, selected, onSelect } = props;
  const queryClient = useQueryClient();

  const [openDeleteDialog, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog();
  const [updateDialogOpen, handleOpenUpdateDialog, handleCloseUpdateDialog] =
    useDialog();

  const deleteDeveloper = useDeleteDeveloper(() =>
    queryClient.invalidateQueries("developers")
  );

  const handleDeleteDeveloper = () => {
    deleteDeveloper.mutate(developer._id, {
      onSuccess: () => {
        handleCloseDeleteDialog();
      },
    });
  };

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

  return (
    <>
      {updateDialogOpen && (
        <DeveloperUpdateDialog
          Developer={developer}
          open
          onClose={handleCloseUpdateDialog}
        />
      )}
      <AlertDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        title="Delete developer"
        content="Are you sure you want to delete this developer?"
        onSubmit={handleDeleteDeveloper}
        isLoading={deleteDeveloper.isLoading}
      />
      <DataTableRow key={developer._id} selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox color="primary" onChange={onSelect} checked={selected} />
        </TableCell>
        <TableCell>{developer.name}</TableCell>
        <TableCell>{developer.slug}</TableCell>
        <TableCell align="right">
          <ActionsIconButton items={actionItems} />
        </TableCell>
      </DataTableRow>
    </>
  );
};
