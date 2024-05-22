import { createTheme, useTheme as restyleUseTheme } from "@shopify/restyle";

const palette = {
  offWhite: "#f0eded",
  border: "#3B4A3F",
  greenPrimary: "#26AE60",
  blueLight: "#00ABF6",
  bluePrimary: "#0077BD",
  white: "#FFFFFF",
  red: "#c63535",
};

const theme = createTheme({
  colors: {
    mainBackground: palette.white,
    secondaryBackground: palette.offWhite,
    primaryAction: palette.greenPrimary,
    secondaryActionLight: palette.blueLight,
    secondaryAction: palette.bluePrimary,
    border: palette.border,
    dangerAction: palette.red,
    lightText: palette.white,
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  textVariants: {
    header: {
      fontWeight: "bold",
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
        backgroundColor: palette.white,
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: palette.border,
      },
      text: {
        fontSize: 16,
      },
    },

    selected: {
      text: {
        fontSize: 16,
        color: palette.white,
        fontWeight: "bold",
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
