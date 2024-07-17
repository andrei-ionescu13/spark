"use client"
import type { FC, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Box } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { useDialog } from 'app/hooks/useDialog';
import Providers from 'app/providers';
import { Navbar } from './layout/navbar';
import { Sidebar } from './layout/sidebar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

