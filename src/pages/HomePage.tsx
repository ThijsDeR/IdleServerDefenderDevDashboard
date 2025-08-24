// src/pages/HomePage.tsx
import React from 'react';
import { Typography, Box, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const HomePage: React.FC = () => {
    const theme = useTheme(); // Access the theme to get breakpoint values

    return (
        // This outer Box acts as a full-page flex container to center its content.
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                // Take up the full viewport height minus the top toolbar's height.
                minHeight: 'calc(100vh - 64px)',
                width: '100%',
            }}
        >
            {/* This inner Box constrains the content width, similar to a Container,
                but allows the parent Box to handle all the centering logic. */}
            <Box sx={{
                textAlign: 'center',
                width: '100%',
                maxWidth: theme.breakpoints.values.md, // Use theme for consistent max-width
                px: 2, // Add some padding on the sides
            }}>
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h2" component="h1" color="primary" gutterBottom>
                        Game Balancing Hub
                    </Typography>
                </Box>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                        This site is used by the developer for keeping track of the different values and their scaling within the game.
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
};
