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
      main: "#004785",
      contrastText: "#fff",
    },
    basic: {
      main: "#757575",
      contrastText: "#757575",
    },
  },

  components: {
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: "16px 24px 0",
        },
      },
    },
  },
});

export default theme;
