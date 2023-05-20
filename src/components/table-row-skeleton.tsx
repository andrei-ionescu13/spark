import type { FC } from 'react';
import { Checkbox, IconButton, Skeleton, TableCell, TableRow } from '@mui/material';
import { DotsVertical as DotsVerticalIcon } from '@/icons/dots-vertical';
import { Trash as TrashIcon } from '@/icons/trash';
import { generateArray } from '@/utils/generate-array';
import { Button } from '@/components/button';

interface SkeletonRowProps {
  height?: number;
  hasCheckbox?: boolean;
  hasActions?: boolean;
  hasAction?: boolean;
  hasDelete?: boolean;
  actionLabel?: string;
  cells: number;
}

export const TableRowSkeleton: FC<SkeletonRowProps> = (props) => {
  const {
    height = 69,
    cells,
    hasCheckbox = false,
    hasActions = false,
    hasAction = false,
    hasDelete = false,
    actionLabel
  } = props;

  return (
    <TableRow sx={{ height }}>
      {hasCheckbox && (
        <TableCell padding="checkbox">
          <Checkbox disabled />
        </TableCell>
      )}
      {generateArray(cells).map((x) => (
        <TableCell key={x}>
          <Skeleton
            variant="text"
            width="50%"
          />
        </TableCell>
      ))}
      {hasAction && (
        <TableCell align="right">
          <Button
            color="primary"
            disabled
            variant="contained"
          >
            {actionLabel}
          </Button>
        </TableCell>
      )}
      {hasDelete && (
        <TableCell align="right">
          <IconButton
            color="error"
            disabled
          >
            <TrashIcon />
          </IconButton>
        </TableCell>
      )}
      {hasActions && (
        <TableCell align="right">
          <IconButton
            color="primary"
            disabled
          >
            <DotsVerticalIcon />
          </IconButton>
        </TableCell>
      )}
    </TableRow>
  )
}