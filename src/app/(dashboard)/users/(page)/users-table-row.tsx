import { ActionsItem } from '@/components/actions-menu';
import { AlertDialog } from '@/components/alert-dialog';
import { DataTableRow } from '@/components/data-table-row';
import { ActionsIconButton } from '@/components/icon-actions';
import { Box, Checkbox, Link, TableCell, useTheme } from '@mui/material';
import type { FC } from 'react';
import { Label } from 'recharts';
import { useDialog } from '../../../hooks/useDialog';
import type { User } from '../../../types/user';
import { formatDate } from '../../../utils/format-date';

interface UsersTableRowProps {
  user: User;
  onSelect: () => void;
  selected: boolean;
}

export const UsersTableRow: FC<UsersTableRowProps> = (props) => {
  const { user, selected, onSelect } = props;
  const theme = useTheme();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog(false);
  const [banDialogOpen, handleOpenBanDialog, handleCloseBanDialog] =
    useDialog(false);

  const mappedColors = {
    active: theme.palette.success.main,
    banned: theme.palette.error.main,
    inactive: theme.palette.warning.main,
  };

  const actionItems: ActionsItem[] = [
    // {
    //   label: 'Send reset link',
    //   icon: KeyIcon,
    //   onClick: handleOpenBanDialog,
    // },
    // {
    //   label: 'Ban',
    //   icon: BanIcon,
    //   onClick: handleOpenBanDialog,
    // },
    // {
    //   label: 'Delete',
    //   icon: TrashIcon,
    //   onClick: handleOpenDeleteDialog,
    //   color: 'error.main'
    // }
  ];

  return (
    <>
      <AlertDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        title={`Delete user ${user._id}`}
        content="Are you sure you want to permanently delete this user?"
        onSubmit={() => {}}
        isLoading={false}
      />
      <AlertDialog
        open={banDialogOpen}
        onClose={handleCloseBanDialog}
        title={`Ban user ${user._id}`}
        content="Are you sure you want to ban this user?"
        onSubmit={() => {}}
        isLoading={false}
      />
      <DataTableRow selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            onChange={onSelect}
            checked={selected}
          />
        </TableCell>
        <TableCell>
          <Link
            underline="hover"
            href={`/users/${user._id}`}
          >
            {user._id}
          </Link>
        </TableCell>
        <TableCell>
          <Link
            color="textPrimary"
            variant="body1"
            underline="hover"
            href={`/users/${user._id}`}
          >
            {user.email}
          </Link>
        </TableCell>
        <TableCell>{formatDate(user.createdAt)}</TableCell>
        <TableCell>{user.ordersCount}</TableCell>
        <TableCell>{user.totalSpend}</TableCell>
        <TableCell>
          <Box>
            <Label color={mappedColors[user.status]}>{user.status}</Label>
          </Box>
        </TableCell>
        <TableCell align="right">
          <ActionsIconButton items={actionItems} />
        </TableCell>
      </DataTableRow>
    </>
  );
};
