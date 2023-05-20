import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { Link } from '@/components/link'

export const ToastItemCreated = (label: string, href?: string): ReactNode => {
  return (
    <Box>
      <Typography
        variant="body1"
        color="textPrimary"
      >
        {label}
        {" "}
        created
      </Typography>
      {href && (
        <Link
          color="textPrimary"
          href={href}
          underline="hover"
          variant="body1"
        >
          Go to the
          {" "}
          {label}
        </Link>
      )}
    </Box>
  )
}
