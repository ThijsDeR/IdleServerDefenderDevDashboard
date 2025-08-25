// src/data/upgradeData.ts
import { type Upgrade, UpgradeTypes, FormulaTypes, type SimpleFormula, type AdvancedFormula } from '../types';

// --- NOTE ---
// You will need to add a new formula type and update your existing types.
//
// export interface IncreaseFormula {
//  type: FormulaTypes.Increase;
//  baseAmount: number;
//  increaseAmount: number;
// }
//
// export enum FormulaTypes {
//  ...,
//  Increase
// }
//
// export type Formula = SimpleFormula | AdvancedFormula | IncreaseFormula;
// ---

// --- FORMULA DEFINITIONS ---

const defaultCoinCostFormula: SimpleFormula = {
    type: FormulaTypes.Simple,
    baseAmount: 100,
    increaseAmount: 20,
    multiplierPer: 25,
    multiplierPerAmount: 800,
};

const defaultMediumCoinCostFormula: SimpleFormula = {
    type: FormulaTypes.Simple,
    baseAmount: 100,
    increaseAmount: 50,
    multiplierPer: 25,
    multiplierPerAmount: 500,
};

const defaultExpensiveCoinCostFormula: SimpleFormula = {
    type: FormulaTypes.Simple,
    baseAmount: 1000,
    increaseAmount: 2000,
    multiplierPer: 2,
    multiplierPerAmount: 10,
};

const defaultCheapCoinCostFormula: AdvancedFormula = {
    type: FormulaTypes.Advanced,
    baseAmount: 100,
    parts: [
        { count: 5000, increaseAmount: 20, multiplierPer: 2.5, multiplierPerAmount: 500 },
        { count: 45000, increaseAmount: 20, multiplierPer: 2.4, multiplierPerAmount: 500 },
        { count: 100000, increaseAmount: 20, multiplierPer: 2.3, multiplierPerAmount: 500 },
    ]
};

// --- UPGRADE DATA ---

