"use client"

import { createContext, useContext, useState } from "react";
import type { FC, ReactNode } from "react";
import { appFetch } from "../utils/app-fetch";
import { useDialog } from "@/hooks/useDialog";


interface LayoutContextValue {
  sidebarOpen: boolean;
  handleSidebarOpen: () => void;
  handleSidebarClose: () => void;
}

export const LayoutContext = createContext<LayoutContextValue>({
  sidebarOpen: false,
  handleSidebarOpen: () => { },
  handleSidebarClose: () => { },
});

interface LayoutProviderProps {
  children?: ReactNode;
}

export const LayoutProvider: FC<LayoutProviderProps> = (props) => {
  const { children } = props;
  const [sidebarOpen, handleSidebarOpen, handleSidebarClose] = useDialog()

  return (
    <LayoutContext.Provider
      value={{
        sidebarOpen,
        handleSidebarOpen,
        handleSidebarClose
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export const useLayout = () => useContext(LayoutContext);
