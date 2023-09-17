import type { FC } from "react";
import { Box, Checkbox, TableCell, Typography, useTheme } from "@mui/material";
import { ActionsItem } from "@/components/actions-menu";
import { AlertDialog } from "@/components/alert-dialog";
import { ActionsIconButton } from "@/components/icon-actions";
import { Link } from "@/components/link";
import { Trash as TrashIcon } from "@/icons/trash";
import { Pencil as PencilIcon } from "@/icons/pencil";
import { useDialog } from "@/hooks/useDialog";
import { Label } from "@/components/label";
import { KeysUpdateDialog } from "./products/keys/keys-update-dialog";
import { formatDate } from "@/utils/format-date";
import { useDeleteKey } from "@/api/keys";
import type { Key } from "@/types/keys";
import { DataTableRow } from "./data-table-row";

interface UsersTableRowProps {
  productKey: Key;
  onSelect: () => void;
  selected: boolean;
  showProductCell?: boolean;
  refetch: () => Promise<any>;
}

export const KeysTableRow: FC<UsersTableRowProps> = (props) => {
  const {
    productKey: key,
    selected,
    onSelect,
    showProductCell = true,
    refetch,
  } = props;
  const theme = useTheme();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog(false);
  const [editDialogOpen, handleOpenEditDialog, handleCloseEditDialog] =
    useDialog(false);
  const deleteKey = useDeleteKey(refetch);

  const mappedStatusColors = {
    reported: theme.palette.error.main,
    revealed: theme.palette.success.main,
    secret: theme.palette.info.main,
  };

  const mappedAvailabilityColors = {
    available: theme.palette.success.main,
    unavailable: theme.palette.info.main,
  };

  const handleDeleteKey = () => {
    deleteKey.mutate(key._id, {
      onSuccess: () => {
        handleCloseDeleteDialog();
      },
    });
  };

  const actionItems: ActionsItem[] = [
    {
      label: "Edit",
      icon: PencilIcon,
      onClick: handleOpenEditDialog,
      disabled: key.status === "secret",
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
      <AlertDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        title={`Delete productKey ${key._id}`}
        content="Are you sure you want to permanently delete this productKey?"
        onSubmit={handleDeleteKey}
        isLoading={deleteKey.isLoading}
      />
      {editDialogOpen && (
        <KeysUpdateDialog
          onClose={handleCloseEditDialog}
          open
          productKey={key}
          refetch={refetch}
        />
      )}
      <DataTableRow selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox color="primary" onChange={onSelect} checked={selected} />
        </TableCell>
        <TableCell>
          <Typography color="textPrimary" variant="body1">
            {key.value}
          </Typography>
        </TableCell>
        {showProductCell && (
          <TableCell>
            <Link
              color="textPrimary"
              variant="body1"
              underline="hover"
              href={`/products/${key.product?._id}`}
            >
              {key.product?.title}
            </Link>
          </TableCell>
        )}
        <TableCell>{formatDate(key.createdAt)}</TableCell>
        <TableCell>
          <Box>
            <Label color={mappedAvailabilityColors[key.availability]}>
              {key.availability}
            </Label>
          </Box>
        </TableCell>
        <TableCell>
          <Box>
            <Label color={mappedStatusColors[key.status]}>{key.status}</Label>
          </Box>
        </TableCell>
        <TableCell align="right">
          <ActionsIconButton items={actionItems} />
        </TableCell>
      </DataTableRow>
    </>
  );
};
