export enum Goal {
  HYPERTROPHY = "Hipertrofia",
  STRENGTH = "Força",
  ENDURANCE = "Resistência",
  DEFINITION = "Definição",
  WEIGHT_LOSS = "Emagrecimento"
}

export enum Level {
  BEGINNER = "Iniciante",
  INTERMEDIATE = "Intermediário",
  ADVANCED = "Avançado"
}

export enum Equipment {
  FULL_GYM = "Academia Completa",
  BASIC_GYM = "Academia Básica",
  HOME_GYM = "Home Gym (Halteres/Elásticos)",
  BODYWEIGHT = "Sem Equipamento (Calistenia)"
}

export enum Frequency {
  TWO = "2 dias",
  THREE = "3 dias",
  FOUR = "4 dias",
  FIVE = "5 dias",
  SIX = "6 dias"
}

export interface Exercise {
  id: string; // UUID generated locally
  nome: string;
  series: string;
  reps: string;
  descanso: string;
  dicas: string;
  alternativa?: string;
}

export interface WorkoutDay {
  id: string; // UUID generated locally
  nome: string; // e.g., "Treino A"
  musculos: string[];
  exercicios: Exercise[];
}

export interface WorkoutPlan {
  id: string;
  nomePersonalizado: string;
  modelo: string[]; // e.g., ["PPL", "Upper/Lower"]
  objetivo: Goal;
  nivel: Level;
  dias: WorkoutDay[];
  createdAt: number;
}

export interface UserPreferences {
  models: string[];
  goal: Goal;
  level: Level;
  equipment: Equipment;
  frequency: Frequency;
  restrictions: string[];
}
