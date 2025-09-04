import {
    Box,
    Container,
    Divider,
    Grid,
    Paper,
    Table,
    TableContainer,
    TableHead,
    TextField,
    Typography,
    TableRow,
    TableCell,
    TableBody,
    Tooltip,
} from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { getValueForSingleLevel } from '../lib/formulas';
import { formatNumber } from '../lib/utils';
import { FormulaTypes, type AdvancedFormula } from '../types';

// --- Helper Component ---
const ResultDisplay = ({ label, value }: { label: string; value: string | number }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
        <Typography variant="body1">{label}</Typography>
        <Typography variant="h6" fontWeight="bold">{value}</Typography>
    </Box>
);


// --- Game Logic & Formulas ---

const LEVEL_NEEDED_TO_PRESTIGE = 100;
const MAX_EXPERIENCE_LEVEL = 1000;

const LEVEL_XP_NEEDED_FORMULA: AdvancedFormula = {
    type: FormulaTypes.Advanced,
    baseAmount: 100,
    parts: [
        { count: 20, increaseAmount: 150, multiplierPer: 10, multiplierPerAmount: 200 },
        { count: 20, increaseAmount: 200, multiplierPer: 10, multiplierPerAmount: 200 },
        { count: 20, increaseAmount: 250, multiplierPer: 10, multiplierPerAmount: 200 },
        { count: 20, increaseAmount: 300, multiplierPer: 10, multiplierPerAmount: 200 },
        { count: 20, increaseAmount: 350, multiplierPer: 10, multiplierPerAmount: 200 },
        { count: 900, increaseAmount: 500, multiplierPer: 10, multiplierPerAmount: 200 },
    ],
};

/**
 * Calculates the TOTAL CUMULATIVE experience needed to complete a given level (0-indexed).
 * This version calculates the sum from scratch on every call.
 */
const calculateTotalExperienceForLevel = (level: number): number => {
    return getValueForSingleLevel(level, LEVEL_XP_NEEDED_FORMULA)
};

/**
 * Calculates the player's level (1-indexed) based on their total cumulative experience.
 */
const calculateLevelFromExperience = (experience: number): number => {
    let currentLevel = 1;
    console.log(getValueForSingleLevel(100, LEVEL_XP_NEEDED_FORMULA))
    while (experience >= getValueForSingleLevel(currentLevel - 1, LEVEL_XP_NEEDED_FORMULA) && currentLevel < MAX_EXPERIENCE_LEVEL) {
        currentLevel++;
    }
    return currentLevel;
};

/**
 * Calculates prestige points reward with a slight incentive curve.
 */
const calculatePrestigePoints = (currentLevel: number): number => {
    if (currentLevel < LEVEL_NEEDED_TO_PRESTIGE) return 0;

    const exponent = 1.1; // The "incentive" factor
    const divisor = 10000;   // The balancing factor

    return Math.floor(Math.pow(calculateTotalExperienceForLevel(currentLevel - 1), exponent) / divisor);
};

/**
 * Calculates prestige gems reward with a slight incentive curve.
 */
const calculatePrestigeGems = (currentLevel: number): number => {
    if (currentLevel < LEVEL_NEEDED_TO_PRESTIGE) return 0;

    const exponent = 1; // Keep this consistent for a similar feel
    const divisor = 7500;   // The balancing factor

    return Math.floor(Math.pow(calculateTotalExperienceForLevel(currentLevel - 1), exponent) / divisor);
};

interface MilestoneData {
    level: number;
    totalXp: number;
    xpGrowthPercent: number;
    points: number;
    pointsPerMillionXp: number;
    pointsGrowthPercent: number;
    gems: number;
    gemsPerMillionXp: number;
    gemsGrowthPercent: number;
}

