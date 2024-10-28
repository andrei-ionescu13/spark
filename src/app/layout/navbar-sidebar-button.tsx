"use client"

import { Burger } from '@/icons/burger';
import { IconButton } from '@mui/material';
import { useLayout } from 'app/(dashboard)/layout-context';
import type { FC } from 'react'

interface NavbarSidebarButtonProps { }

export const NavbarSidebarButton: FC<NavbarSidebarButtonProps> = (props) => {
  const { handleSidebarOpen } = useLayout();


  return (
    <IconButton
      onClick={handleSidebarOpen}
      sx={{
        display: {
          sx: "inline-flex",
          lg: "none",
        },
      }}
    >
      <Burger />
    </IconButton>
  )
};
