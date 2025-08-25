// src/pages/GameSimulatorPage.tsx
import React, { useState, useMemo } from 'react';
import {
    Container, Typography, Box, Paper, Grid, TextField,
    Select, MenuItem, InputLabel, FormControl, Divider, Accordion, AccordionSummary, AccordionDetails, type SelectChangeEvent
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { cups, tierCoinMultipliers, tierDifficultyMultipliers } from '../data/gameData';
import type { Boost } from '../types';
import { BoostEditor } from '../components/BoostEditor';
import { calculateEnemySpawnTime, formatNumber } from '../lib/utils';

// A small component to display a result stat
const ResultDisplay = ({ label, value }: { label: string; value: string | number }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
        <Typography variant="body1">{label}</Typography>
        <Typography variant="h6" fontWeight="bold">{value}</Typography>
    </Box>
);

const calculateTotalEnemies = (waves: number, waveTime: number, difficulty: number): number => {
    let totalEnemies = 0;
    for (let i = 1; i <= waves; i++) {
        if (i % 10 == 0) totalEnemies += 20;
        else totalEnemies += waveTime / calculateEnemySpawnTime(i, difficulty);
    }
    return totalEnemies;
};

const calculateCoins = (amount: number, boosts: Boost[]) => {
    let finalAmount = amount;
    boosts.forEach(boost => {
        if (boost.type === 'multiplicative') {
            finalAmount *= boost.value;
        }
    });
    return finalAmount;
}

export const GameSimulatorPage: React.FC = () => {
    // --- Simulation Inputs ---
    const [selectedCupId, setSelectedCupId] = useState<string>(cups[0].id);
    const [selectedTier, setSelectedTier] = useState<number>(1);
    const [waveReached, setWaveReached] = useState<number>(100);
    const [waveTime, setWaveTime] = useState<number>(10); // in seconds
    const [gameSpeed, setGameSpeed] = useState<number>(1);
    const [coinBoosts, setCoinBoosts] = useState<Boost[]>([
        { name: 'Mini Games Active', type: 'multiplicative', value: 1.25 },
        { name: 'Ad Watch Coins Boost', type: 'multiplicative', value: 1 },
        { name: 'Ad Watch Coin Doubler', type: 'multiplicative', value: 1 },
        { name: 'Coin Boost', type: 'multiplicative', value: 1 },
        { name: 'Coin Module', type: 'multiplicative', value: 1 },
    ]);
    const [enemyBoosts, setEnemyBoosts] = useState<Boost[]>([
        { name: 'Coins Per Enemy', type: 'multiplicative', value: 1 }
    ]);
    const [coinsPerWave, setCoinsPerWave] = useState<number>(0);

    // --- Simulation Logic ---
    const simulationResults = useMemo(() => {
        const selectedCup = cups.find(c => c.id === selectedCupId);
        if (!selectedCup) return null;

        const tierCoinMultiplier = tierCoinMultipliers[selectedTier - 1];
        const coinMultiplier = selectedCup.coinMultiplier * tierCoinMultiplier;

        const tierDifficultyMultiplier = tierDifficultyMultipliers[selectedTier - 1];
        const difficultyMultiplier = selectedCup.difficultyMultiplier * tierDifficultyMultiplier;

        const coinsFromCoinsPerWave = calculateCoins(coinsPerWave * waveReached * coinMultiplier, coinBoosts);

        const totalEnemies = calculateTotalEnemies(waveReached, waveTime, difficultyMultiplier);

        const coinsFromEnemies = calculateCoins(totalEnemies * 5 * coinMultiplier, [...coinBoosts, ...enemyBoosts]);

        const finalCoins = coinsFromCoinsPerWave + coinsFromEnemies;

        const timeTaken = (waveTime * waveReached) / gameSpeed;

        const coinsPerMinute = timeTaken > 0 ? (finalCoins / timeTaken) * 60 : 0;

        // Placeholder for experience calculation
        const totalExperience = totalEnemies * selectedCup.experienceMultiplier;

        return {
            totalEnemies: totalEnemies,
            coinMultiplier: coinMultiplier,
            coinsFromEnemies: coinsFromEnemies,
            coinsFromCoinsPerWave: coinsFromCoinsPerWave,
            totalCoins: finalCoins,
            coinsPerMinute: coinsPerMinute,
            totalExperience: totalExperience,
        };
    }, [selectedCupId, selectedTier, waveReached, waveTime, coinBoosts, enemyBoosts, coinsPerWave, gameSpeed]);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h2" component="h1" color="primary" gutterBottom>
                    Game Simulator
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Left Side: Inputs */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h5" gutterBottom>Simulation Settings</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <FormControl fullWidth>
                                <InputLabel>Cup</InputLabel>
                                <Select
                                    value={selectedCupId}
                                    label="Cup"
                                    onChange={(e: SelectChangeEvent) => setSelectedCupId(e.target.value)}
                                >
                                    {cups.map(cup => <MenuItem key={cup.id} value={cup.id}>{cup.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel>Tier</InputLabel>
                                <Select
                                    value={selectedTier.toString()}
                                    label="Tier"
                                    onChange={(e: SelectChangeEvent) => setSelectedTier(parseInt(e.target.value))}
                                >
                                    {tierCoinMultipliers.map((mult, i) => <MenuItem key={i} value={i + 1}>Tier {i + 1} (x{mult} coins)</MenuItem>)}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Wave Reached"
                                type="number"
                                value={waveReached}
                                onChange={(e) => setWaveReached(parseInt(e.target.value) || 0)}
                            />
                            <TextField
                                label="Wave Time (seconds)"
                                type="number"
                                value={waveTime}
                                onChange={(e) => setWaveTime(parseInt(e.target.value) || 0)}
                            />
                            <TextField
                                label="Game Speed"
                                type="number"
                                value={gameSpeed}
                                onChange={(e) => setGameSpeed(parseInt(e.target.value) || 0)}
                            />
                            <TextField 
                                label="Coins Per Wave"
                                type="number"
                                value={coinsPerWave}
                                onChange={(e) => setCoinsPerWave(parseInt(e.target.value) || 0)}
                            />
                             <Accordion sx={{ boxShadow: 'none', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>Coin Boosts</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <BoostEditor boosts={coinBoosts} onBoostsChange={setCoinBoosts} />
                                </AccordionDetails>
                            </Accordion>

                            <Accordion sx={{ boxShadow: 'none', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>Enemy Boosts</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <BoostEditor boosts={enemyBoosts} onBoostsChange={setEnemyBoosts} />
                                </AccordionDetails>
                            </Accordion>
                        </Box>
                    </Paper>
                </Grid>

                {/* Right Side: Results */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h5" gutterBottom>Simulation Results</Typography>
                        {simulationResults && (
                            <Box>
                                <ResultDisplay label="Total Enemies Defeated" value={formatNumber(simulationResults.totalEnemies)} />
                                <ResultDisplay label="Coin Multiplier" value={simulationResults.coinMultiplier.toFixed(2) + 'x'} />
                                <Divider sx={{ my: 1 }} />
                                <ResultDisplay label="Coins from Enemies" value={formatNumber(simulationResults.coinsFromEnemies)} />
                                <ResultDisplay label="Coins from Waves" value={formatNumber(simulationResults.coinsFromCoinsPerWave)} />
                                <Divider sx={{ my: 1 }} />
                                <ResultDisplay label="Total Coins Earned" value={formatNumber(simulationResults.totalCoins)} />
                                <Divider sx={{ my: 1 }} />
                                <ResultDisplay label="Coins Per Enemy" value={formatNumber(simulationResults.coinsFromEnemies / simulationResults.totalEnemies)} />
                                <ResultDisplay label="Coins Per Minute" value={formatNumber(simulationResults.coinsPerMinute)} />
                                <Divider sx={{ my: 1 }} />
                                <ResultDisplay label="Total Experience" value={formatNumber(simulationResults.totalExperience)} />
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};
