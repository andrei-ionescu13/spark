import { AlertDialog } from '@/components/alert-dialog';
import { DataTable } from '@/components/data-table';
import { DataTableHead, HeadCell } from '@/components/data-table-head';
import { SearchInput } from '@/components/search-input';
import { useDialog } from '@/hooks/useDialog';
import { useQueryValue } from '@/hooks/useQueryValue';
import { useSearch } from '@/hooks/useSearch';
import { User } from '@/types/user';
import {
  Box,
  Button,
  Card,
  MenuItem,
  TableBody,
  TextField,
} from '@mui/material';
import { ChangeEvent, useState, type FC } from 'react';
import { UsersTableRow } from './users-table-row';

interface UsersTableProps {
  users?: User[];
  count?: number;
  isError: boolean;
  isLoading: boolean;
  refetch: any;
}

const headCells: HeadCell[] = [
  {
    id: 'id',
    label: 'Id',
    width: '22%',
  },
  {
    id: 'email',
    label: 'Email',
    width: '25%',
  },
  {
    id: 'createdAt',
    label: 'Created At',
    width: '12%',
  },
  {
    id: 'ordersCount',
    label: 'Total orders',
    width: '12%',
  },
  {
    id: 'totalSpend',
    label: 'Total spend',
    width: '12%',
  },
  {
    id: 'status',
    label: 'Status',
    width: '12%',
  },
];

const statusOptions = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Inactive',
    value: 'inactive',
  },
  {
    label: 'Banned',
    value: 'banned',
  },
];

export const UsersTable: FC<UsersTableProps> = (props) => {
  const { users, count, isError, isLoading, refetch } = props;
  const [keyword, handleKeywordChange, handleSearch] = useSearch();
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useQueryValue('status', 'all', 'all');
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();

  const handleStatusChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setStatus(event.target.value);
  };

  const handleSelect = (id: string): void => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((_id) => _id !== id);
      }

      return [...prevSelected, id];
    });
  };

  const handleSelectAll = (): void => {
    if (!users) return;

    setSelected((prevSelected) => {
      if (prevSelected.length === users?.length) {
        return [];
      }

      return users?.map((user) => user._id);
    });
  };

  return (
    <>
      <Card>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              sm: `${!!selected.length ? 'auto' : ''} 1fr 240px`,
            },
            p: 2,
          }}
        >
          {!!selected.length && (
            <Button
              color="error"
              onClick={handleOpenDialog}
              variant="contained"
            >
              Bulk Delete {selected.length}
            </Button>
          )}
          <form onSubmit={handleSearch}>
            <SearchInput
              onChange={handleKeywordChange}
              placeholder="Search users..."
              value={keyword}
            />
          </form>
          <TextField
            select
            id="status"
            label="Status"
            onChange={handleStatusChange}
            value={status}
          >
            {statusOptions.map((status) => (
              <MenuItem
                key={status.value}
                value={status.value}
              >
                {status.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <DataTable
          isLoading={isLoading}
          count={count}
          hasError={isError}
          hasNoData={count === 0}
          headCellsCount={headCells.length}
          onRefetchData={refetch}
          headSlot={
            <DataTableHead
              isLoading={isLoading}
              headCells={headCells}
              selectedLength={selected.length}
              itemsLength={users?.length}
              onSelectAll={handleSelectAll}
            />
          }
        >
          <TableBody>
            {users?.map((user) => (
              <UsersTableRow
                user={user}
                key={user._id}
                onSelect={() => {
                  handleSelect(user._id);
                }}
                selected={selected.includes(user._id)}
              />
            ))}
          </TableBody>
        </DataTable>
      </Card>

      <AlertDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        title={`Delete multiple users`}
        content="Are you sure you want to permanently delete these user?"
        onSubmit={handleCloseDialog}
        isLoading={false}
      />
    </>
  );
};
