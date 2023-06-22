import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#252fb8",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#252fb8",
            color: "#FFFFFF", // Replace with your desired text color for hover
          },
        },
      },
    },
  },
});

export default theme;
