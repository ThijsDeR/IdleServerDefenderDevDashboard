// src/components/DifficultyJumpAnalysis.tsx
import React, { useState, useMemo } from 'react';
import {
    Typography,
    Box,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ToggleButtonGroup,
    ToggleButton,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    type SelectChangeEvent
} from '@mui/material';

import { cups, tierDifficultyMultipliers } from '../data/gameData';
import { calculateEnemyHealth, calculateEnemyDamage } from '../lib/utils';

type AnalysisMode = 'between-cups' | 'between-tiers';

export const DifficultyJumpAnalysis: React.FC = () => {
    const [mode, setMode] = useState<AnalysisMode>('between-cups');
    const [selectedCupId, setSelectedCupId] = useState<string>(cups[0].id);
    const [selectedTier, setSelectedTier] = useState<number>(1);

    const handleModeChange = (_event: React.MouseEvent<HTMLElement>, newMode: AnalysisMode | null) => {
        if (newMode !== null) {
            setMode(newMode);
        }
    };

    const analysisResults = useMemo(() => {
        const results = [];
        const calculateJump = (val1: number, val2: number) => {
            if (val1 === 0) return Infinity;
            return ((val2 - val1) / val1) * 100;
        };

        if (mode === 'between-cups') {
            for (let i = 0; i < cups.length - 1; i++) {
                const currentCup = cups[i];
                const nextCup = cups[i + 1];

                const tierMultiplier = tierDifficultyMultipliers[selectedTier - 1];

                const currentHealth = calculateEnemyHealth(1, currentCup.difficultyMultiplier * tierMultiplier);
                const nextHealth = calculateEnemyHealth(1, nextCup.difficultyMultiplier * tierMultiplier);
                const currentDamage = calculateEnemyDamage(1, currentCup.difficultyMultiplier * tierMultiplier);
                const nextDamage = calculateEnemyDamage(1, nextCup.difficultyMultiplier * tierMultiplier);

                results.push({
                    label: `${currentCup.abbreviation} → ${nextCup.abbreviation}`,
                    healthJump: calculateJump(currentHealth, nextHealth),
                    damageJump: calculateJump(currentDamage, nextDamage),
                });
            }
        } else { // 'between-tiers'
            const cup = cups.find(c => c.id === selectedCupId);
            if (cup) {
                for (let i = 0; i < tierDifficultyMultipliers.length - 1; i++) {
                    const currentMultiplier = tierDifficultyMultipliers[i];
                    const nextMultiplier = tierDifficultyMultipliers[i + 1];

                    const currentHealth = calculateEnemyHealth(1, cup.difficultyMultiplier * currentMultiplier);
                    const nextHealth = calculateEnemyHealth(1, cup.difficultyMultiplier * nextMultiplier);
                    const currentDamage = calculateEnemyDamage(1, cup.difficultyMultiplier * currentMultiplier);
                    const nextDamage = calculateEnemyDamage(1, cup.difficultyMultiplier * nextMultiplier);

                    results.push({
                        label: `Tier ${i + 1} → Tier ${i + 2}`,
                        healthJump: calculateJump(currentHealth, nextHealth),
                        damageJump: calculateJump(currentDamage, nextDamage),
                    });
                }
            }
        }
        return results;
    }, [mode, selectedCupId, selectedTier]);

    return (
        <Paper elevation={3} sx={{ p: 3, mt: 6 }}>
            <Typography variant="h4" component="h2" mb={3}>Difficulty Jump Analysis</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4, alignItems: 'center' }}>
                <ToggleButtonGroup
                    value={mode}
                    exclusive
                    onChange={handleModeChange}
                    aria-label="Analysis Mode"
                >
                    <ToggleButton value="between-cups" aria-label="Between Cups">Between Cups</ToggleButton>
                    <ToggleButton value="between-tiers" aria-label="Between Tiers">Between Tiers</ToggleButton>
                </ToggleButtonGroup>

                {mode === 'between-cups' ? (
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel id="jump-tier-label">Tier</InputLabel>
                        <Select
                            labelId="jump-tier-label"
                            value={selectedTier.toString()}
                            label="Tier"
                            onChange={(e: SelectChangeEvent) => setSelectedTier(parseInt(e.target.value))}
                        >
                            {tierDifficultyMultipliers.map((_, i) => <MenuItem key={i} value={i + 1}>Tier {i + 1}</MenuItem>)}
                        </Select>
                    </FormControl>
                ) : (
                    <FormControl sx={{ minWidth: 240 }}>
                        <InputLabel id="jump-cup-label">Cup</InputLabel>
                        <Select
                            labelId="jump-cup-label"
                            value={selectedCupId}
                            label="Cup"
                            onChange={(e: SelectChangeEvent) => setSelectedCupId(e.target.value)}
                        >
                            {cups.map(cup => <MenuItem key={cup.id} value={cup.id}>{cup.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                )}
            </Box>

            <TableContainer component={Paper} variant="outlined">
                <Table sx={{ minWidth: 650 }} aria-label="difficulty jump table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Jump</TableCell>
                            <TableCell align="right">Health Increase (%)</TableCell>
                            <TableCell align="right">Damage Increase (%)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {analysisResults.map((row) => (
                            <TableRow key={row.label}>
                                <TableCell component="th" scope="row">
                                    {row.label}
                                </TableCell>
                                <TableCell align="right" sx={{ color: row.healthJump > (mode === 'between-tiers' ? 200 : 2000) ? 'warning.main' : 'text.primary' }}>
                                    {row.healthJump.toFixed(2)}%
                                </TableCell>
                                <TableCell align="right" sx={{ color: row.damageJump > (mode === 'between-tiers' ? 200 : 2000) ? 'warning.main' : 'text.primary' }}>
                                    {row.damageJump.toFixed(2)}%
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};
