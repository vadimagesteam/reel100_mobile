import twColors from 'tailwindcss/colors';

const baseColors = {
  white: '#fff',
  white1: '#fffefe',

  black: '#000',
  black1: '#1b1b1c',
  black2: '#535353',
  black3: '#101012',
  black4: '#111111',
  black5: '#413e39',
  blackOpacity20: 'rgba(0, 0, 0, 0.2)',
  blackOpacity40: 'rgba(0, 0, 0, 0.4)',
  blackOpacity15: 'rgba(0, 0, 0, 0.15)',
  blackOpacity35: 'rgba(0, 0, 0, 0.35)',

  silver: '#575757',
  silver1: '#ddd',
  silver2: '#808080',
  silver3: '#d9d7d6',
  silver4: '#b3b3b3',
  silver5: '#5c5d5d',
  silver6: '#727272',
  silverLight: '#F8F9FB',
  silver1Procent50: 'rgba(128, 128, 128, 0.5)',

  graphite: '#2f2f2f',

  green: '#1ECB99',
  green1: 'rgba(34, 156, 122, 1)',

  blue: '#2140a1',
  blue1: '#39bdc5',
  blue2: '#5F85BE',
  blue3: '#60bfc8',

  red: '#E95050',
  red1: '#f76f6f',
  red3: '#F51212',
  redLight: '#FFCCCB',
  yellow: '#FFFF00',

  pink600: '#db2777',

  orange: '#e1b034',
};

export const colors = {
  ...baseColors,

  // bg
  background: baseColors.black4,
  surface: baseColors.black1,

  // inputs
  input: twColors.zinc[800],

  // buttons
  'button-primary': baseColors.white,
  'button-primary-text': baseColors.black,
  'button-danger': baseColors.red,

  // text
  primary: baseColors.white,
  muted: '#888',
  accent: baseColors.blue2,
  danger: baseColors.red,
};
