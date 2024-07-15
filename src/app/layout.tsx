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

// interface LayoutProps {
//   admin?: any;
//   children?: ReactNode;
// }

// export default function Layout(props: LayoutProps) {
//   const { admin, children } = props;
//   const pathname = usePathname();
//   const [sidebarOpen, handleSidebarOpen, handleSidebarClose] = useDialog()

//   const getContent = () => {
//     if (pathname == "/login") {
//       return (
//         <Box
//           sx={{
//             display: 'flex',
//             height: '100%',
//           }}
//         >
//           <AppRouterCacheProvider>
//             {children}
//           </AppRouterCacheProvider>
//         </Box>
//       );
//     }

//     return (
//       <Box
//         sx={{
//           display: 'flex',
//           height: '100%',
//           width: '100%',
//         }}
//       >
//         <Sidebar
//           admin={admin}
//           open={sidebarOpen}
//           onClose={handleSidebarClose}
//         />
//         <Box sx={{
//           flex: 1,
//           display: 'flex',
//           flexDirection: 'column',
//           pt: 8,
//           background: 'background.default',
//           height: '100%',
//           width: '100%',
//         }}
//         >
//           <Navbar onSidebarOpen={handleSidebarOpen} />
//           {children}
//         </Box>
//       </Box>
//     )
//   }



//   return (
//     <html lang="en">
//       <body>
//         <Providers>
//           {getContent()}
//         </Providers>
//       </body>
//     </html>
//   );
// };
