import type { FC, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { Box } from '@mui/material';
import { Sidebar } from 'layout/sidebar';
import { Navbar } from 'layout/navbar';
import { useDialog } from '@/hooks/useDialog';

interface LayoutProps {
  admin?: any;
  children?: ReactNode;
}

export const Layout: FC<LayoutProps> = (props) => {
  const { admin, children } = props;
  const { pathname } = useRouter();
  const [sidebarOpen, handleSidebarOpen, handleSidebarClose] = useDialog()

  if (pathname == "/login") {
    return (
      <Box
        sx={{
          display: 'flex',
          height: '100%',
        }}
      >
        {children}
      </Box>
    );
  }

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
  );
};
