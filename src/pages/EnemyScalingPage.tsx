// src/pages/EnemyScalingPage.tsx
import React, { useState } from 'react';
import {
    Container,
    Typography,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Paper,
    type SelectChangeEvent
} from '@mui/material';

import { cups, tierDifficultyMultipliers, snapshotWaves } from '../data/gameData';
import { calculateEnemyHealth, calculateEnemyDamage, formatNumber } from '../lib/utils';
import { CupCard } from '../components/CupCard';
import { DifficultyJumpAnalysis } from '../components/DifficultyJumpAnalysis';

export const EnemyScalingPage: React.FC = () => {
    // State for the tier selected in each individual cup card
    const [selectedTiers, setSelectedTiers] = useState<{ [key: string]: number }>(() =>
        cups.reduce((acc, cup) => ({ ...acc, [cup.id]: 1 }), {})
    );

    const handleTierChange = (cupId: string, tier: number): void => {
        setSelectedTiers(prev => ({ ...prev, [cupId]: tier }));
    };

    // State for the main snapshot view controls
    const [snapshotCupId, setSnapshotCupId] = useState<string>(cups[0].id);
    const [snapshotTier, setSnapshotTier] = useState<number>(1);

    const snapshotCup = cups.find(c => c.id === snapshotCupId);
    
    if (!snapshotCup) {
        return <Typography color="error">Error: Cup not found!</Typography>;
    }

    const snapshotDifficulty = snapshotCup.difficultyMultiplier * tierDifficultyMultipliers[snapshotTier - 1];

    return (
        <Container maxWidth="xl" sx={{ py: 4, width: '100%' }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography variant="h2" component="h1" color="primary" gutterBottom>
                    Enemy Scaling Dashboard
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Analyze enemy health and damage across waves and difficulty tiers.
                </Typography>
            </Box>

            {/* Wave Snapshot Section */}
            <Paper elevation={3} sx={{ p: 3, mb: 6 }}>
                <Typography variant="h4" component="h2" mb={3}>Wave Snapshots</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                    <FormControl sx={{ minWidth: 240 }}>
                        <InputLabel id="snapshot-cup-label">Cup</InputLabel>
                        <Select
                            labelId="snapshot-cup-label"
                            value={snapshotCupId}
                            label="Cup"
                            onChange={(e: SelectChangeEvent) => setSnapshotCupId(e.target.value)}
                        >
                            {cups.map(cup => <MenuItem key={cup.id} value={cup.id}>{cup.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel id="snapshot-tier-label">Tier</InputLabel>
                        <Select
                            labelId="snapshot-tier-label"
                            value={snapshotTier.toString()}
                            label="Tier"
                            onChange={(e: SelectChangeEvent) => setSnapshotTier(parseInt(e.target.value))}
                        >
                            {tierDifficultyMultipliers.map((_, i) => <MenuItem key={i} value={i + 1}>Tier {i + 1}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Box>
                <Grid container spacing={2}>
                    {snapshotWaves.map(wave => (
                        <Grid size={{xs: 12, sm: 6, md: 4, lg: 2.4}} key={wave}>
                            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant="h6">Wave {wave}</Typography>
                                <Box mt={1} textAlign="left">
                                    <Typography variant="body2">
                                        Health: <Typography component="span" fontWeight="bold">{formatNumber(calculateEnemyHealth(wave, snapshotDifficulty))}</Typography>
                                    </Typography>
                                    <Typography variant="body2">
                                        Damage: <Typography component="span" fontWeight="bold">{formatNumber(calculateEnemyDamage(wave, snapshotDifficulty))}</Typography>
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            {/* Cup Tiers Section */}
            <Box>
                <Typography variant="h4" component="h2" mb={3}>Cup Tiers (Wave 1 Stats)</Typography>
                <Grid container spacing={3}>
                    {cups.map(cup => (
                        <Grid size={{xs: 12, sm: 6, md: 4, lg: 3}} key={cup.id}>
                            <CupCard
                                cup={cup}
                                tier={selectedTiers[cup.id]}
                                onTierChange={handleTierChange}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <DifficultyJumpAnalysis />
        </Container>
    );
}
