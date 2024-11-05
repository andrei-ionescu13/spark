import type { Theme, ThemeOptions } from '@mui/material/styles';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import _ from 'lodash';
import { Star as StarIcon } from '../icons/star';
import { colors, Preset } from './colors';

const baseThemeOptions: ThemeOptions = {
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        tag: {
          marginBottom: 2,
          marginTop: 2,
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          minHeight: 60.5,
        },
        title: {
          fontSize: 16,
          fontWeight: 700,
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          marginLeft: 16,
          marginRight: 16,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          '&:last-child': {
            paddingBottom: 16,
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          height: '100%',
        },
        body: {
          height: '100%',
          width: '100%',
        },
        '#__next': {
          height: '100%',
          width: '100%',
        },
        '#nprogress': {
          '.bar': {
            zIndex: '9999999 !important',
            height: '4px !important',
            '.peg': {
              display: 'none',
            },
          },
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 700,
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          paddingTop: '20px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0,
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: 20,
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'hover',
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'initial',
        },
      },
    },
    MuiRating: {
      defaultProps: {
        icon: <StarIcon />,
        emptyIcon: <StarIcon />,
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Lato", sans-serif',
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
    h1: {
      lineHeight: 1.2,
      fontWeight: 600,
    },
    h2: {
      lineHeight: 1.2,
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h4: {
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h5: {
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h6: {
      lineHeight: 1.2,
    },
    body1: {},
    body2: {},
    subtitle1: {
      fontWeight: 600,
    },
    subtitle2: {
      fontWeight: 600,
    },
    overline: {
      lineHeight: 1.2,
    },
    caption: {
      lineHeight: 1.2,
    },
  },
};

const lightThemeOptions: ThemeOptions = {
  components: {
    MuiButton: {
      styleOverrides: {
        outlinedSecondary: {
          '&:hover': {
            backgroundColor: '#FF8552',
            color: '#EBF4FF',
          },
        },
        outlinedPrimary: {
          '&:hover': {
            backgroundColor: '#1E4582',
            color: '#EBF4FF',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        filled: {
          '&:hover': {
            backgroundColor: '#EBF4FF',
            color: '#1E4582',
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          '&::-webkit-scrollbar': {
            width: 10,
          },
          '&::-webkit-scrollbar-track': {
            background: '#fff',
          },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: 12,
            backgroundColor: 'rgba(211, 211, 211, 0.36)',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        underlineAlways: {
          textDecorationColor: '#6D7791 !important',
        },
        underlineHover: {
          textDecorationColor: '#6D7791 !important',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            background: 'rgba(145, 158, 171, 0.12)',
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgb(244, 246, 248)',
          th: {
            color: 'rgb(99, 115, 129)',
            borderBottom: 'none',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(211, 211, 211, 0.36)',
        },
      },
    },
  },
  palette: {
    background: {
      default: '#fff',
      paper: '#fff',
    },
    divider: 'rgba(211, 211, 211, 0.36)',
    mode: 'light',
    text: {
      secondary: 'rgb(99, 115, 129)',
      primary: 'rgb(33, 43, 54)',
    },
    secondary: {
      dark: '#000',
      main: '#000',
    },
    primary: {
      contrastText: '#fff',
      dark: '#1C3F77',
      main: '#1E4582',
    },
  },
  shadows: [
    'none',
    'rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px',
    '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
    '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
    '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
    '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
    '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
    '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
    '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
    '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
    '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
    '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
    '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
    '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
    '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
    '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
    '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
    '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
    '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)',
  ],
};

const darkThemeOptions: ThemeOptions = {
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        clearIndicator: {
          color: 'rgba(255, 255, 255, 0.23)',
        },
        popupIndicator: {
          color: 'rgba(255, 255, 255, 0.23)',
        },
        tag: {
          '&:hover': {
            backgroundColor: 'inherit',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        filled: {
          '&:hover': {
            backgroundColor: '#EBF4FF',
            color: '#1E4582',
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          '&::-webkit-scrollbar': {
            width: 10,
          },
          '&::-webkit-scrollbar-track': {
            background: '#080b14',
          },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: 12,
            backgroundColor: '#252b37',
          },
        },
        body: {
          '.Toastify__toast': {
            background: '#0d1321',
            color: '#fff',
            '.Toastify__close-button': {
              color: '#fff',
            },
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        underlineAlways: {
          textDecorationColor: '#6D7791 !important',
        },
        underlineHover: {
          textDecorationColor: '#6D7791 !important',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            background: '#252b37',
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#252b37',
          th: {
            color: '#b6b8bc',
            borderBottom: 'none',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#252b37',
        },
      },
    },
  },
  palette: {
    background: {
      default: '#080b14',
      paper: '#0d1321',
    },
    divider: '#252b37',
    mode: 'dark',
    text: {
      secondary: '#b6b8bc',
      primary: '#edf6f9',
    },
    secondary: {
      contrastText: '#fff',
      dark: '#fff',
      main: '#fff',
    },
    primary: {
      contrastText: '#fff',
      dark: '#C4134E',
      main: '#EC407A',
    },
  },
  shadows: [
    'none',
    'rgba(0, 0, 0, 0.2) 0px 0px 2px 0px, rgba(0, 0, 0, 0.12) 0px 12px 24px -4px',
    '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
    '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
    '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
    '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
    '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
    '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
    '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
    '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
    '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
    '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
    '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
    '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
    '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
    '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
    '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
    '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
    '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)',
  ],
};

export const createCustomTheme = (
  themeMode: 'light' | 'dark',
  preset: Preset
): Theme => {
  let themeOptions =
    themeMode === 'light' ? lightThemeOptions : darkThemeOptions;

  if (!themeOptions) {
    console.warn(new Error(`The theme ${themeMode} is not valid`));
    themeOptions = lightThemeOptions;
  }

  const theme = responsiveFontSizes(
    createTheme(
      _.merge(baseThemeOptions, themeOptions, {
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              '.apexcharts-tooltip': {
                background: '#252b37 !important',
                border: '1px solid #252b37 !important',
                color: '#edf6f9 !important',
              },
              '.apexcharts-tooltip-title': {
                background: '#252b37 !important',
                color: '#edf6f9 !important',
                borderBottom: '1px solid #252b37 !important',
              },
              '#nprogress': {
                '.bar': {
                  background: `${colors[preset].main} !important`,
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              containedPrimary: {
                boxShadow: `${colors[preset].main} 0px 0px 12px 0px`,
              },
            },
          },
          MuiFab: {
            styleOverrides: {
              primary: {
                boxShadow: `${colors[preset].main} 0px 0px 12px 0px`,
              },
            },
          },
        },
        palette: {
          primary: colors[preset],
        },
      })
    )
  );

  return theme;
};
