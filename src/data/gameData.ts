// src/data/gameData.ts
import type { Cup } from '../types';

/**
 * Static data for all the cups in the game.
 */
export const cups: Cup[] = [
    {
        id: "malware_maze",
        name: "Malware Maze",
        abbreviation: "MM",
        difficultyMultiplier: 1,
        coinMultiplier: 1,
        experienceMultiplier: 1,
    },
    {
        id: "novice_nexus",
        name: "Novice Nexus",
        abbreviation: "NN",
        difficultyMultiplier: 2,
        coinMultiplier: 2.5,
        experienceMultiplier: 1.5
    },
    {
        id: "evolving_epoch",
        name: "Evolving Epoch",
        abbreviation: "EE",
        difficultyMultiplier: 4,
        coinMultiplier: 4,
        experienceMultiplier: 2
    },
    {
        id: "virus_vanguard",
        name: "Virus Vanguard",
        abbreviation: "VV",
        difficultyMultiplier: 8,
        coinMultiplier: 6,
        experienceMultiplier: 3
    },
    {
        id: "pinnacle_paragon",
        name: "Pinnacle Paragon",
        abbreviation: "PP",
        difficultyMultiplier: 16,
        coinMultiplier: 8,
        experienceMultiplier: 4.5
    },
    {
        id: "zenith_zone",
        name: "Zenith Zone",
        abbreviation: "ZZ",
        difficultyMultiplier: 32,
        coinMultiplier: 12,
        experienceMultiplier: 6
    },
    { 
        id: "celestial_circuit",
        name: "Celestial Circuit",
        abbreviation: "CC",
        difficultyMultiplier: 64,
        coinMultiplier: 16,
        experienceMultiplier: 9
    },
    {
        id: "infinite_interface",
        name: "Infinite Interface",
        abbreviation: "II",
        difficultyMultiplier: 128,
        coinMultiplier: 24,
        experienceMultiplier: 12
    },
    {
        id: "omnipotent_orbit",
        name: "Omnipotent Orbit",
        abbreviation: "OO",
        difficultyMultiplier: 256,
        coinMultiplier: 30,
        experienceMultiplier: 18
    },
    {
        id: "transcendent_tier",
        name: "Transcendent Tier",
        abbreviation: "TT",
        difficultyMultiplier: 512,
        coinMultiplier: 40,
        experienceMultiplier: 24
    },
];

/**
 * Difficulty multipliers for each tier.
 */
export const tierDifficultyMultipliers: number[] = [1, 1.1, 1.25, 1.45, 1.7];
export const tierCoinMultipliers: number[] = [1, 1.1, 1.2, 1.3, 1.4];

/**
 * Specific wave numbers to show in the snapshot view.
 */
export const snapshotWaves: number[] = [1, 10, 25, 50, 100, 200, 500, 1000];
