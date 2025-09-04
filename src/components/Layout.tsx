// src/components/Layout.tsx
import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';
import { DonutLargeOutlined, HomeOutlined, MemoryOutlined, SecurityOutlined, SimCardOutlined, UpgradeOutlined } from '@mui/icons-material';

const drawerWidth = 240;

export const Layout: React.FC = () => {
    return (
        <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflowX: 'hidden' }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {/* Each navigation item is now a Link */}
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/">
                                <ListItemIcon>
                                    <HomeOutlined />
                                </ListItemIcon>
                                <ListItemText primary="Home" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            {/* Use the `component` prop to make the button a router link */}
                            <ListItemButton component={Link} to="/EnemyScaling">
                                <ListItemIcon>
                                    <SecurityOutlined />
                                </ListItemIcon>
                                <ListItemText primary="Enemy Scaling" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/Upgrades">
                                <ListItemIcon>
                                    <UpgradeOutlined />
                                </ListItemIcon>
                                <ListItemText primary="Upgrades" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/GameSimulator">
                                <ListItemIcon>
                                    <SimCardOutlined />
                                </ListItemIcon>
                                <ListItemText primary="Game Simulator" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/Executable">
                                <ListItemIcon>
                                    <MemoryOutlined />
                                </ListItemIcon>
                                <ListItemText primary="Executable Drop Rate" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/Experience">
                                <ListItemIcon>
                                    <DonutLargeOutlined />
                                </ListItemIcon>
                                <ListItemText primary="Experience" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ p: 3, width: `calc(100% - ${drawerWidth}px)` }}>
                {/* The Outlet component renders the active page based on the URL */}
                <Outlet />
            </Box>
        </Box>
    );
};
