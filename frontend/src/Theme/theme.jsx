import { createTheme } from "@mui/material/styles";

const Theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
    info: {
      main: "#999999",
    },
    neutral: {
      main: "#666666",
      light: "#cccccc",
      dark: "#000000",
    },
    background: {
      paper: "#EAEAEA",
      card: "#F4F4F4",
      info: "#DBE2F3",
      contrast: "#D9D9D9"
    },
  },
  typography: {
    fontSize: 13,
    color: {
      primary: "#042439",
      secondary: "#3A5364",
      contrast: "white"
    }
  },
  overrides: {
    MuiFormControlLabel: {
      label: {
        fontSize: 13,
        fontWeight: 300,
      },
    },
  },
});

export default Theme;
