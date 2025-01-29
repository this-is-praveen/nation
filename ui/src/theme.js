import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',  // Dark charcoal
      paper: '#1E1E1E',    // Medium-dark gray
    },
    primary: {
      main: '#1AA6B4',     // DeepSeek teal
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF8A65',     // Soft coral/orange
    },
    text: {
      primary: '#E0E0E0',  // Light gray
      secondary: '#9E9E9E',// Medium gray
    },
    divider: '#424242',    // Dark gray divider
  },
  typography: {
    fontFamily: [
      '"Comic Neue"',      // Casual handwriting-style font
      '"Patrick Hand"',    // Alternative casual font
      'cursive',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 400,
    },
    button: {
      textTransform: 'none', // Makes button text lowercase
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,  // Rounded corners
        },
      },
    },
  },
});