export const initialUpgrades: Upgrade[] = [
    {
        id: 'coinsPerWave',
        title: 'Coins Per Wave',
        description: 'Get coins every wave. The amount of coins you get is based on your current level and increase level.',
        type: UpgradeTypes.Utility,
        maxBaseLevel: 500,
        maxIncreaseLevel: 1000,
        baseCoinCost: 5000,
        baseUpgradeTime: 60,
        coinCostFormula: { ...defaultMediumCoinCostFormula, baseAmount: 5000 },
        baseValueFormula: { type: FormulaTypes.Increase, baseAmount: 0, increaseAmount: 5 },
        increaseValueFormula: { type: FormulaTypes.Increase, baseAmount: 0.2, increaseAmount: 0.2 },
        generalBoosts: [
            { name: 'CPW Download', type: 'multiplicative', value: 1 }
        ],
    },
    {
        id: 'cashPerWave',
        title: 'Bits Per Wave',
        description: 'Get bits every wave. The amount of bits you get is based on your current level and increase level.',
        type: UpgradeTypes.Utility,
        maxBaseLevel: 500,
        maxIncreaseLevel: 1000,
        baseCoinCost: 100,
        baseUpgradeTime: 60,
        coinCostFormula: { ...defaultCoinCostFormula, baseAmount: 100 },
        baseValueFormula: { type: FormulaTypes.Increase, baseAmount: 0, increaseAmount: 2 },
        increaseValueFormula: { type: FormulaTypes.Increase, baseAmount: 0.01, increaseAmount: 0.01 },
        generalBoosts: [
            { name: 'BPW Download', type: 'multiplicative', value: 1 }
        ],
    },
    {
        id: 'cashPerEnemy',
        title: 'Bits Per Enemy',
        description: 'Get bits for every enemy you kill. The amount of bits you get is based on your current level and increase level.',
        type: UpgradeTypes.Utility,
        maxBaseLevel: 380,
        maxIncreaseLevel: 800,
        baseCoinCost: 100,
        baseUpgradeTime: 60,
        coinCostFormula: { ...defaultCoinCostFormula, baseAmount: 100 },
        baseValueFormula: { type: FormulaTypes.Increase, baseAmount: 1, increaseAmount: 0.005 },
        increaseValueFormula: { type: FormulaTypes.Increase, baseAmount: 0.001, increaseAmount: 0.001 },
        generalBoosts: [
            { name: 'BPE Download', type: 'multiplicative', value: 1 },
        ],
        baseBoosts: [
            { name: 'BPE Prestige', type: 'multiplicative', value: 1 }
        ],
        increaseBoosts: [
            { name: 'BPE Prestige', type: 'multiplicative', value: 1 }
        ]
    },
    {
        id: 'coinsPerEnemy',
        title: 'Coins Per Enemy',
        description: 'Get coins for every enemy you kill. The amount of coins you get is based on your current level and increase level.',
        type: UpgradeTypes.Utility,
        maxBaseLevel: 2000,
        maxIncreaseLevel: 10000,
        baseCoinCost: 100,
        baseUpgradeTime: 60,
        coinCostFormula: { ...defaultMediumCoinCostFormula, baseAmount: 100 },
        baseValueFormula: { type: FormulaTypes.Increase, baseAmount: 1, increaseAmount: 0.1 },
        increaseValueFormula: { type: FormulaTypes.Increase, baseAmount: 0.01, increaseAmount: 0.01 },
        generalBoosts: [
            { name: 'CPE Download', type: 'multiplicative', value: 1 }
        ],
        baseBoosts: [
            { name: 'CPE Prestige', type: 'multiplicative', value: 1 }
        ],
        increaseBoosts: [
            { name: 'CPE Prestige', type: 'multiplicative', value: 1 }
        ]
    },
    {
        id: 'speedDivider',
        title: 'Speed Divider',
        description: 'This upgrade will increase the speed of the game. The higher the level, the more speed you get. The speed is divided by this value.',
        type: UpgradeTypes.Utility,
        maxBaseLevel: 475,
        maxIncreaseLevel: 10000,
        baseCoinCost: 10000,
        baseUpgradeTime: 300,
        coinCostFormula: { ...defaultExpensiveCoinCostFormula, baseAmount: 10000 },
        baseValueFormula: { type: FormulaTypes.Increase, baseAmount: 1, increaseAmount: 1 / 25 },
        increaseValueFormula: { type: FormulaTypes.Simple, baseAmount: 0.01, increaseAmount: 0.01, multiplierPer: 1.01, multiplierPerAmount: 1000 },
        generalBoosts: [
            { name: 'SD Boost', type: 'multiplicative', value: 1 },
            { name: 'SD Download', type: 'multiplicative', value: 1 },
            { name: 'SD Module', type: 'multiplicative', value: 1 }
        ],
        baseBoosts: [
            { name: 'SD Prestige', type: 'multiplicative', value: 1 },
        ],
        increaseBoosts: [
            { name: 'SD Prestige', type: 'multiplicative', value: 1 },
        ]
    },
    {
        id: 'health',
        title: 'Health',
        description: 'This is your health. If it reaches 0, you lose the game. You can upgrade your health to increase your maximum health.',
        type: UpgradeTypes.Defense,
        maxBaseLevel: 80000,
        maxIncreaseLevel: 100000,
        baseCoinCost: 100,
        baseUpgradeTime: 20,
        coinCostFormula: { ...defaultCheapCoinCostFormula, baseAmount: 100 },
        baseValueFormula: { type: FormulaTypes.Simple, baseAmount: 50, increaseAmount: 25, multiplierPer: 10, multiplierPerAmount: 650 },
        increaseValueFormula: { type: FormulaTypes.Simple, baseAmount: 0.5, increaseAmount: 0.5, multiplierPer: 5, multiplierPerAmount: 550 },
        generalBoosts: [
            { name: 'Health Boost', type: 'multiplicative', value: 1 },
            { name: 'Health Download', type: 'multiplicative', value: 1 },
            { name: 'Health Module', type: 'multiplicative', value: 1 }
        ],
        baseBoosts: [
            { name: 'Health Prestige', type: 'multiplicative', value: 1 },
            
        ],
        increaseBoosts: [
            { name: 'Health Prestige', type: 'multiplicative', value: 1 },
        ]
    },
    {
        id: 'healthRegen',
        title: 'Health Regen',
        description: 'This is your health regeneration. It will regenerate your health every second.',
        type: UpgradeTypes.Defense,
        maxBaseLevel: 80000,
        maxIncreaseLevel: 100000,
        baseCoinCost: 100,
        baseUpgradeTime: 20,
        coinCostFormula: { ...defaultCheapCoinCostFormula, baseAmount: 100 },
        baseValueFormula: { type: FormulaTypes.Simple, baseAmount: 5, increaseAmount: 2.5, multiplierPer: 10, multiplierPerAmount: 650 },
        increaseValueFormula: { type: FormulaTypes.Simple, baseAmount: 0.2, increaseAmount: 0.2, multiplierPer: 2, multiplierPerAmount: 550 },
        generalBoosts: [
            { name: 'Health Regen Boost', type: 'multiplicative', value: 1 },
            { name: 'Health Regen Download', type: 'multiplicative', value: 1 },
            { name: 'Health Regen Module', type: 'multiplicative', value: 1 }
        ],
        baseBoosts: [
            { name: 'Health Regen Prestige', type: 'multiplicative', value: 1 },
        ],
        increaseBoosts: [
            { name: 'Health Regen Prestige', type: 'multiplicative', value: 1 },
        ]
    },
    {
        id: 'damage',
        title: 'Damage',
        description: 'This is your damage. It will increase the amount of damage you deal to enemies.',
        type: UpgradeTypes.Attack,
        maxBaseLevel: 80000,
        maxIncreaseLevel: 100000,
        baseCoinCost: 100,
        baseUpgradeTime: 20,
        coinCostFormula: { ...defaultCheapCoinCostFormula, baseAmount: 100 },
        baseValueFormula: { type: FormulaTypes.Simple, baseAmount: 20, increaseAmount: 10, multiplierPer: 10, multiplierPerAmount: 650 },
        increaseValueFormula: { type: FormulaTypes.Simple, baseAmount: 0.25, increaseAmount: 0.25, multiplierPer: 5, multiplierPerAmount: 550 },
        generalBoosts: [
            { name: 'Damage Boost', type: 'multiplicative', value: 1 },
            { name: 'Damage Download', type: 'multiplicative', value: 1 },
            { name: 'Damage Module', type: 'multiplicative', value: 1 }
        ],
        baseBoosts: [
            { name: 'Damage Prestige', type: 'multiplicative', value: 1 },
        ],
        increaseBoosts: [
            { name: 'Damage Prestige', type: 'multiplicative', value: 1 },
        ]
    },
    {
        id: 'attackSpeed',
        title: 'Attack Speed',
        description: 'This is your attack speed. It will increase the amount of attacks you can do per second.',
        type: UpgradeTypes.Attack,
        maxBaseLevel: 180,
        maxIncreaseLevel: 800,
        baseCoinCost: 1000,
        baseUpgradeTime: 60,
        coinCostFormula: { ...defaultExpensiveCoinCostFormula, baseAmount: 1000 },
        baseValueFormula: { type: FormulaTypes.Increase, baseAmount: 1, increaseAmount: 1 / 75 },
        increaseValueFormula: { type: FormulaTypes.Increase, baseAmount: 0.002, increaseAmount: 0.002 },
        generalBoosts: [
            { name: 'Attack Speed Boost', type: 'multiplicative', value: 1 },
            { name: 'Attack Speed Download', type: 'multiplicative', value: 1 },
            { name: 'Attack Speed Module', type: 'multiplicative', value: 1 }
        ],
        baseBoosts: [
            { name: 'Attack Speed Prestige', type: 'multiplicative', value: 1 },
        ],
        increaseBoosts: [
            { name: 'Attack Speed Prestige', type: 'multiplicative', value: 1 },
        ]
    },
    {
        id: 'critDamage',
        title: 'Crit Damage',
        description: 'This is your critical damage. It will increase the amount of damage you deal with critical hits.',
        type: UpgradeTypes.Attack,
        maxBaseLevel: 300,
        maxIncreaseLevel: 500,
        baseCoinCost: 100,
        baseUpgradeTime: 60,
        coinCostFormula: { ...defaultExpensiveCoinCostFormula, baseAmount: 100 },
        baseValueFormula: { type: FormulaTypes.Increase, baseAmount: 2, increaseAmount: 0.01 },
        increaseValueFormula: { type: FormulaTypes.Increase, baseAmount: 0.001, increaseAmount: 0.001 },
        generalBoosts: [
            { name: 'Crit Damage Boost', type: 'multiplicative', value: 1 },
        ],
        baseBoosts: [
            { name: 'Crit Damage Prestige', type: 'multiplicative', value: 1 },
        ],
        increaseBoosts: [
            { name: 'Crit Damage Prestige', type: 'multiplicative', value: 1 },
        ]
    },
    {
        id: 'critChance',
        title: 'Crit Chance',
        description: 'This is your critical chance. It will increase the chance of dealing a critical hit.',
        type: UpgradeTypes.Attack,
        maxBaseLevel: 200,
        maxIncreaseLevel: 800,
        baseCoinCost: 100,
        baseUpgradeTime: 60,
        coinCostFormula: { ...defaultExpensiveCoinCostFormula, baseAmount: 100 },
        baseValueFormula: { type: FormulaTypes.Increase, baseAmount: 0, increaseAmount: 0.01 },
        increaseValueFormula: { type: FormulaTypes.Increase, baseAmount: 0.001, increaseAmount: 0.001 },
        baseBoosts: [
            { name: 'Crit Chance Boost', type: 'additive', value: 0 },
            { name: 'Crit Chance Prestige', type: 'additive', value: 1 },
        ],
        increaseBoosts: [
            { name: 'Crit Chance Prestige', type: 'multiplicative', value: 1 },
        ]
    },
    {
        id: 'defense',
        title: 'Defense',
        description: 'This is your defense. It will reduce the amount of damage you take from enemies.',
        type: UpgradeTypes.Defense,
        maxBaseLevel: 300,
        maxIncreaseLevel: 1000,
        baseCoinCost: 100,
        baseUpgradeTime: 20,
        coinCostFormula: { ...defaultCoinCostFormula, baseAmount: 100 },
        baseValueFormula: { type: FormulaTypes.Increase, baseAmount: 0, increaseAmount: 0.01 },
        increaseValueFormula: { type: FormulaTypes.Increase, baseAmount: 0.001, increaseAmount: 0.001 },
        baseBoosts: [
            { name: 'Defense Boost', type: 'additive', value: 0 },
            { name: 'Defense Prestige', type: 'additive', value: 1 },
        ],
        increaseBoosts: [
            { name: 'Defense Prestige', type: 'multiplicative', value: 1 },
        ]
    },
    {
        id: 'stunChance',
        title: 'Stun Chance',
        description: 'This is your stun chance. It will increase the chance of stunning enemies.',
        type: UpgradeTypes.Attack,
        maxBaseLevel: 500,
        maxIncreaseLevel: 1000,
        baseCoinCost: 100,
        baseUpgradeTime: 60,
        coinCostFormula: { ...defaultExpensiveCoinCostFormula, baseAmount: 100 },
        baseValueFormula: { type: FormulaTypes.Increase, baseAmount: 0, increaseAmount: 0.001 },
        increaseValueFormula: { type: FormulaTypes.Increase, baseAmount: 0.00002, increaseAmount: 0.00002 },
        baseBoosts: [
            { name: 'Stun Chance Boost', type: 'additive', value: 0 },
            { name: 'Stun Chance Prestige', type: 'additive', value: 1 },
        ],
        increaseBoosts: [
            { name: 'Stun Chance Prestige', type: 'multiplicative', value: 1 },
        ]
    },
    {
        id: 'stunDuration',
        title: 'Stun Duration',
        description: 'This is your stun duration. It will increase the duration of the stun effect on enemies.',
        type: UpgradeTypes.Attack,
        maxBaseLevel: 2000,
        maxIncreaseLevel: 1000,
        baseCoinCost: 10000,
        baseUpgradeTime: 60,
        coinCostFormula: { ...defaultExpensiveCoinCostFormula, baseAmount: 10000 },
        baseValueFormula: { type: FormulaTypes.Increase, baseAmount: 0.25, increaseAmount: 0.0005 },
        increaseValueFormula: { type: FormulaTypes.Increase, baseAmount: 0.0002, increaseAmount: 0.0002 },
        baseBoosts: [
            { name: 'Stun Duration Boost', type: 'additive', value: 0 },
            { name: 'Stun Duration Prestige', type: 'additive', value: 1 },
        ],
        increaseBoosts: [
            { name: 'Stun Duration Prestige', type: 'multiplicative', value: 1 },
        ]
    },
    {
        id: 'chargeDamage',
        title: 'Charge Damage',
        description: 'This is your charge damage. It will increase the amount of damage you deal with charged attacks.',
        type: UpgradeTypes.Attack,
        maxBaseLevel: 300,
        maxIncreaseLevel: 500,
        baseCoinCost: 100,
        baseUpgradeTime: 60,
        coinCostFormula: { ...defaultExpensiveCoinCostFormula, baseAmount: 100 },
        baseValueFormula: { type: FormulaTypes.Increase, baseAmount: 2, increaseAmount: 0.01 },
        increaseValueFormula: { type: FormulaTypes.Increase, baseAmount: 0.001, increaseAmount: 0.001 },
        baseBoosts: [
            { name: 'Charge Damage Module', type: 'multiplicative', value: 1 },
        ],
        increaseBoosts: [
            { name: 'Charge Damage Module', type: 'multiplicative', value: 1 },
        ]
    },
    {
        id: 'chargeDuration',
        title: 'Charge Duration',
        description: 'This is your charge duration. It will decrease the time it takes to charge your attacks.',
        type: UpgradeTypes.Attack,
        maxBaseLevel: 400,
        maxIncreaseLevel: 1000,
        baseCoinCost: 100,
        baseUpgradeTime: 60,
        coinCostFormula: { ...defaultExpensiveCoinCostFormula, baseAmount: 100 },
        baseValueFormula: { type: FormulaTypes.Increase, baseAmount: 0, increaseAmount: 0.1 },
        increaseValueFormula: { type: FormulaTypes.Increase, baseAmount: 0.01, increaseAmount: 0.01 }
    },
    {
        id: 'shield',
        title: 'Shield',
        description: 'This is your shield. It will absorb damage from enemies.',
        type: UpgradeTypes.Defense,
        maxBaseLevel: 80000,
        maxIncreaseLevel: 100000,
        baseCoinCost: 500,
        baseUpgradeTime: 60,
        coinCostFormula: { ...defaultCheapCoinCostFormula, baseAmount: 500 },
        baseValueFormula: { type: FormulaTypes.Simple, baseAmount: 100, increaseAmount: 25, multiplierPer: 10, multiplierPerAmount: 650 },
        increaseValueFormula: { type: FormulaTypes.Simple, baseAmount: 1, increaseAmount: 1, multiplierPer: 5, multiplierPerAmount: 500 },
        generalBoosts: [
            { name: 'Shield Boost', type: 'multiplicative', value: 1 },
            { name: 'Shield Module', type: 'multiplicative', value: 1 },
        ],
        baseBoosts: [
            { name: 'Shield Prestige', type: 'multiplicative', value: 1 },
        ],
        increaseBoosts: [
            { name: 'Shield Prestige', type: 'multiplicative', value: 1 },
        ]
    },
    {
        id: 'shieldRegen',
        title: 'Shield Regen',
        description: 'This is your shield regeneration. It will regenerate your shield every second.',
        type: UpgradeTypes.Defense,
        maxBaseLevel: 80000,
        maxIncreaseLevel: 100000,
        baseCoinCost: 500,
        baseUpgradeTime: 60,
        coinCostFormula: { ...defaultCheapCoinCostFormula, baseAmount: 500 },
        baseValueFormula: { type: FormulaTypes.Simple, baseAmount: 2, increaseAmount: 2.5, multiplierPer: 10, multiplierPerAmount: 650 },
        increaseValueFormula: { type: FormulaTypes.Simple, baseAmount: 0.125, increaseAmount: 0.125, multiplierPer: 2, multiplierPerAmount: 550 },
        generalBoosts: [
            { name: 'Shield Regen Boost', type: 'multiplicative', value: 1 },
            { name: 'Shield Regen Module', type: 'multiplicative', value: 1 },
        ],
        baseBoosts: [
            { name: 'Shield Regen Prestige', type: 'multiplicative', value: 1 },
        ],
        increaseBoosts: [
            { name: 'Shield Regen Prestige', type: 'multiplicative', value: 1 },
        ]
    },
    {
        id: 'packetShift',
        title: 'Packet Shift',
        description: 'This is your evasion. It will evade an enemy attack by shifting your packet position.',
        type: UpgradeTypes.Defense,
        maxBaseLevel: 300,
        maxIncreaseLevel: 1000,
        baseCoinCost: 5000,
        baseUpgradeTime: 60,
        coinCostFormula: { ...defaultExpensiveCoinCostFormula, baseAmount: 5000 },
        baseValueFormula: { type: FormulaTypes.Increase, baseAmount: 0, increaseAmount: 0.1 },
        increaseValueFormula: { type: FormulaTypes.Increase, baseAmount: 0.001, increaseAmount: 0.001 },
        baseBoosts: [
            { name: 'Packet Shift Boost', type: 'additive', value: 0 },
        ]
    },
    {
        id: 'multiThreaded',
        title: 'Multi-Threaded',
        description: 'This is your multi-threaded processing. It will allow you to perform multiple attacks simultaneously.',
        type: UpgradeTypes.Attack,
        maxBaseLevel: 300,
        maxIncreaseLevel: 1000,
        baseCoinCost: 5000,
        baseUpgradeTime: 120,
        coinCostFormula: { ...defaultExpensiveCoinCostFormula, baseAmount: 5000 },
        baseValueFormula: { type: FormulaTypes.Increase, baseAmount: 5, increaseAmount: 0.1 },
        increaseValueFormula: { type: FormulaTypes.Increase, baseAmount: 0.001, increaseAmount: 0.001 }
    },
    {
        id: 'counterHack',
        title: 'Counter Hack',
        description: 'This is your counter hack. It will counter an enemy hack attempt and reflect damage.',
        type: UpgradeTypes.Defense,
        maxBaseLevel: 300,
        maxIncreaseLevel: 1000,
        baseCoinCost: 5000,
        baseUpgradeTime: 60,
        coinCostFormula: { ...defaultExpensiveCoinCostFormula, baseAmount: 5000 },
        baseValueFormula: { type: FormulaTypes.Increase, baseAmount: 0, increaseAmount: 0.1 },
        increaseValueFormula: { type: FormulaTypes.Increase, baseAmount: 0.001, increaseAmount: 0.001 },
        baseBoosts: [
            { name: 'Counter Hack Boost', type: 'additive', value: 0 },
        ]
    },
    {
        id: 'virusScanner',
        title: 'Virus Scanner',
        description: 'This is your virus scanner. It will detect and slow down enemies within its range.',
        type: UpgradeTypes.Utility,
        maxBaseLevel: 300,
        maxIncreaseLevel: 1000,
        baseCoinCost: 5000,
        baseUpgradeTime: 60,
        coinCostFormula: { ...defaultExpensiveCoinCostFormula, baseAmount: 5000 },
        baseValueFormula: { type: FormulaTypes.Increase, baseAmount: 10, increaseAmount: 0.1 },
        increaseValueFormula: { type: FormulaTypes.Increase, baseAmount: 0.001, increaseAmount: 0.001 },
        baseBoosts: [
            { name: 'Virus Scanner Boost', type: 'additive', value: 0 },
        ],
    },
];
