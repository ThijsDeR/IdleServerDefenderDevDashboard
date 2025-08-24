// src/types/index.ts

// --- CORE GAME DATA TYPES ---

/**
 * Defines the shape of a single Cup object.
 */
export interface Cup {
    id: string;
    name: string;
    abbreviation: string;
    difficultyMultiplier: number;
}

// --- UPGRADE AND FORMULA TYPES ---

/**
 * Enum for the different categories of upgrades.
 * Using an enum is a common practice in TypeScript for fixed sets of values.
 */
export type UpgradeType = 'Utility' | 'Attack' | 'Defense';

export const UpgradeTypes = {
    Utility: 'Utility',
    Attack: 'Attack',
    Defense: 'Defense',
} as const;

/**
 * Enum for the different types of calculation formulas.
 */
export type FormulaType = 'increase' | 'simple' | 'advanced';

export const FormulaTypes = {
    Increase: 'increase',
    Simple: 'simple',
    Advanced: 'advanced',
} as const;

/**
 * Defines a single part of an Advanced Formula, which applies
 * at a certain level requirement.
 */
export interface AdvancedFormulaPart {
    count: number;
    increaseAmount: number;
    multiplierPer: number;
    multiplierPerAmount: number;
}


// --- Specific Formula Interfaces ---

/**
 * A base interface that all formula types will extend.
 */
interface BaseFormula {
    type: FormulaType;
    baseAmount: number;
}

/**
 * Interface for the 'Increase' formula type.
 */
export interface IncreaseFormula extends BaseFormula {
    type: 'increase';
    increaseAmount: number;
}

/**
 * Interface for the 'Simple' formula type.
 */
export interface SimpleFormula extends BaseFormula {
    type: 'simple';
    increaseAmount: number;
    multiplierPer: number;
    multiplierPerAmount: number;
}

/**
 * Interface for the 'Advanced' formula type.
 */
export interface AdvancedFormula extends BaseFormula {
    type: 'advanced';
    parts: AdvancedFormulaPart[];
}

/**
 * A union type that can represent any of the specific formula interfaces.
 * This allows for strong type checking based on the 'type' property.
 */
export type Formula = IncreaseFormula | SimpleFormula | AdvancedFormula;


/**
 * Defines the static properties of an upgrade, loaded from game data.
 */
export interface Upgrade {
    id: string;
    title: string;
    description: string;
    type: UpgradeType;
    maxBaseLevel: number;
    maxIncreaseLevel: number;
    baseCoinCost: number;
    baseUpgradeTime: number;
    coinCostFormula: Formula;
    baseValueFormula: Formula;
    increaseValueFormula: Formula;
}

/**
 * Represents the dynamic state of an upgrade, including player progress.
 */
export interface UpgradeState extends Upgrade {
    baseLevel: number;
    increaseLevel: number;
    coinOverride?: number; // Optional override for coin cost
    availableCoins?: number; // Optional available coins for the upgrade
}


// --- COMPONENT PROP TYPES ---

/**
 * Defines the props for the StatDisplay component.
 */
export interface StatDisplayProps {
    label: string;
    value: number;
}

/**
 * Defines the props for the CupCard component.
 */
export interface CupCardProps {
    cup: Cup;
    tier: number;
    onTierChange: (cupId: string, tier: number) => void;
}
