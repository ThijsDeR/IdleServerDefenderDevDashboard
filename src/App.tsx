// src/App.tsx
import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
// Import routing components from React Router
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { darkTheme } from './styles/theme';
import { Layout } from './components/Layout';
import { EnemyScalingPage } from './pages/EnemyScalingPage';
import { HomePage } from './pages/HomePage';
import { UpgradesPage } from './pages/UpgradesPage';

const App: React.FC = () => {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            {/* BrowserRouter provides routing context to the entire app */}
            <BrowserRouter>
                {/* Routes is a container for all your individual routes */}
                <Routes>
                    {/* This is a layout route. It renders the Layout component,
                        which in turn renders the matched child route via its <Outlet /> */}
                    <Route path="/" element={<Layout />}>
                        {/* The index route is the default child route for the parent's path */}
                        <Route index element={<HomePage />} />
                        <Route path="EnemyScaling" element={<EnemyScalingPage />} />
                        <Route path="Upgrades" element={<UpgradesPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
