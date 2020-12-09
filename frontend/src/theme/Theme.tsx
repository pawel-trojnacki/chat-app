import React from 'react';
import {
  createMuiTheme,
  ThemeProvider,
  responsiveFontSizes,
} from '@material-ui/core/styles';

let theme = createMuiTheme({
  palette: {
    primary: {
      main: '#058573',
      contrastText: '#fff',
    },
    secondary: {
      main: '#5e6c74',
      contrastText: '#fff',
    },
    grey: {
      100: '#f5f4f5',
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
      fontWeight: 400,
      textTransform: 'none',
    },
    h3: {
      fontSize: '1.3rem',
      fontWeight: 600,
      textTransform: 'uppercase',
    },
    h4: {
      fontSize: '1.2rem',
      fontWeight: 600,
      textTransform: 'none',
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body2: {
      fontSize: '0.7rem',
    },
  },
});

theme = responsiveFontSizes(theme);

const ThemeStyles: React.FC<{ children: any }> = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default ThemeStyles;
