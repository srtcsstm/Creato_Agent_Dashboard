import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { createTheme } from '@mui/material/styles';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('themeMode') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'dark' ? '#61dafb' : '#1976d2', // Light blue for dark, default blue for light
            dark: mode === 'dark' ? '#323543' : '#1565c0', // Darker shade for hover/active
          },
          secondary: {
            main: mode === 'dark' ? '#90caf9' : '#dc004e', // Another light color for secondary actions
          },
          info: {
            main: mode === 'dark' ? '#80cbc4' : '#00bcd4', // Teal for info
          },
          warning: {
            main: mode === 'dark' ? '#ffb74d' : '#ff9800', // Orange for warning
          },
          success: {
            main: mode === 'dark' ? '#81c784' : '#4caf50', // Green for success
          },
          error: {
            main: mode === 'dark' ? '#e57373' : '#f44336', // Red for error
          },
          background: {
            default: mode === 'dark' ? '#111112' : '#f4f6f8', // Main page background (darkest)
            paper: mode === 'dark' ? '#1a1c23' : '#ffffff', // Cards, AppBar, Drawer background (slightly lighter dark)
          },
          text: {
            primary: mode === 'dark' ? '#ffffff' : '#212121', // Head text
            secondary: mode === 'dark' ? '#A4A5AA' : '#555555', // General text
          },
          divider: mode === 'dark' ? '#323543' : '#e0e0e0', // Border color
          action: {
            selected: mode === 'dark' ? 'rgba(97, 218, 251, 0.15)' : 'rgba(25, 118, 210, 0.15)', // Adjusted for better visibility in light mode
            hover: mode === 'dark' ? 'rgba(97, 218, 251, 0.08)' : 'rgba(25, 118, 210, 0.08)',
          },
        },
        typography: {
          fontFamily: ['"Inter"', 'sans-serif'].join(','),
          h4: {
            fontWeight: 600,
            fontSize: '1.8rem',
            color: mode === 'dark' ? '#ffffff' : '#212121',
          },
          h5: {
            fontWeight: 600,
            fontSize: '1.5rem',
            color: mode === 'dark' ? '#ffffff' : '#212121',
          },
          h6: {
            fontWeight: 500,
            fontSize: '1.2rem',
            color: mode === 'dark' ? '#ffffff' : '#212121',
          },
          body1: {
            color: mode === 'dark' ? '#A4A5AA' : '#555555',
          },
          body2: {
            color: mode === 'dark' ? '#A4A5AA' : '#555555',
          },
          caption: {
            color: mode === 'dark' ? '#A4A5AA' : '#757570',
          }
        },
        shape: {
          borderRadius: 8, // Default for most components
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: 8, // Default button border radius
              },
              contained: {
                backgroundColor: mode === 'dark' ? '#61dafb' : '#1976d2', // Brighter blue for login button
                color: '#ffffff',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: mode === 'dark' ? '#323543' : '#1565c0',
                  boxShadow: 'none',
                },
              },
              outlined: {
                borderColor: mode === 'dark' ? '#323543' : '#e0e0e0',
                color: mode === 'dark' ? '#A4A5AA' : '#1976d2',
                '&:hover': {
                  borderColor: mode === 'dark' ? '#61dafb' : '#1565c0',
                  color: mode === 'dark' ? '#61dafb' : '#1565c0',
                  backgroundColor: mode === 'dark' ? 'rgba(97, 218, 251, 0.05)' : 'rgba(25, 118, 210, 0.05)',
                },
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'dark' ? '#111112' : '#ffffff', // Updated to #111112 for dark mode
                boxShadow: 'none',
                borderBottom: `1px solid ${mode === 'dark' ? '#323543' : '#e0e0e0'}`,
                borderRadius: 0,
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: mode === 'dark' ? '#1a1c23' : '#ffffff', // Use paper background
                borderRight: `1px solid ${mode === 'dark' ? '#323543' : '#e0e0e0'}`,
                borderRadius: 0,
              },
            },
          },
          MuiToolbar: { // Explicitly style MuiToolbar
            styleOverrides: {
              root: {
                backgroundColor: mode === 'dark' ? '#111112' : '#ffffff', // Updated to #111112 for dark mode
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'dark' ? '#1a1c23' : '#ffffff', // Cards still use paper background
                borderRadius: 12,
                boxShadow: mode === 'dark' ? '0px 4px 20px rgba(0, 0, 0, 0.2)' : '0px 4px 20px rgba(0, 0, 0, 0.05)',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'dark' ? '#1a1c23' : '#ffffff', // Paper still uses paper background
                borderRadius: 12,
                boxShadow: mode === 'dark' ? '0px 4px 20px rgba(0, 0, 0, 0.2)' : '0px 4px 20px rgba(0, 0, 0, 0.05)',
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                color: mode === 'dark' ? '#A4A5AA' : '#555555',
                borderColor: mode === 'dark' ? '#323543' : '#e0e0e0',
                padding: '12px 16px',
              },
              head: {
                color: mode === 'dark' ? '#ffffff' : '#212121',
                fontWeight: 600,
                backgroundColor: mode === 'dark' ? '#1a1c23' : '#f9f9f9',
              },
            },
          },
          MuiLinearProgress: {
            styleOverrides: {
              bar: {
                backgroundColor: mode === 'dark' ? '#61dafb' : '#1976d2',
                borderRadius: 4,
              },
              root: {
                backgroundColor: mode === 'dark' ? '#323543' : '#e0e0e0',
                borderRadius: 4,
              },
            },
          },
          MuiCircularProgress: {
            styleOverrides: {
              root: {
                color: mode === 'dark' ? '#61dafb' : '#1976d2',
              },
            },
          },
          MuiAlert: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'dark' ? '#323543' : '#e3f2fd',
                color: mode === 'dark' ? '#ffffff' : '#1a1c23',
                borderRadius: 8,
              },
              icon: {
                color: mode === 'dark' ? '#61dafb !important' : '#1976d2 !important',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiInputBase-input': {
                  color: mode === 'dark' ? '#ffffff' : '#212121',
                },
                '& .MuiInputLabel-root': {
                  color: mode === 'dark' ? '#A4A5AA' : '#555555',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: mode === 'dark' ? '#323543' : '#e0e0e0',
                  borderRadius: 8,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: mode === 'dark' ? '#61dafb !important' : '#1976d2 !important',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: mode === 'dark' ? '#61dafb !important' : '#1976d2 !important',
                  borderWidth: '2px !important',
                },
                '& .MuiFilledInput-root': {
                  backgroundColor: mode === 'dark' ? '#2a2c34' : '#f0f0f0',
                  borderRadius: 8,
                  '&:hover': {
                    backgroundColor: mode === 'dark' ? '#323543' : '#e0e0e0',
                  },
                  '&.Mui-focused': {
                    backgroundColor: mode === 'dark' ? '#323543' : '#e0e0e0',
                  },
                },
              },
            },
          },
          MuiMenuItem: {
            styleOverrides: {
              root: {
                color: mode === 'dark' ? '#A4A5AA' : '#212121',
                '&:hover': {
                  // Directly use the color based on mode to avoid circular dependency
                  backgroundColor: mode === 'dark' ? 'rgba(97, 218, 251, 0.08)' : 'rgba(25, 118, 210, 0.08)',
                },
              },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                margin: '4px 8px',
                padding: '8px 16px',
                '&.Mui-selected': {
                  backgroundColor: mode === 'dark' ? 'rgba(97, 218, 251, 0.15)' : 'rgba(25, 118, 210, 0.15)',
                  color: mode === 'dark' ? '#61dafb' : '#1976d2',
                  '& .MuiListItemIcon-root': {
                    color: mode === 'dark' ? '#61dafb' : '#1976d2',
                  },
                  '&:hover': {
                    backgroundColor: mode === 'dark' ? 'rgba(97, 218, 251, 0.2)' : 'rgba(25, 118, 210, 0.2)',
                  },
                },
                '&:hover': {
                  backgroundColor: mode === 'dark' ? 'rgba(97, 218, 251, 0.08)' : 'rgba(25, 118, 210, 0.08)',
                },
              },
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => useContext(ThemeContext);
