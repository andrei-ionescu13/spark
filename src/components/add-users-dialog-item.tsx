import type { FC } from 'react';
import {
  Box,
  Checkbox,
  ListItem,
  Typography,
  useTheme,
  alpha
} from '@mui/material'
import type { User } from '@/types/user';

interface AddUsersDialogItemProps {
  user: User;
  selected?: boolean;
  onSelect: any;
}

export const AddUsersDialogItem: FC<AddUsersDialogItemProps> = (props) => {
  const { user: user, selected = false, onSelect } = props;

  return (
    <ListItem
      onClick={() => { onSelect(user) }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 2,
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        cursor: 'pointer',
        backgroundColor: (theme) => selected ? alpha(theme.palette.primary.main, 0.12) : undefined,
        '&:hover': {
          backgroundColor: (theme) => selected ? alpha(theme.palette.primary.main, 0.12) : (theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.04)')
        }
      }}
    >
      <Checkbox
        color="primary"
        checked={selected}
        disableRipple
      />
      <Box>
        <Typography
          color="textPrimary"
          variant="body1"
        >
          {user.email}
        </Typography>
      </Box>
    </ListItem>
  )
}