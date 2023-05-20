export type Preset = 'green' | 'purple' | 'lightBlue' | 'darkBlue' | 'yellow' | 'red';
export type Shades = 'lighter' | 'light' | 'main' | 'dark' | 'darker';

export const colors: Record<Preset, Record<Shades, string>> = {
  green: {
    lighter: '#C8FACD',
    light: '#5BE584',
    main: '#00AB55',
    dark: '#007B55',
    darker: '#005249'
  },
  purple: {
    lighter: '#EBD6FD',
    light: '#B985F4',
    main: '#7635dc',
    dark: '#431A9E',
    darker: '#200A69'
  },
  lightBlue: {
    lighter: '#D1FFFC',
    light: '#76F2FF',
    main: '#1CCAFF',
    dark: '#0E77B7',
    darker: '#053D7A'
  },
  darkBlue: {
    lighter: '#D1E9FC',
    light: '#76B0F1',
    main: '#2065D1',
    dark: '#103996',
    darker: '#061B64'
  },
  yellow: {
    lighter: '#FEF4D4',
    light: '#FED680',
    main: '#FDA92D',
    dark: '#B66816',
    darker: '#793908'
  },
  red: {
    lighter: '#FFE3D5',
    light: '#FFC1AC',
    main: '#FF3030',
    dark: '#B71833',
    darker: '#7A0930'
  }
}
