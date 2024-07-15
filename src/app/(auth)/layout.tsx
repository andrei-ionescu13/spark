import { Box } from "@mui/material"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
      }}
    >
      {children}
    </Box>
  )
}
