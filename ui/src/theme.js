import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0a1929',
      paper: '#001e3c',
    },
    primary: {
      main: '#66b2ff',
    },
    secondary: {
      main: '#ff6b6b',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
});