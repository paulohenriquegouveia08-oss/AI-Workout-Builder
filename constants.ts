import { Goal, Level, Equipment, Frequency } from './types';

export const WORKOUT_MODELS = [
  "PPL (Push/Pull/Legs)",
  "Upper / Lower",
  "ABC",
  "ABCD",
  "ABCDE",
  "Full Body",
  "Tradicional (Seg-Sex)",
  "Personalizado",
];

export const GOAL_OPTIONS = Object.values(Goal);
export const LEVEL_OPTIONS = Object.values(Level);
export const EQUIPMENT_OPTIONS = Object.values(Equipment);
export const FREQUENCY_OPTIONS = Object.values(Frequency);

export const RESTRICTION_OPTIONS = [
  "Joelho",
  "Ombro",
  "Coluna",
  "Cotovelo",
  "Nenhuma"
];
