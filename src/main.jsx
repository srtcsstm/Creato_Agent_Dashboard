import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { CssBaseline } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { ThemeProvider, useThemeMode } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
// import { DashboardFilterProvider } from './contexts/DashboardFilterContext'; // Removed from here

function Root() {
  const { theme } = useThemeMode();
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </MuiThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        {/* DashboardFilterProvider moved to App.jsx */}
        <Root />
      </ThemeProvider>
    </LanguageProvider>
  </React.StrictMode>,
);
