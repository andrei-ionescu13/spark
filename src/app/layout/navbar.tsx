'use client';

import { AppBar, Box, Toolbar } from '@mui/material';
import type { FC } from 'react';
import { NavbarLogoutButton } from './navbar-logout-button';
import { NavbarSidebarButton } from './navbar-sidebar-button';

interface NavbarProps {}

export const Navbar: FC<NavbarProps> = () => {
  return (
    <AppBar
      elevation={0}
      sx={{
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        backgroundColor: 'background.paper',
      }}
    >
      <Toolbar
        sx={{
          alignItems: 'center',
          display: 'flex',
          height: 64,
          pl: {
            xs: 0,
            lg: 'calc(270px + 24px)',
          },
        }}
      >
        <NavbarSidebarButton />
        <Box sx={{ flexGrow: 1 }} />
        <Box
          sx={{
            alignItems: 'center',
            display: 'grid',
            gridAutoFlow: 'column',
            gap: 1,
          }}
        >
          {/* <NavbarLanguageMenu /> */}
          <NavbarLogoutButton />
        </Box>
      </Toolbar>
    </AppBar>
  );
};
