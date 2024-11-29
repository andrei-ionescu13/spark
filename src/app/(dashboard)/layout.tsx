// import { getSession } from '@/utils/get-session';
import { getSession } from '@/utils/get-session';
import { Box } from '@mui/material';
import { Navbar } from 'app/layout/navbar';
import { Sidebar } from 'app/layout/sidebar';
import { LayoutProvider } from './layout-context';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const admin = await getSession();

  return (
    <LayoutProvider>
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          width: '100%',
          scrollbarGutter: 'stable',
          overflow: 'auto',
        }}
      >
        <Sidebar admin={admin} />
        <Navbar />
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            pt: 8,
            background: 'background.default',
            height: '100%',
            width: '100%',
            pl: {
              lg: '270px',
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </LayoutProvider>
  );
}
