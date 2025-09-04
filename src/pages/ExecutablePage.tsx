import { useMemo, useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Grid,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';

// Mock data to replicate the user's environment
// In a real project, these would be imported from a separate file.
const cups = [
    { id: 'malware_maze', name: 'Malware Maze', abbreviation: 'MM', coinMultiplier: 1.0, difficultyMultiplier: 1.0, experienceMultiplier: 1.0 },
    { id: 'novice_nexus', name: 'Novice Nexus', abbreviation: 'NN', coinMultiplier: 2.5, difficultyMultiplier: 2.0, experienceMultiplier: 1.5 },
    { id: 'evolving_epoch', name: 'Evolving Epoch', abbreviation: 'EE', coinMultiplier: 4.0, difficultyMultiplier: 4.0, experienceMultiplier: 2.0 },
    { id: 'virus_vanguard', name: 'Virus Vanguard', abbreviation: 'VV', coinMultiplier: 6.0, difficultyMultiplier: 8.0, experienceMultiplier: 3.0 },
    { id: 'pinnacle_paragon', name: 'Pinnacle Paragon', abbreviation: 'PP', coinMultiplier: 8.0, difficultyMultiplier: 16.0, experienceMultiplier: 4.5 },
    { id: 'zenith_zone', name: 'Zenith Zone', abbreviation: 'ZZ', coinMultiplier: 12.0, difficultyMultiplier: 32.0, experienceMultiplier: 6.0 },
    { id: 'celestial_circuit', name: 'Celestial Circuit', abbreviation: 'CC', coinMultiplier: 16.0, difficultyMultiplier: 64.0, experienceMultiplier: 9.0 },
    { id: 'infinite_interface', name: 'Infinite Interface', abbreviation: 'II', coinMultiplier: 24.0, difficultyMultiplier: 128.0, experienceMultiplier: 12.0 },
    { id: 'omnipotent_orbit', name: 'Omnipotent Orbit', abbreviation: 'OO', coinMultiplier: 30.0, difficultyMultiplier: 256.0, experienceMultiplier: 18.0 },
    { id: 'transcendent_tier', name: 'Transcendent Tier', abbreviation: 'TT', coinMultiplier: 40.0, difficultyMultiplier: 512.0, experienceMultiplier: 24.0 },
];

const tierDifficultyMultipliers = [1.0, 1.2, 1.4, 1.6, 1.8];
const executableRarityNames = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];
const executableRarityColors = [
    '#ffffff', // Common
    '#aafff8', // Uncommon
    '#519dfe', // Rare
    '#9050fd', // Epic
    '#fdd650', // Legendary
    '#fd5069', // Mythic
];

// Base weights and bonuses for drop chance calculation
const baseWeights = [45, 25, 15, 10, 4, 1];
const rarityBonuses = [0, 0.05, 0.1, 0.25, 0.2, 0.15];

export const ExecutableDropRatePage = () => {
    const [selectedCupId, setSelectedCupId] = useState(cups[0].id);
    const [selectedTier, setSelectedTier] = useState(1);

    // Memoized calculation for drop rates
    const dropRates = useMemo(() => {
        const selectedCup = cups.find(c => c.id === selectedCupId);
        if (!selectedCup) return [];

        const tierDifficultyMultiplier = tierDifficultyMultipliers[selectedTier - 1] || 1;
        const totalDifficultyMultiplier = selectedCup.difficultyMultiplier * tierDifficultyMultiplier;

        const adjustedWeights = baseWeights.map((weight, index) => {
            return weight + (totalDifficultyMultiplier - 1) * rarityBonuses[index];
        });

        const totalAdjustedWeight = adjustedWeights.reduce((sum, weight) => sum + weight, 0);

        return adjustedWeights.map(weight => {
            return (weight / totalAdjustedWeight) * 100;
        });
    }, [selectedCupId, selectedTier]);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h2" component="h1" color="primary" gutterBottom>
                    Executable Drop Rate Calculator
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Left Side: Inputs */}
                <Grid size={{xs: 12, md: 5}}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h5" gutterBottom>Settings</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <FormControl fullWidth>
                                <InputLabel>Cup</InputLabel>
                                <Select
                                    value={selectedCupId}
                                    label="Cup"
                                    onChange={(e) => setSelectedCupId(e.target.value)}
                                >
                                    {cups.map(cup => <MenuItem key={cup.id} value={cup.id}>{cup.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel>Tier</InputLabel>
                                <Select
                                    value={selectedTier.toString()}
                                    label="Tier"
                                    onChange={(e) => setSelectedTier(parseInt(e.target.value))}
                                >
                                    {tierDifficultyMultipliers.map((mult, i) => <MenuItem key={i} value={i + 1}>Tier {i + 1} (x{mult.toFixed(1)})</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Box>
                    </Paper>
                </Grid>

                {/* Right Side: Results */}
                <Grid size={{xs: 12, md: 7}}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h5" gutterBottom>Calculated Drop Rates</Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Rarity</TableCell>
                                        <TableCell align="right">Drop Chance</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dropRates.map((rate, index) => (
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row">
                                                <span style={{ color: executableRarityColors[index] }}>
                                                    {executableRarityNames[index]}
                                                </span>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="h6" fontWeight="bold">
                                                    {rate.toFixed(2)}%
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ExecutableDropRatePage;
