"use client"

import type { FC } from "react";
import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import { NavbarLanguageMenu } from "./navbar-language-menu";
import { NavbarLogoutButton } from "./navbar-logout-button";
import { Burger as BurgerIcon } from "../icons/burger";
import { useLayout } from "app/(dashboard)/layout-context";
import { NavbarSidebarButton } from "./navbar-sidebar-button";

interface NavbarProps { }

export const Navbar: FC<NavbarProps> = () => {

  return (
    <AppBar
      elevation={0}
      sx={{
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        backgroundColor: "background.paper",
      }}
    >
      <Toolbar
        sx={{
          alignItems: "center",
          display: "flex",
          height: 64,
          left: {
            xs: 0,
            lg: "270px",
          },
          width: {
            xs: "100vw",
            lg: "calc(100vw - 270px)",
          },
        }}
      >
        <NavbarSidebarButton />
        <Box sx={{ flexGrow: 1 }} />
        <Box
          sx={{
            alignItems: "center",
            display: "grid",
            gridAutoFlow: "column",
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
