// src/pages/UpgradesPage.tsx
import React, { useState } from 'react';
import { Container, Typography, Box, Paper, Grid, TextField, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { initialUpgrades } from '../data/upgradeData';
import type { Boost, UpgradeState } from '../types';
import { UpgradeCard } from '../components/UpgradeCard';

type CoinDistributionMode = 'shared' | 'individual';

export const UpgradesPage: React.FC = () => {
    const [upgrades, setUpgrades] = useState<UpgradeState[]>(() =>
        initialUpgrades.map(u => ({ ...u, baseLevel: 0, increaseLevel: 0 }))
    );
    const [mode, setMode] = useState<CoinDistributionMode>('shared');
    const [sharedCoins, setSharedCoins] = useState<number>(100000);
    const [individualCoins, setIndividualCoins] = useState<number>(10000);

    const [waveDuration, setWaveDuration] = useState<number>(10);
    const [waveAmount, setWaveAmount] = useState<number>(5);
    const [speedDivider, setSpeedDivider] = useState<number>(1);

    const handleOverrideChange = (id: string, value: number) => {
        setUpgrades(prev =>
            prev.map(u => (u.id === id ? { ...u, availableCoins: isNaN(value) ? undefined : value } : u))
        );
    };

    // Add this function inside your UpgradesPage component
    const handleBoostsChange = (id: string, type: 'general' | 'base' | 'increase', newBoosts: Boost[]) => {
        setUpgrades(prev =>
            prev.map(u => {
                if (u.id === id) {
                    // Create a new object for the specific upgrade
                    const updatedUpgrade = { ...u };
                    if (type === 'general') updatedUpgrade.generalBoosts = newBoosts;
                    else if (type === 'base') updatedUpgrade.baseBoosts = newBoosts;
                    else updatedUpgrade.increaseBoosts = newBoosts;
                    return updatedUpgrade;
                }
                return u; // Return other upgrades unchanged
            })
        );
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h2" component="h1" color="primary" gutterBottom>
                    Upgrades Balancing
                </Typography>
            </Box>

            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" gutterBottom>Coin Distribution</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <ToggleButtonGroup
                        value={mode}
                        exclusive
                        onChange={(_, newMode) => newMode && setMode(newMode)}
                    >
                        <ToggleButton value="shared">All Upgrades Share Coins</ToggleButton>
                        <ToggleButton value="individual">Each Upgrade Gets Coins</ToggleButton>
                    </ToggleButtonGroup>

                    {mode === 'shared' ? (
                        <TextField
                            label="Total Shared Coins"
                            type="number"
                            value={sharedCoins}
                            onChange={(e) => setSharedCoins(parseInt(e.target.value) || 0)}
                        />
                    ) : (
                        <TextField
                            label="Coins Per Upgrade"
                            type="number"
                            value={individualCoins}
                            onChange={(e) => setIndividualCoins(parseInt(e.target.value) || 0)}
                        />
                    )}
                </Box>
            </Paper>

            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" gutterBottom>Wave Settings</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                        label="Wave Amount"
                        type="number"
                        value={waveAmount}
                        onChange={(e) => setWaveAmount(parseInt(e.target.value) || 0)}
                    />

                    <TextField
                        label="Wave Duration (seconds)"
                        type="number"
                        value={waveDuration}
                        onChange={(e) => setWaveDuration(parseInt(e.target.value) || 0)}
                    />

                    <TextField
                        label="Speed Divider"
                        type="number"
                        value={speedDivider}
                        onChange={(e) => setSpeedDivider(parseFloat(e.target.value) || 0)}
                    />
                </Box>
            </Paper>

            <Grid container spacing={3}>
                {upgrades.map(upgrade => {
                    // Determine the amount of coins available for this specific card
                    // based on the current distribution mode.
                    let coinsAvailable = mode === 'shared' ? (sharedCoins / upgrades.length) : individualCoins;
                    if (upgrade.availableCoins !== undefined) coinsAvailable = upgrade.availableCoins;


                    return (
                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={upgrade.id}>
                            <UpgradeCard
                                upgrade={upgrade}
                                onOverrideChange={handleOverrideChange}
                                onBoostsChange={handleBoostsChange}
                                coinsAvailable={coinsAvailable}
                                speedDividerValue={speedDivider}
                                timePassed={waveDuration * waveAmount}
                            />
                        </Grid>
                    );
                })}
            </Grid>
        </Container>
    );
};
