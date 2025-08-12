import { TextStyle } from "react-native";

export const theme = {
  colors: {
    primary: {
      DEFAULT: "#0070f3",
      light: "#e6f1fe",
      dark: "#0051b2",
    },
    secondary: {
      DEFAULT: "#6c757d",
      light: "#e9ecef",
      dark: "#495057",
    },
    success: {
      DEFAULT: "#28a745",
      light: "#d4edda",
      dark: "#1e7e34",
    },
    text: {
      heading: "#1a1a1a",
      body: "#4a4a4a",
      muted: "#6c757d",
      light: "#ffffff",
    },
    background: {
      DEFAULT: "#f8f9fa",
      card: "#ffffff",
      dark: "#343a40",
    },
    border: {
      DEFAULT: "#dee2e6",
      dark: "#ced4da",
    },
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: "700" as TextStyle["fontWeight"],
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: "700" as TextStyle["fontWeight"],
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: "700" as TextStyle["fontWeight"],
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
    },
    small: {
      fontSize: 14,
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  },
}; 