// src/components/UpgradeCard.tsx
import React, { useMemo } from 'react';
import { Card, CardContent, Typography, Box, TextField, Divider, Accordion, AccordionSummary, AccordionDetails, TableContainer, Table, TableHead, TableCell, Paper, TableRow, TableBody } from '@mui/material';
import type { Boost, Formula, UpgradeState } from '../types';
import { calculateAffordableLevels, getValueForSingleLevel } from '../lib/formulas';
import { ExpandMoreOutlined } from '@mui/icons-material';
import { BoostEditor } from './BoostEditor';
import { formatNumber } from '../lib/utils';

interface UpgradeCardProps {
    upgrade: UpgradeState;
    onOverrideChange: (id: string, value: number) => void;
    onBoostsChange: (id: string, type: 'general' | 'base' | 'increase', newBoosts: Boost[]) => void;
    coinsAvailable: number;
    speedDividerValue: number;
    timePassed: number;
}

// A small component to display a stat line item.
const StatDisplay = ({ label, value }: { label: string; value: string | number }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Typography variant="body2" fontWeight="bold">{value}</Typography>
    </Box>
);

/**
 * Calculates how many times an upgrade could have been performed in the given time,
 * considering the speed divider value and the upgrade time formula.
 * 
 * @param baseUpgradeTime - The base time for a single upgrade.
 * @param timePassed - The total time available for upgrades.
 * @param speedDividerValue - The value by which upgrade speed is divided.
 * @returns The number of upgrades that could have been performed.
 */
function calculateUpgradesInTime(
    baseUpgradeTime: number,
    timePassed: number,
    speedDividerValue: number
): number {
    let timeLeft = timePassed;
    let currentUpgrades = 0;

    while (true) {
        // Calculate time for the next upgrade
        const upgradeTime =
            (baseUpgradeTime *
                Math.pow(
                    2,
                    currentUpgrades /
                    Math.max(4 * Math.sqrt(currentUpgrades), 1)
                ) +
                currentUpgrades) /
            speedDividerValue;

        if (timeLeft >= upgradeTime) {
            timeLeft -= upgradeTime;
            currentUpgrades += 1;
        } else {
            break;
        }
    }

    console.log(`Total upgrades possible in time: ${currentUpgrades}`);

    return currentUpgrades;
}

/**
 * Calculates the total cost to upgrade from a starting level to an end level.
 */
const calculateTotalCostForLevels = (startLevel: number, endLevel: number, formula: Formula): number => {
    let totalCost = 0;
    for (let i = startLevel; i < endLevel; i++) {
        totalCost += getValueForSingleLevel(i + 1, formula);
    }
    return totalCost;
};

