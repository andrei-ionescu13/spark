import type { FC } from "react";
import { Checkbox, colors, TableCell, useTheme } from "@mui/material";
import { ActionsItem } from "./actions-menu";
import { AlertDialog } from "./alert-dialog";
import { ActionsIconButton } from "./icon-actions";
import { Link } from "./link";
import { useDialog } from "../hooks/useDialog";
import { Label } from "./label";
import type { Order } from "../types/orders";
import { formatDate } from "../utils/format-date";
import { DataTableRow } from "./data-table-row";

interface OrdersTableRowProps {
  order: Order;
  onSelect: () => void;
  selected: boolean;
  showCustomer?: boolean;
}

export const OrdersTableRow: FC<OrdersTableRowProps> = (props) => {
  const { order, selected, onSelect, showCustomer = true } = props;
  const theme = useTheme();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog(false);
  const [banDialogOpen, handleOpenBanDialog, handleCloseBanDialog] =
    useDialog(false);

  const mappedColors = {
    open: theme.palette.success.main,
    canceled: theme.palette.error.main,
    archived: colors.grey[500],
  };

  const actionItems: ActionsItem[] = [];

  return (
    <>
      <AlertDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        title={`Delete user ${order._id}`}
        content="Are you sure you want to permanently delete this user?"
        onSubmit={() => { }}
        isLoading={false}
      />
      <AlertDialog
        open={banDialogOpen}
        onClose={handleCloseBanDialog}
        title={`Ban user ${order._id}`}
        content="Are you sure you want to ban this user?"
        onSubmit={() => { }}
        isLoading={false}
      />
      <DataTableRow selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox color="primary" onChange={onSelect} checked={selected} />
        </TableCell>
        <TableCell>
          <Link underline="hover" href={`/orders/${order.orderNumber}`}>
            {order.orderNumber}
          </Link>
        </TableCell>
        {showCustomer && (
          <TableCell>
            <Link
              color="textPrimary"
              variant="inherit"
              underline="hover"
              href={`/users/${order.customer._id}`}
            >
              {order.email}
            </Link>
          </TableCell>
        )}
        <TableCell>{formatDate(new Date(order.createdAt))}</TableCell>
        <TableCell>{order.totalPrice}</TableCell>
        <TableCell>{order.paymentStatus}</TableCell>
        <TableCell>{order.fulfillmentStatus}</TableCell>
        <TableCell>
          <Label color={mappedColors[order.status]}>{order.status}</Label>
        </TableCell>
        <TableCell align="right">
          <ActionsIconButton items={actionItems} />
        </TableCell>
      </DataTableRow>
    </>
  );
};
