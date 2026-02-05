import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#38bdf8",     // neon sky blue
      light: "#7dd3fc",
      dark: "#0284c7"
    },

    secondary: {
      main: "#f472b6",     // neon pink
      light: "#f9a8d4",
      dark: "#db2777"
    },

    background: {
      default: "#0b0f19",  // deep bluish black
      paper: "#121826"     // elevated surface
    },

    success: {
      main: "#22c55e"
    },

    warning: {
      main: "#facc15"
    },

    error: {
      main: "#ef4444"
    },

    text: {
      primary: "#e5e7eb",
      secondary: "#9ca3af"
    }
  },

  shape: {
    borderRadius: 14
  },

  typography: {
    fontFamily: "Inter, Roboto, Arial, sans-serif",
    h5: {
      fontWeight: 600,
      letterSpacing: 0.3
    },
    button: {
      textTransform: "none",
      fontWeight: 600
    }
  },

  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "linear-gradient(180deg, #121826, #0b0f19)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.04), 0 12px 24px rgba(0,0,0,0.6)"
        }
      }
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow:
            "0 0 12px rgba(56,189,248,0.35)",
          transition: "all 0.25s ease",
          "&:hover": {
            boxShadow:
              "0 0 18px rgba(56,189,248,0.6)",
            transform: "translateY(-1px)"
          }
        }
      }
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600
        }
      }
    }
  }
});

export default darkTheme;