export const UpgradeCard: React.FC<UpgradeCardProps> = ({ upgrade, onOverrideChange, onBoostsChange, coinsAvailable, speedDividerValue, timePassed }) => {

    const { affordableBase, affordableIncrease, baseValue, increaseValue, endValue } = useMemo(() => {
        // Use the override value if it exists, otherwise use the coins passed in props
        const effectiveCoins = upgrade.coinOverride ?? coinsAvailable;

        // Calculate how many levels can be bought with the available coins
        const affordableBase = calculateAffordableLevels(
            upgrade.baseLevel,
            upgrade.maxBaseLevel,
            effectiveCoins / 2,
            upgrade.coinCostFormula
        );

        const affordableIncrease = calculateAffordableLevels(
            upgrade.increaseLevel,
            upgrade.maxIncreaseLevel,
            effectiveCoins / 2,
            upgrade.coinCostFormula
        );

        const generalBoosts = upgrade.generalBoosts || [];
        const baseBoosts = [...generalBoosts, ...(upgrade.baseBoosts || [])];
        const increaseBoosts = [...generalBoosts, ...(upgrade.increaseBoosts || [])];

        // Calculate the base and increase values using their respective formulas
        let base = getValueForSingleLevel(affordableBase, upgrade.baseValueFormula);
        let maxValue = upgrade.maxValue || 0;

        baseBoosts.forEach((boost) => {
            if (boost.type === "additive") {
                base += boost.value;
                maxValue += boost.value;
            } else {
                base *= boost.value;
                maxValue *= boost.value;
            }
        });

        let increase = getValueForSingleLevel(affordableIncrease, upgrade.increaseValueFormula);

        increaseBoosts.forEach((boost) => {
            if (boost.type === "additive") {
                increase += boost.value;
            } else {
                increase *= boost.value;
            }
        });

        // The total value is the base value plus the increase value.
        const total = base + (increase * calculateUpgradesInTime(upgrade.baseUpgradeTime, timePassed, upgrade.id === "speedDivider" ? 1 : speedDividerValue));

        let endValue;

        if (upgrade.id === "chargeDuration") endValue = upgrade.maxValue != undefined && total < maxValue ? maxValue : total;
        else endValue = upgrade.maxValue != undefined && total > maxValue ? maxValue : total;


        return {
            affordableBase: affordableBase,
            affordableIncrease: affordableIncrease,
            baseValue: base,
            increaseValue: increase,
            endValue: endValue,
        };
    }, [upgrade, coinsAvailable, speedDividerValue, timePassed]);

    const scalingData = useMemo(() => {
        // Dynamically generate intervals so that within 5 steps, we reach maxBaseLevel or maxIncreaseLevel
        const maxLevel = Math.max(upgrade.maxBaseLevel, upgrade.maxIncreaseLevel);
        const steps = 10;
        let intervals: number[] = [1, 10, 100, 500, 1000, 2000, 5000, 10000];

        for (let i = 0; i <= steps; i++) {
            const level = Math.round((i / steps) * maxLevel);
            if (!intervals.includes(level) && level > 1000) intervals.push(level);
        }

        let lastBaseValue = getValueForSingleLevel(0, upgrade.baseValueFormula);
        let lastIncreaseValue = getValueForSingleLevel(0, upgrade.increaseValueFormula);
        let lastCost = 0;

        return intervals
            .filter(level => level < maxLevel)
            .map(level => {
                const currentBaseValue = getValueForSingleLevel(level, upgrade.baseValueFormula);
                const currentIncreaseValue = getValueForSingleLevel(level, upgrade.increaseValueFormula);
                const currentCost = calculateTotalCostForLevels(0, level, upgrade.coinCostFormula);

                const baseValueGrowth = lastBaseValue > 0 ? (((currentBaseValue - lastBaseValue) / lastBaseValue)) * 100 : Infinity;
                const increaseValueGrowth = lastIncreaseValue > 0 ? ((currentIncreaseValue - lastIncreaseValue) / lastIncreaseValue) * 100 : Infinity;
                const costGrowth = lastCost > 0 ? ((currentCost - lastCost) / lastCost) * 100 : Infinity;

                const dataPoint = {
                    level,
                    increaseValue: currentIncreaseValue,
                    baseValue: currentBaseValue,
                    cost: currentCost,
                    baseValueGrowth,
                    increaseValueGrowth,
                    costGrowth,
                };

                lastBaseValue = currentBaseValue;
                lastIncreaseValue = currentIncreaseValue;
                lastCost = currentCost;

                return dataPoint;
            });
    }, [upgrade.baseValueFormula, upgrade.coinCostFormula, upgrade.maxBaseLevel]);

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>{upgrade.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: '40px' }}>
                    {upgrade.description}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="caption">
                        Type: {upgrade.type}
                    </Typography>

                    {/* Calculated Stats Section */}
                    <Box sx={{ p: 2, border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: 1 }}>
                        <StatDisplay label="Current Base Value" value={baseValue.toFixed(3)} />
                        <StatDisplay label="Current Increase Value" value={increaseValue.toFixed(3)} />
                        <Divider sx={{ my: 1 }} />
                        <StatDisplay label="Value At Time" value={endValue.toFixed(3)} />
                        <Divider sx={{ my: 1 }} />
                        <StatDisplay label="Affordable Base Levels" value={`${affordableBase} / ${upgrade.maxBaseLevel - upgrade.baseLevel}`} />
                        <StatDisplay label="Affordable Increase Levels" value={`${affordableIncrease} / ${upgrade.maxIncreaseLevel - upgrade.increaseLevel}`} />
                    </Box>

                    {/* Scaling Analysis Section */}
                    <Accordion sx={{ boxShadow: 'none', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                        <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                            <Typography variant="subtitle1">Scaling Analysis</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TableContainer component={Paper}>
                                <Table size="small" aria-label="scaling analysis table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Level</TableCell>
                                            <TableCell align="right">Base Value</TableCell>
                                            <TableCell align="right">% Base Val Growth</TableCell>
                                            <TableCell align="right">Increase Value</TableCell>
                                            <TableCell align="right">% Increase Val Growth</TableCell>
                                            <TableCell align="right">Total Cost</TableCell>
                                            <TableCell align="right">% Cost Growth</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {scalingData.map((row) => (
                                            <TableRow key={row.level}>
                                                <TableCell component="th" scope="row">{row.level}</TableCell>
                                                <TableCell align="right">{formatNumber(row.baseValue)}</TableCell>
                                                <TableCell align="right" sx={{ color: isFinite(row.baseValueGrowth) ? 'success.main' : 'text.secondary' }}>
                                                    {isFinite(row.baseValueGrowth) ? `+${formatNumber(row.baseValueGrowth)}%` : 'N/A'}
                                                </TableCell>
                                                <TableCell align="right">{formatNumber(row.increaseValue)}</TableCell>
                                                <TableCell align="right" sx={{ color: isFinite(row.increaseValueGrowth) ? 'success.main' : 'text.secondary' }}>
                                                    {isFinite(row.increaseValueGrowth) ? `+${formatNumber(row.increaseValueGrowth)}%` : 'N/A'}
                                                </TableCell>
                                                <TableCell align="right">{formatNumber(row.cost)}</TableCell>
                                                <TableCell align="right" sx={{ color: isFinite(row.costGrowth) ? 'error.main' : 'text.secondary' }}>
                                                    {isFinite(row.costGrowth) ? `+${formatNumber(row.costGrowth)}%` : 'N/A'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </AccordionDetails>
                    </Accordion>

                    <TextField
                        label="Available Coins Override"
                        type="number"
                        variant="outlined"
                        size="small"
                        value={upgrade.availableCoins ?? ''}
                        onChange={(e) => onOverrideChange(upgrade.id, parseInt(e.target.value))}
                        placeholder={`Default (from mode)`}
                    />
                </Box>

                {/* Boosts Section */}
                <Accordion sx={{ boxShadow: 'none', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                    <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                        <Typography variant="subtitle1">Modifiers & Boosts</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Divider>General Boosts</Divider>
                            {/* Editor for General Value Boosts */}
                            <BoostEditor
                                boosts={upgrade.generalBoosts ?? []}
                                onBoostsChange={(newBoosts) => onBoostsChange(upgrade.id, 'general', newBoosts)}
                            />
                            <Divider>Base Boosts</Divider>
                            {/* Editor for Base Value Boosts */}
                            <BoostEditor
                                boosts={upgrade.baseBoosts ?? []}
                                onBoostsChange={(newBoosts) => onBoostsChange(upgrade.id, 'base', newBoosts)}
                            />
                            <Divider>Increase Boosts</Divider>
                            {/* Editor for Increase Value Boosts */}
                            <BoostEditor
                                boosts={upgrade.increaseBoosts ?? []}
                                onBoostsChange={(newBoosts) => onBoostsChange(upgrade.id, 'increase', newBoosts)}
                            />
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </CardContent>
        </Card>
    );
};