// --- Refactored Milestone Table Component ---
const MilestonesTable: React.FC<{ data: MilestoneData[] }> = ({ data }) => {
    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Level</TableCell>
                        <TableCell align="right">Total XP</TableCell>
                        <TableCell align="right">
                            <Tooltip title="Percentage growth in total XP from the previous milestone">
                                <span>XP Growth</span>
                            </Tooltip>
                        </TableCell>
                        <TableCell align="right">
                            <Tooltip title="How many points you get for every 1 million XP earned since the last milestone">
                                <span>Points / 1M XP</span>
                            </Tooltip>
                        </TableCell>
                         <TableCell align="right">
                            <Tooltip title="Percentage growth in total points from the previous milestone">
                                <span>Points Growth</span>
                            </Tooltip>
                        </TableCell>
                        <TableCell align="right">
                            <Tooltip title="How many gems you get for every 1 million XP earned since the last milestone">
                                <span>Gems / 1M XP</span>
                            </Tooltip>
                        </TableCell>
                        <TableCell align="right">
                            <Tooltip title="Percentage growth in total gems from the previous milestone">
                                <span>Gems Growth</span>
                            </Tooltip>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => (
                        <TableRow key={row.level} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
                            <TableCell component="th" scope="row">
                                <Typography fontWeight="bold">{row.level}</Typography>
                            </TableCell>
                            <TableCell align="right">{formatNumber(row.totalXp)}</TableCell>
                            <TableCell align="right">{index === 0 ? '-' : `+${row.xpGrowthPercent.toFixed(2)}%`}</TableCell>
                            <TableCell align="right">{index === 0 ? '-' : formatNumber(row.pointsPerMillionXp)}</TableCell>
                             <TableCell align="right">{index === 0 || row.pointsGrowthPercent === Infinity ? '-' : `+${row.pointsGrowthPercent.toFixed(2)}%`}</TableCell>
                            <TableCell align="right">{index === 0 ? '-' : formatNumber(row.gemsPerMillionXp)}</TableCell>
                            <TableCell align="right">{index === 0 || row.gemsGrowthPercent === Infinity ? '-' : `+${row.gemsGrowthPercent.toFixed(2)}%`}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};


export const ExperiencePage: React.FC = () => {
    const [level, setLevel] = useState<number | string>(1);
    const [experience, setExperience] = useState<number | string>(0);

    const handleLevelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newLevel = parseInt(e.target.value);
        if (isNaN(newLevel) || newLevel < 1) {
            setLevel('');
            setExperience('');
            return;
        }
        setLevel(newLevel);
        const newExperience = calculateTotalExperienceForLevel(newLevel - 2);
        setExperience(newExperience >= 0 ? newExperience : 0);
    }, []);

    const handleExperienceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newExperience = parseInt(e.target.value);
        if (isNaN(newExperience) || newExperience < 0) {
            setExperience('');
            setLevel('');
            return;
        }
        setExperience(newExperience);
        const newLevel = calculateLevelFromExperience(newExperience);
        setLevel(newLevel);
    }, []);

    const results = useMemo(() => {
        const currentLevel = typeof level === 'number' ? level : 0;
        if (currentLevel <= 0) return null;

        const totalExperience = typeof experience === 'number' ? experience : 0;
        const prestigePoints = calculatePrestigePoints(currentLevel);
        const prestigeGems = calculatePrestigeGems(currentLevel);
        const xpForCurrentLevel = calculateTotalExperienceForLevel(currentLevel - 2);
        const xpForNextLevel = calculateTotalExperienceForLevel(currentLevel - 1);
        const xpInCurrentLevel = totalExperience - xpForCurrentLevel;
        const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;

        return {
            prestigePoints,
            prestigeGems,
            xpInCurrentLevel,
            xpNeededForNextLevel,
            canPrestige: currentLevel >= LEVEL_NEEDED_TO_PRESTIGE,
        };
    }, [level, experience]);

    const milestoneData = useMemo((): MilestoneData[] => {
        const levels = new Set([10, 50]);
        for (let i = 100; i <= 200; i += 10) levels.add(i);
        for (let i = 300; i <= 1000; i += 100) levels.add(i);

        const sortedLevels = Array.from(levels).sort((a, b) => a - b);
        let lastMilestone = { level: 0, totalXp: 0, points: 0, gems: 0 };

        return sortedLevels.map(level => {
            const totalXp = calculateTotalExperienceForLevel(level - 1);
            const points = calculatePrestigePoints(level);
            const gems = calculatePrestigeGems(level);

            // --- Growth Calculations ---
            const xpGrowth = totalXp - lastMilestone.totalXp;
            const pointsGrowth = points - lastMilestone.points;
            const gemsGrowth = gems - lastMilestone.gems;

            const xpGrowthPercent = lastMilestone.totalXp > 0 ? (xpGrowth / lastMilestone.totalXp) * 100 : 0;
            const pointsGrowthPercent = lastMilestone.points > 0 ? (pointsGrowth / lastMilestone.points) * 100 : Infinity;
            const gemsGrowthPercent = lastMilestone.gems > 0 ? (gemsGrowth / lastMilestone.gems) * 100 : Infinity;

            const pointsPerMillionXp = xpGrowth > 0 ? (pointsGrowth / xpGrowth) * 1_000_000 : 0;
            const gemsPerMillionXp = xpGrowth > 0 ? (gemsGrowth / xpGrowth) * 1_000_000 : 0;

            const milestone = {
                level, totalXp, xpGrowthPercent,
                points, pointsPerMillionXp, pointsGrowthPercent,
                gems, gemsPerMillionXp, gemsGrowthPercent,
            };
            lastMilestone = { level, totalXp, points, gems };
            return milestone;
        });
    }, []);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h2" component="h1" color="primary" gutterBottom>
                    Experience & Prestige Calculator
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Left Side: Inputs */}
                <Grid size={{xs: 12, md: 5}}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h5" gutterBottom>Player Stats</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <TextField
                                label="Player Level"
                                type="number" value={level} onChange={handleLevelChange}
                                helperText="Enter your level to see the total XP."
                                InputProps={{ inputProps: { min: 1 } }}
                            />
                            <TextField
                                label="Total Experience"
                                type="number" value={experience} onChange={handleExperienceChange}
                                helperText="Enter your total XP to see the level."
                                InputProps={{ inputProps: { min: 0 } }}
                            />
                        </Box>
                    </Paper>
                </Grid>

                {/* Right Side: Results */}
                <Grid size={{xs: 12, md: 7}}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h5" gutterBottom>Calculated Results</Typography>
                        {results && (
                            <Box>
                                <ResultDisplay
                                    label="XP Progress"
                                    value={`${formatNumber(results.xpInCurrentLevel)} / ${formatNumber(results.xpNeededForNextLevel)}`}
                                />
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" color={results.canPrestige ? 'success.main' : 'text.secondary'} gutterBottom>
                                    Prestige Rewards (at Level {LEVEL_NEEDED_TO_PRESTIGE})
                                </Typography>
                                <ResultDisplay label="Prestige Points Reward" value={formatNumber(results.prestigePoints)} />
                                <ResultDisplay label="Prestige Gems Reward" value={formatNumber(results.prestigeGems)} />
                            </Box>
                        )}
                    </Paper>
                </Grid>
                
                {/* New Bottom Section: Milestones Overview */}
                <Grid size={{xs: 12}}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h5" gutterBottom>Level Milestones</Typography>
                        <MilestonesTable data={milestoneData} />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};