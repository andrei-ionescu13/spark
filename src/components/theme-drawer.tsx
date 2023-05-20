import { alpha, Box, Drawer, Fab, Grid, IconButton, Typography } from '@mui/material';
import { Adjustments as AdjustmentsIcon } from '@/icons/adjustments';
import { useDialog } from '@/hooks/useDialog';
import { X as XIcon } from '@/icons/x';
import { Refresh as RefreshIcon } from '@/icons/refresh';
import { Sun as SunIcon } from '@/icons/sun';
import { Moon as MoonIcon } from '@/icons/moon';
import { CardButton } from './card-button';
import { useSettings } from '@/contexts/settings-context';
import { colors } from 'theme/colors';
import type { Preset } from 'theme/colors';


const presets: Preset[] = [
  'green',
  'purple',
  'lightBlue',
  'darkBlue',
  'yellow',
  'red',
]

export const ThemeDrawer = () => {
  const [dialogOpen, handleOpenDialog, handleCloseDialog] = useDialog();
  const { settings, updateSettings, restoreInitialSettings } = useSettings();

  const updateTheme = (newTheme: 'dark' | 'light'): void => {
    updateSettings({ ...settings, theme: newTheme })
  }

  const updatePreset = (newPreset: Preset): void => {
    updateSettings({ ...settings, preset: newPreset })
  }

  return (
    <>
      {!dialogOpen && (
        <Fab
          size="small"
          color="primary"
          onClick={handleOpenDialog}
          sx={{
            bottom: 64,
            right: 0,
            position: 'fixed',
            zIndex: 999999999,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          }}
        >
          <AdjustmentsIcon />
        </Fab>
      )}
      <Drawer
        onClose={handleCloseDialog}
        anchor="right"
        open={dialogOpen}
        PaperProps={{
          sx: {
            width: 256,
            m: 2,
            height: 'calc(100% - 32px)',
            borderRadius: 1,
            backdropFilter: 'blur(6px)',
            zIndex: 3123213,
            backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.82)
          }
        }}
        sx={{
          width: 256,
        }}
      >
        <Box
          sx={{
            m: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Typography
            color="textPrimary"
            variant="body1"
            sx={{ fontWeight: 600 }}
          >
            Settings
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            color="secondary"
            size="small"
            onClick={restoreInitialSettings}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
          <IconButton
            color="secondary"
            size="small"
            onClick={handleCloseDialog}
          >
            <XIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box sx={{ m: 2 }}>
          <Grid
            container
            spacing={4}
          >
            <Grid
              item
              xs={12}
            >
              <Typography
                color="textPrimary"
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  mb: 1.5
                }}
              >
                Mode
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 1
                }}
              >
                <CardButton
                  onClick={() => { updateTheme('light'); }}
                  sx={{
                    color: settings.theme === 'light' ? 'primary.main' : 'background.paper',
                    backgroundColor: '#fff'
                  }}
                >
                  <SunIcon sx={{ color: settings.theme === 'light' ? 'primary.main' : 'text.secondary' }} />
                </CardButton>
                <CardButton
                  onClick={() => { updateTheme('dark'); }}
                  sx={{
                    color: settings.theme === 'dark' ? 'primary.main' : 'background.paper',
                    backgroundColor: 'background.default'
                  }}
                >
                  <MoonIcon sx={{ color: settings.theme === 'dark' ? 'primary.main' : 'text.secondary' }} />
                </CardButton>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
            >
              <Typography
                color="textPrimary"
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  mb: 1.5
                }}
              >
                Presets
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: 1
                }}
              >
                {presets.map((preset) => {
                  const color = colors[preset].main;

                  return (
                    <CardButton
                      onClick={() => { updatePreset(preset) }}
                      key={preset}
                      sx={{
                        color: color,
                        backgroundColor: 'background.paper',
                        py: 1.75,
                        borderColor: preset === settings.preset ? color : undefined,
                        boxShadow: preset === settings.preset ? `${alpha(color, 0.24)} 0px 4px 8px 0px inset` : undefined
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: color,
                          width: 25,
                          height: 15,
                          borderRadius: '50%',
                          transform: preset === settings.preset ? 'rotate(-45deg)' : 'rotate(0)',
                          transition: '250ms',
                        }}
                      />
                    </CardButton>
                  )
                })}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Drawer>
    </>
  )
}
