"use client"
import { ElementType, FC, forwardRef } from 'react'
import { alpha, Box, Button as MatButton, CircularProgress, styled } from '@mui/material'
import type { ButtonProps as MatButtonProps } from '@mui/material'

interface ButtonRoot extends MatButtonProps {
  isLoading?: boolean;
}

const ButtonRoot = styled(({ isLoading, ...props }: ButtonRoot) => (
  <MatButton {...props} />
))<ButtonRoot>(({ theme, isLoading, variant }) => ({
  position: 'relative',
  '&.Mui-disabled ': {
    backgroundColor: isLoading && variant === 'contained' && alpha(theme.palette.primary.main, 0.36)
  },
  div: {
    '&:first-of-type': {
      visibility: isLoading && 'hidden'
    }
  }
}))

interface ButtonProps extends MatButtonProps {
  isLoading?: boolean;
  component?: ElementType;
}

export const Button: FC<ButtonProps> = forwardRef((props, ref) => {
  const { isLoading = false, disabled, children, ...rest } = props;

  return (
    <ButtonRoot
      ref={ref}
      isLoading={isLoading}
      disabled={disabled || isLoading}
      {...rest}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {children}
      </Box>
      {isLoading && <CircularProgress size={24} color="primary" sx={{ position: 'absolute' }} thickness={4.2} />}
    </ButtonRoot >
  )
})
Button.displayName = "Button"
