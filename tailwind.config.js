/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';
export const content = ['./src/**/*.{html,tsx}'];
export const theme = {
  colors: {
    transparent: 'transparent',
    current: 'currentColor',
    white: colors.white,
    slate: colors.slate,
    sky: colors.sky,
    text: colors.sky[950],
    red: colors.red,
    button: {
      DEFAULT: colors.sky[500],
      hover: colors.red[600],
    },
    ship: {
      active: colors.sky[500],
      disabled: colors.slate[300],
    },
    missed: {
      active: colors.sky[300],
      disabled: colors.slate[300],
    },
    hit: {
      active: colors.red[600],
      disabled: colors.slate[300],
    },
    sunk: {
      active: colors.sky[950],
      disabled: colors.slate[300],
    },
  },
  extend: {},
};
// eslint-disable-next-line @typescript-eslint/no-var-requires
export const plugins = [require('tailwind-scrollbar')({ nocompatible: true })];
