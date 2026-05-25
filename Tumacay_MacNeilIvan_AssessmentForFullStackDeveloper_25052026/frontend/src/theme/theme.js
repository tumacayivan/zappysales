import { createTheme } from '@mui/material/styles';

// Light, professional palette — keeps the UI feeling clean rather than
// flashy, in line with the assessment's "cleanness & lightness" criterion.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2563eb' },
    secondary: { main: '#0f172a' },
    background: { default: '#f6f8fb', paper: '#ffffff' },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { boxShadow: '0 1px 0 rgba(15, 23, 42, 0.06)' },
      },
    },
  },
});

export default theme;
