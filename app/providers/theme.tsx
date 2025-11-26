"use client";

import { createTheme } from "@mui/material/styles";

import { PaletteColorOptions } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    basic: Palette["primary"];
  }
  interface PaletteOptions {
    basic?: PaletteColorOptions;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    basic: true;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#030213",
    },
  },

  components: {},
});

export default theme;
