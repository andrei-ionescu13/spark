"use client"

import { CssBaseline, ThemeProvider } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { FC, ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'
import { ThemeDrawer } from './components/theme-drawer'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { SettingsProvider, useSettings } from './contexts/settings-context';
import { createCustomTheme } from './theme';
import { StyledComponentsRegistry } from './styled-components-registry';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import "react-toastify/dist/ReactToastify.css";


function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
        gcTime: 0
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

interface ProvidersProps {
  children: ReactNode;
  theme?: string;
  preset?: string;
}

const ProvidersWithSettings: FC<ProvidersProps> = (props) => {
  const { children } = props;
  const { settings } = useSettings();
  const theme = createCustomTheme(settings.theme, settings.preset);

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer
        theme={settings.theme}
        closeOnClick={false}
        pauseOnHover={false}
      />
      {children}
    </ThemeProvider>
  )
}

const Providers: FC<ProvidersProps> = (props) => {
  const { children, theme, preset } = props;
  const queryClient = getQueryClient()

  return (
    <StyledComponentsRegistry>
      <AppRouterCacheProvider>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <SettingsProvider
            theme={theme}
            preset={preset}
          >
            <ProvidersWithSettings>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <ThemeDrawer />
                <CssBaseline />
                {children}
              </LocalizationProvider>
            </ProvidersWithSettings>
          </SettingsProvider>
        </QueryClientProvider>
      </AppRouterCacheProvider>
    </StyledComponentsRegistry>
  )
}

export default Providers