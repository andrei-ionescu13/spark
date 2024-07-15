import type { FC } from 'react';
import { Box, MenuItem, Select } from '@mui/material'
import type { SelectProps } from '@mui/material'

interface BulletProps {
  color: string;
}

export const Bullet: FC<BulletProps> = (props) => {
  const { color } = props;

  return (
    <Box
      sx={{
        width: '6px',
        height: '6px',
        backgroundColor: color,
        borderRadius: '50%',
      }}
    />
  )
}

export interface StatusOption {
  color: string;
  value: string;
  label: string;
}

interface StatusSelectProps extends SelectProps {
  options: StatusOption[];
}

export const StatusSelect: FC<StatusSelectProps> = (props) => {
  const { options, ...rest } = props;

  return (
    <Select {...rest}>
      {options.map((option) => (
        <MenuItem
          value={option.value}
          key={option.value}
          color={option.color}
        >
          <Box
            sx={{
              display: 'grid',
              gridAutoFlow: 'column',
              gap: 1,
              alignItems: 'center',
              justifyContent: 'start',
              lineHeight: 1.4
            }}
          >
            <Bullet color={option.color} />
            {option.label}
          </Box>
        </MenuItem>
      ))}
    </Select>
  )
}