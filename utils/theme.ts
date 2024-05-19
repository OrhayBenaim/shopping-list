import {
  border,
  createTheme,
  useTheme as restyleUseTheme,
} from '@shopify/restyle';

const palette = {
  purpleLight: '#8C6FF7',
  purplePrimary: '#5A31F4',
  purpleDark: '#3F22AB',

  greenLight: '#56DCBA',
  greenPrimary: '#26AE60',
  greenDark: '#0A906E',

  black: '#0B0B0B',
  white: '#fff',
  offWhite: '#f4f4f4',
  borderWhite: '#ccc',
  gray: '#888',
};

const theme = createTheme({
  colors: {
    mainBackground: palette.white,
    secondaryBackground: palette.gray,
    primaryAction: palette.greenPrimary,
    border: palette.borderWhite,
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  textVariants: {
    header: {
      fontWeight: 'bold',
      fontSize: 34,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
    },
    defaults: {
      // We can define a default text variant here.
    },
  },
  tag: {
    normal: {
      button: {
        backgroundColor: palette.offWhite,
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: palette.borderWhite,
      },
      text: {
        fontSize: 16,
      },
    },

    selected: {
      text: {
        fontSize: 16,
        color: palette.white,
        fontWeight: 'bold',
      },
      button: {
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: palette.greenPrimary,
        backgroundColor: palette.greenPrimary,
      },
    },
  },
});

export type Theme = typeof theme;

export const useTheme = () => restyleUseTheme<Theme>();
export default theme;
