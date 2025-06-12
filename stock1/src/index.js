import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Global CSS
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Define a Material UI theme (optional, but good for consistency)
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Global CSS reset from Material UI */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);