import type { FC } from 'react'
import { List, styled } from '@mui/material'
import type { ListProps } from '@mui/material';

const InfoListRoot = styled(List)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2.5),
  width: '100%'
}))

export const InfoList: FC<ListProps> = (props) => {
  return (
    <InfoListRoot
      disablePadding
      {...props}
    />
  )
}
