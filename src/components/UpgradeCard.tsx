// src/components/UpgradeCard.tsx
import React, { useMemo } from 'react';
import { Card, CardContent, Typography, Box, TextField, Divider } from '@mui/material';
import type { UpgradeState } from '../types';
import { calculateAffordableLevels, getValueForSingleLevel } from '../lib/formulas';

interface UpgradeCardProps {
    upgrade: UpgradeState;
    onOverrideChange: (id: string, value: number) => void;
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



export const UpgradeCard: React.FC<UpgradeCardProps> = ({ upgrade, onOverrideChange, coinsAvailable, speedDividerValue, timePassed }) => {

    const { affordableLevels, baseValue, increaseValue, endValue } = useMemo(() => {
        // Use the override value if it exists, otherwise use the coins passed in props
        const effectiveCoins = upgrade.coinOverride ?? coinsAvailable;

        // Calculate how many levels can be bought with the available coins
        const affordableBase = calculateAffordableLevels(
            upgrade.baseLevel,
            upgrade.maxBaseLevel,
            effectiveCoins,
            upgrade.coinCostFormula
        );

        const affordableIncrease = calculateAffordableLevels(
            upgrade.increaseLevel,
            upgrade.maxIncreaseLevel,
            effectiveCoins,
            upgrade.coinCostFormula
        );

        // Calculate the base and increase values using their respective formulas
        const base = getValueForSingleLevel(affordableBase, upgrade.baseValueFormula);
        const increase = getValueForSingleLevel(affordableIncrease, upgrade.increaseValueFormula);

        // The total value is the base value plus the increase value.
        const total = base + (increase * calculateUpgradesInTime(upgrade.baseUpgradeTime, timePassed, upgrade.id === "speedDivider" ? 1 : speedDividerValue));

        return {
            affordableLevels: affordableBase,
            baseValue: base,
            increaseValue: increase,
            endValue: total,
        };
    }, [upgrade, coinsAvailable, speedDividerValue, timePassed]);

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
                        <StatDisplay label="Affordable Levels" value={`${affordableLevels} / ${upgrade.maxBaseLevel - upgrade.baseLevel}`} />
                    </Box>
                    
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
            </CardContent>
        </Card>
    );
};
