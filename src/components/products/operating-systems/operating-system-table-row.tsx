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
import { useDeleteOperatingSystem } from "@/api/operating-systems";
import { OperatingSystem } from "@/types/operating-sistem";
import { OperatingSystemUpdateDialog } from "./operating-system-update-dialog";

interface OperatingSystemTableRowProps {
  operatingSystem: OperatingSystem;
  onSelect: () => void;
  selected: boolean;
}

export const OperatingSystemTableRow: FC<OperatingSystemTableRowProps> = (
  props
) => {
  const { operatingSystem, selected, onSelect } = props;
  const queryClient = useQueryClient();

  const [openDeleteDialog, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog();
  const [updateDialogOpen, handleOpenUpdateDialog, handleCloseUpdateDialog] =
    useDialog();

  const deleteOperatingSystem = useDeleteOperatingSystem(() =>
    queryClient.invalidateQueries("operatingSystems")
  );

  const handleDeleteOperatingSystem = () => {
    deleteOperatingSystem.mutate(operatingSystem._id, {
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
        <OperatingSystemUpdateDialog
          OperatingSystem={operatingSystem}
          open
          onClose={handleCloseUpdateDialog}
        />
      )}
      <AlertDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        title="Delete operatingSystem"
        content="Are you sure you want to delete this operatingSystem?"
        onSubmit={handleDeleteOperatingSystem}
        isLoading={deleteOperatingSystem.isLoading}
      />
      <DataTableRow key={operatingSystem._id} selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox color="primary" onChange={onSelect} checked={selected} />
        </TableCell>
        <TableCell>{operatingSystem.name}</TableCell>
        <TableCell>{operatingSystem.slug}</TableCell>
        <TableCell align="right">
          <ActionsIconButton items={actionItems} />
        </TableCell>
      </DataTableRow>
    </>
  );
};
