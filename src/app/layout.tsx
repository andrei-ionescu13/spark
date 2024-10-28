import Providers from 'app/providers';
import { cookies } from 'next/headers'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies()
  const theme = cookieStore.get('theme')?.value
  const preset = cookieStore.get('preset')?.value

  return (
    <html lang="en">
      <body>
        <Providers
          theme={theme}
          preset={preset}
        >
          {children}
        </Providers>
      </body>
    </html>
  );
}

