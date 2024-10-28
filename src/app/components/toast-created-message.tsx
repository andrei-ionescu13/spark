import type { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from './link';

interface ToastCreatedMessageProps {
  title: string;
  subheader: string;
  href: string;
}

export const ToastCreatedMessage: FC<ToastCreatedMessageProps> = (props) => {
  const { title, subheader, href } = props;

  return (
    <Box>
      <Typography
        variant="body1"
        color="textPrimary"
      >
        {title}
      </Typography>
      <Link
        color="textSecondary"
        href={href}
        underline="hover"
        variant="body1"
      >
        {subheader}
      </Link>
    </Box>
  )
}