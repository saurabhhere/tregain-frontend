import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  typography: {
    fontFamily: `"Inter", "Helvetica", "Arial", sans-serif`,
  },
  palette: {
    primary: {
      background: "#e0e0e0",
      main: "#0E4160",
      white: "#FFFFFF",
      black: "#000"
    },
    secondary: {
      main: "#63AE49",
    },
    typography: {
      fontFamily: `"Inter", "Helvetica", "Arial", sans-serif`,
    },
  },
  home: {
    primary: {
      background: "#061144",
      main: "#f3f4f7",
      grey: "#76839c",
      darkGrey: "#77767A",
      figmaBlue: "#1E577A"
    },
    secondary: {
      background: "#f3f4f7",
      blueButtonBg: "#4D77FA",
    },
  },
});
