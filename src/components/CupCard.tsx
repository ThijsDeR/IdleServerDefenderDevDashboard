// src/components/CupCard.tsx
import React, { useMemo } from 'react';
import { Card, CardContent, Typography, Box, FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent} from '@mui/material';
import { tierDifficultyMultipliers } from '../data/gameData';
import { calculateEnemyHealth, calculateEnemyDamage, formatNumber } from '../lib/utils';
import type { CupCardProps } from '../types';

const StatDisplay: React.FC<{ label: string; value: number }> = ({ label, value }) => (
    <Box>
        <Typography variant="body2" color="primary.light">{label}</Typography>
        <Typography variant="h5" component="p" fontWeight="bold">{formatNumber(value)}</Typography>
    </Box>
);

export const CupCard: React.FC<CupCardProps> = ({ cup, tier, onTierChange, wave }) => {
    const tierLabel = `Tier ${tier} Health`;
    const tierDamageLabel = `Tier ${tier} Damage`;
    
    const finalDifficulty = cup.difficultyMultiplier * tierDifficultyMultipliers[tier - 1];

    const { health, damage } = useMemo(() => ({
        health: calculateEnemyHealth(wave, finalDifficulty),
        damage: calculateEnemyDamage(wave, finalDifficulty),
    }), [finalDifficulty, wave]);

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3" gutterBottom>{cup.name}</Typography>
                <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                    Base Difficulty: {cup.difficultyMultiplier}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <StatDisplay label={tierLabel} value={health} />
                    <StatDisplay label={tierDamageLabel} value={damage} />
                </Box>
            </CardContent>
            <Box sx={{ p: 2, pt: 0 }}>
                <FormControl fullWidth>
                    <InputLabel id={`tier-select-label-${cup.id}`}>View Tier</InputLabel>
                    <Select
                        labelId={`tier-select-label-${cup.id}`}
                        id={`tier-select-${cup.id}`}
                        value={tier.toString()}
                        label="View Tier"
                        onChange={(e: SelectChangeEvent) => onTierChange(cup.id, parseInt(e.target.value))}
                    >
                        {tierDifficultyMultipliers.map((multiplier, index) => (
                            <MenuItem key={index} value={index + 1}>
                                Tier {index + 1} (x{multiplier} difficulty)
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        </Card>
    );
};
