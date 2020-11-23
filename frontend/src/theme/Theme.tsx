import React from 'react';
import {
  createMuiTheme,
  ThemeProvider,
  responsiveFontSizes,
} from '@material-ui/core/styles';

let theme = createMuiTheme({
  palette: {
    primary: {
      light: '#5dbdb0',
      main: '#048182',
      dark: '#066360',
      contrastText: '#fff',
    },
    secondary: {
      main: '#455a64',
      dark: '#37474f',
      contrastText: '#fff',
    },
    grey: {
      100: '#f5f4f5',
      200: '#e0e0e0',
    },
  },
  typography: {
    fontFamily: 'Poppins, Arial, sans-serif',

    h1: {
      fontSize: '2.2rem',
      textTransform: 'uppercase',
      textAlign: 'center',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.3rem',
      fontWeight: 600,
      textTransform: 'uppercase',
    },
    h4: {
      fontSize: '1.3rem',
      fontWeight: 600,
      textTransform: 'lowercase',
    },
    h5: {
      fontSize: '1.1rem',
      fontWeight: 600,
    },
  },
});

theme = responsiveFontSizes(theme);

const ThemeStyles: React.FC<{ children: any }> = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default ThemeStyles;
