import { useState } from 'react'
import type { FC, ChangeEvent, ReactNode } from 'react'
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  Typography,
} from '@mui/material'
import { appFetch } from '@/utils/app-fetch';
import { Button } from '@/components/button';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { SearchInput } from '@/components/search-input';
import { Box } from '@mui/system';
import type { User } from '@/types/user';
import { AddUsersDialogItem } from './add-users-dialog-item';

interface GetUsersData {
  users: User[];
  count: number;
}

const getUsers = (query: Record<string, any>) => () => appFetch<GetUsersData>({
  url: '/users/search',
  query,
  withAuth: true
})

interface AddUsersDialogProps {
  open: boolean;
  onClose: any;
  onAdd: any;
  selectedUsers: User[];
}

export const AddUsersDialog: FC<AddUsersDialogProps> = (props) => {
  const { open, onClose, onAdd, selectedUsers: selectedUsersProp = [] } = props;
  const [keyword, setKeyword] = useState('');
  const { error, data, isLoading } = useQuery({
    queryKey: ['users', { keyword }],
    queryFn: getUsers({ keyword }),
    placeholderData: keepPreviousData
  });
  const users = data?.users || [];
  const [selectedUsers, setSelectedUsers] = useState<User[]>(selectedUsersProp);

  const handleKeywordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setKeyword(event.target.value)
  }

  const handleUserSelect = (user: User): void => {
    if (selectedUsers.map((user) => user._id).includes(user._id)) {
      setSelectedUsers((prevUsers) => prevUsers.filter((_user) => _user._id !== user._id))
      return;
    }

    setSelectedUsers((prevUsers) => ([...prevUsers, user]))
  }

  const getContent = (): ReactNode => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'grid', placeItems: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      )
    }

    if (!!users.length) {
      return (
        <List disablePadding>
          {users.map((user) => (
            <AddUsersDialogItem
              key={user._id}
              user={user}
              onSelect={handleUserSelect}
              selected={selectedUsers.map((user) => user._id).includes(user._id)}
            />
          ))}
        </List>
      )
    }

    return (
      <Box sx={{ p: 2 }}>
        <Typography
          color="textSecondary"
          variant="body2"
        >
          No results found for &quot;
          {keyword}
          &quot;
        </Typography>
      </Box>
    )
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Add users
      </DialogTitle>
      <DialogContent sx={{ px: 0 }}>
        <Box sx={{ px: 2, pb: 2 }}>
          <form onSubmit={() => { }}>
            <SearchInput
              onChange={handleKeywordChange}
              placeholder="Search users..."
              value={keyword}
            />
          </form>
        </Box>
        <Divider />
        {getContent()}
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          onClick={onClose}
          variant="text"
        >
          Cancel
        </Button>
        <Button
          autoFocus
          color="primary"
          onClick={() => { onAdd(selectedUsers); onClose(); }}
          variant="contained"
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};