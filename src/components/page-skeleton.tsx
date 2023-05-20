import type { FC } from 'react';
import { Skeleton } from '@mui/material';
import type { SkeletonProps } from '@mui/material';

export const PageSkeleton: FC<SkeletonProps> = (props) => (
  <Skeleton
    height={250}
    sx={{ borderRadius: 1 }}
    variant="rectangular"
    width="100%"
    {...props}
  />
);