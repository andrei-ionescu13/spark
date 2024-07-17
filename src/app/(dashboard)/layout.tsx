"use client"
import { Box } from '@mui/material';
import { useDialog } from 'app/hooks/useDialog';
import { Navbar } from 'app/layout/navbar';
import { Sidebar } from 'app/layout/sidebar';

export default function DashboardLayout({
  children,
  admin
}: Readonly<{
  children: React.ReactNode;
  //change
  admin: any;
}>) {
  const [sidebarOpen, handleSidebarOpen, handleSidebarClose] = useDialog()

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        width: '100%',
      }}
    >
      <Sidebar
        admin={admin}
        open={sidebarOpen}
        onClose={handleSidebarClose}
      />
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        pt: 8,
        background: 'background.default',
        height: '100%',
        width: '100%',
      }}
      >
        <Navbar onSidebarOpen={handleSidebarOpen} />
        {children}
      </Box>
    </Box>
  )
}
