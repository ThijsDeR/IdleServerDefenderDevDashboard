// src/components/BoostEditor.tsx
import React from 'react';
import { Box, Typography, TextField, Select, MenuItem, IconButton, type SelectChangeEvent } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import type { Boost, BoostType } from '../types';

interface BoostEditorProps {
    boosts: Boost[];
    onBoostsChange: (newBoosts: Boost[]) => void;
}

export const BoostEditor: React.FC<BoostEditorProps> = ({ boosts, onBoostsChange }) => {

    const handleBoostChange = (index: number, field: keyof Boost, value: string | number) => {
        const newBoosts = [...boosts];
        (newBoosts[index] as any)[field] = value;
        onBoostsChange(newBoosts);
    };

    const addBoost = () => {
        const newBoosts = [...boosts, { name: 'New Boost', type: 'additive' as BoostType, value: 0 }];
        onBoostsChange(newBoosts);
    };

    const removeBoost = (index: number) => {
        const newBoosts = boosts.filter((_, i) => i !== index);
        onBoostsChange(newBoosts);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2">Boosts</Typography>
                <IconButton onClick={addBoost} size="small">
                    <AddCircleOutlineIcon />
                </IconButton>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {boosts.map((boost, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <TextField
                            label="Name"
                            size="small"
                            variant="outlined"
                            value={boost.name}
                            onChange={(e) => handleBoostChange(index, 'name', e.target.value)}
                            sx={{ flexGrow: 1 }}
                        />
                        <Select
                            size="small"
                            value={boost.type}
                            onChange={(e: SelectChangeEvent) => handleBoostChange(index, 'type', e.target.value)}
                        >
                            <MenuItem value="additive">+</MenuItem>
                            <MenuItem value="multiplicative">*</MenuItem>
                        </Select>
                        <TextField
                            label="Value"
                            type="text"
                            size="small"
                            variant="outlined"
                            value={boost.value}
                            onChange={(e) => handleBoostChange(index, 'value', e.target.value)}
                            sx={{ width: '80px' }}
                        />
                        <IconButton onClick={() => removeBoost(index)} size="small">
                            <RemoveCircleOutlineIcon />
                        </IconButton>
                    </Box>
                ))}
                {boosts.length === 0 && (
                    <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                        No boosts added.
                    </Typography>
                )}
            </Box>
        </Box>
    );
};
