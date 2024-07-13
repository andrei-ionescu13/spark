import type { AppProps } from "next/app";
import { CacheProvider } from "@emotion/react";
import type { EmotionCache } from "@emotion/react";
import Head from "next/head";
import createEmotionCache from "createEmotionCache";
import { useState } from "react";
import { HydrationBoundary, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createCustomTheme } from "theme";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { ThemeDrawer } from "@/components/theme-drawer";
import { Layout } from "@/components/layout";
import { ToastContainer } from "react-toastify";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { withSettings } from "hocs/withSettings";
import { getSession } from "@/utils/get-session";
import App from "next/app";
import { getCookie } from "cookies-next";
import { Theme, useSettings } from "@/contexts/settings-context";
import { Preset } from "theme/colors";
import "react-toastify/dist/ReactToastify.css";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  theme?: Theme;
  preset?: Preset;
  admin?: any;
}

Router.events.on("routeChangeStart", () => {
  NProgress.start();
});
Router.events.on("routeChangeComplete", () => {
  NProgress.done();
});
Router.events.on("routeChangeError", () => {
  NProgress.done();
});
NProgress.configure({ showSpinner: false });

const clientSideEmotionCache = createEmotionCache();

const MyApp = (props: MyAppProps) => {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
    admin,
  } = props;
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 3000,
          },
        },
      })
  );

  const { settings } = useSettings();
  const theme = createCustomTheme(settings.theme, settings.preset);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <HydrationBoundary state={pageProps.dehydratedState}>
          <ThemeProvider theme={theme}>
            <ToastContainer
              theme={settings.theme}
              closeOnClick={false}
              pauseOnHover={false}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <ThemeDrawer />
              <CssBaseline />
              <Layout admin={admin}>
                <Component {...pageProps} />
              </Layout>
            </LocalizationProvider>
          </ThemeProvider>
        </HydrationBoundary>
      </QueryClientProvider>
    </CacheProvider>
  );
};

const FinalApp = withSettings(MyApp);

FinalApp.getInitialProps = async (appContext) => {
  const { ctx } = appContext;
  const appProps = await App.getInitialProps(appContext);

  const admin = await getSession(ctx.req, ctx.res);

  if (ctx.res && ctx.asPath === "/login" && !!admin) {
    ctx.res.writeHead(302, {
      Location: "/",
    });
    ctx.res.end();
    return {};
  } else if (ctx.res && ctx.asPath !== "/login" && !admin) {
    ctx.res.writeHead(302, {
      Location: "/login",
    });
    ctx.res.end();
    return {};
  }

  return {
    ...appProps,
    theme: getCookie("theme", ctx),
    preset: getCookie("preset", ctx),
    admin,
  };
};
FinalApp.displayName = "FinalApp";

export default FinalApp;
