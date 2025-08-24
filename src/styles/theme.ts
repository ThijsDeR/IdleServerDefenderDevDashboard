// src/styles/theme.ts
import { createTheme } from '@mui/material';

/**
 * Custom dark theme for the MUI components.
 */
export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#00bcd4', // Cyan
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 600,
        }
    }
});
