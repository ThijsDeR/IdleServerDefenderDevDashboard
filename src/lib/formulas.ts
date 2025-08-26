// src/lib/formulas.ts
import { FormulaTypes, type AdvancedFormula, type Formula, type IncreaseFormula, type SimpleFormula } from '../types';

/**
 * --- Formula Implementations ---
 * Each function here corresponds to a specific formula type from your C# code.
 */

/**
 * Calculates the cost for a single level using the 'Increase' formula.
 * This matches your C# IncreaseFormula.GetValue implementation.
 * Cost = baseAmount + (level * increaseAmount)
 */
const calculateIncreaseFormulaValue = (level: number, formula: IncreaseFormula): number => {
    const base = formula.baseAmount ?? 0;
    const increase = formula.increaseAmount ?? 0;
    return base + (level * increase);
};

/**
 * Calculates the cost for a single level using the 'Simple' formula.
 * This has been updated to match your C# SimpleFormula.GetValue implementation.
 */
const calculateSimpleFormulaValue = (level: number, formula: SimpleFormula): number => {
    const base = formula.baseAmount ?? 0;
    const increase = formula.increaseAmount ?? 0; // Corresponds to increaseNumber
    const multiplierPer = formula.multiplierPer ?? 1;
    const multiplierPerAmount = formula.multiplierPerAmount ?? 1;

    // Prevent division by zero
    if (multiplierPer === 0 || multiplierPerAmount === 0) return base;

    const part1 = (level * increase) / multiplierPer;
    const part2 = Math.pow(multiplierPer, 1 + (level / multiplierPerAmount));

    return base + (part1 * part2);
};


/**
 * Calculates the cost for a single level using the 'Advanced' formula.
 * This function replicates the complex cumulative calculation from your C# code.
 */
const calculateAdvancedFormulaValue = (level: number, formula: AdvancedFormula): number => {
    let totalValue = 0;
    let levelsRemaining = level;
    let currentLevelCount = 0;
    let partCounts = 0;

    // This logic calculates the cost of a single level by summing the effects
    // of all formula parts leading up to that level.
    for (const part of formula.parts) {
        if (levelsRemaining <= 0) break;

        const increaseCount = Math.min(levelsRemaining, part.count);
        // The multiplierCount is the total level count capped at the part's max count

        // This calculation is equivalent to the C# AdvancedFormulaPart.GetValue
        const partValue = formula.baseAmount +
            (((increaseCount * part.increaseAmount) / part.multiplierPer) * Math.pow(part.multiplierPer, 1 + (Math.min(level, partCounts + part.count) / part.multiplierPerAmount)));
        
        totalValue += partValue;
        levelsRemaining -= part.count;
        currentLevelCount += part.count;
        partCounts += part.count;
    }

    return totalValue;
};


/**
 * --- Main Calculation Logic ---
 */

/**
 * A central dispatcher that calculates the cost for a single level
 * based on the provided formula type.
 */
export const getValueForSingleLevel = (level: number, formula: Formula): number => {
    switch (formula.type) {
        case FormulaTypes.Increase:
            return calculateIncreaseFormulaValue(level, formula);
        case FormulaTypes.Simple:
            return calculateSimpleFormulaValue(level, formula);
        case FormulaTypes.Advanced:
            return calculateAdvancedFormulaValue(level, formula);
        default:
            return 0; // Fallback
    }
};

/**
 * Calculates the total cost to purchase a specific number of levels for an upgrade.
 * This function replicates the logic from your C# `GetCoinCosts` method.
 *
 * @param startLevel The current level of the upgrade.
 * @param levelsToBuy The number of levels the user wants to purchase.
 * @param maxLevel The maximum possible level for this upgrade.
 * @param formula The formula object that defines how cost scales.
 * @returns The total coin cost for all the levels combined.
 */
export const calculateTotalUpgradeCost = (
    startLevel: number,
    levelsToBuy: number,
    maxLevel: number,
    formula: Formula
): number => {
    let totalCost = 0;
    // Ensure we don't try to buy more levels than possible
    const endLevel = Math.min(startLevel + levelsToBuy, maxLevel);

    // Sum the cost for each individual level from the start to the end
    for (let i = startLevel; i < endLevel; i++) {
        totalCost += getValueForSingleLevel(i, formula);
    }

    return totalCost;
};

/**
 * Calculates how many levels can be bought with a given amount of coins.
 * This replicates the logic from your C# `GetAmountOfLevels` method for the "max" option.
 *
 * @param startLevel The current level of the upgrade.
 * @param maxLevel The maximum possible level for this upgrade.
 * @param coinsAvailable The total number of coins the user has.
 * @param formula The formula object that defines how cost scales.
 * @returns The number of levels that can be afforded.
 */
export const calculateAffordableLevels = (
    startLevel: number,
    maxLevel: number,
    coinsAvailable: number,
    formula: Formula
): number => {
    let currentCost = 0;
    let levelsBought = 0;
    let nextLevel = startLevel;

    while (nextLevel < maxLevel) {
        const costOfNextLevel = getValueForSingleLevel(nextLevel, formula);
        if (currentCost + costOfNextLevel <= coinsAvailable) {
            currentCost += costOfNextLevel;
            levelsBought++;
            nextLevel++;
        } else {
            // Can't afford the next level, so stop
            break;
        }
    }

    return levelsBought;
};
