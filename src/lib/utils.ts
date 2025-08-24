// src/lib/utils.ts

// --- BALANCING CONFIGURATION ---
// Set your desired difficulty progression here.

const cups = 10;

const CUP_JUMP_MULTIPLIERS = [11]

for(let i = 1; i < cups; i++) {
    CUP_JUMP_MULTIPLIERS.push(CUP_JUMP_MULTIPLIERS[i - 1] + (1 + i));
}

console.log(CUP_JUMP_MULTIPLIERS)

/**
 * Calculates a scaling factor based on the cup's difficulty multiplier 'd'.
 * This function is the core of the progressive difficulty jump.
 */
/**
 * Calculates a scaling factor based on the cup's difficulty multiplier 'd'.
 * This function is the core of the progressive difficulty jump.
 */
const getCupProgressionFactor = (d: number): number => {
    // Return 1 for invalid or base difficulty values to prevent errors.
    if (d <= 1) return 1;

    /**
     * Calculates the total factor for a given integer cup index based on the configuration.
     */
    const calculateFactorForIndex = (index: number): number => {
        if (index <= 0) return 1;
        let factor = 1;
        // Loop through the multipliers for each jump up to the target index.
        for (let i = 0; i < index; i++) {
            // Use the defined multiplier for the jump, or the last one if we go beyond the array.
            const multiplier = CUP_JUMP_MULTIPLIERS[i] || CUP_JUMP_MULTIPLIERS[CUP_JUMP_MULTIPLIERS.length - 1];
            factor *= multiplier;
        }
        return factor;
    };

    const cupIndexFloat = Math.log2(d);
    const lowerIndex = Math.floor(cupIndexFloat);
    const fraction = cupIndexFloat - lowerIndex;

    const lowerFactor = calculateFactorForIndex(lowerIndex);
    const upperFactor = calculateFactorForIndex(lowerIndex + 1);

    // Use exponential interpolation for smooth tier scaling.
    const ratio = upperFactor / lowerFactor;
    return lowerFactor * Math.pow(ratio, fraction);
};

/**
 * Calculates enemy health based on wave (x) and a difficulty multiplier (d).
 */
export const calculateEnemyHealth = (x: number, d: number): number => {
    const baseHealth = 5;

    const cupFactor = getCupProgressionFactor(d);

    const waveMultiplier = (1 + (x - 1) * 0.5) + Math.pow(10, (x - 1) / 100) - 1;

    return (baseHealth * cupFactor * waveMultiplier) + cupFactor;
};

/**
 * Calculates enemy damage based on wave (x) and a difficulty multiplier (d).
 */
export const calculateEnemyDamage = (x: number, d: number): number => {
    const baseDamage = 1;

    const cupFactor = getCupProgressionFactor(d / 2);

    const waveMultiplier = (1 + (x - 1) * 0.5) + Math.pow(10, (x - 1) / 200) - 1;

    return (baseDamage * cupFactor * waveMultiplier) + cupFactor;
};

/**
 * Formats a number, using exponential notation for large values.
 */
export const formatNumber = (num: number): string => {
    if (num < 1e6) {
        return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
    }
    return num.toExponential(2);
};
