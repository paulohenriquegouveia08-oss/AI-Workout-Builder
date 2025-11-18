import { WorkoutPlan } from '../types';

const STORAGE_KEY = 'ai_workout_builder_plans';

export const storageService = {
  saveWorkout: (workout: WorkoutPlan): void => {
    const existing = storageService.getWorkouts();
    const index = existing.findIndex(w => w.id === workout.id);
    
    let updated: WorkoutPlan[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = workout;
    } else {
      updated = [workout, ...existing];
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  getWorkouts: (): WorkoutPlan[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  getWorkoutById: (id: string): WorkoutPlan | undefined => {
    const workouts = storageService.getWorkouts();
    return workouts.find(w => w.id === id);
  },

  deleteWorkout: (id: string): void => {
    const existing = storageService.getWorkouts();
    const updated = existing.filter(w => w.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  duplicateWorkout: (id: string): WorkoutPlan | null => {
    const original = storageService.getWorkoutById(id);
    if (!original) return null;

    const newWorkout: WorkoutPlan = {
      ...original,
      id: crypto.randomUUID(),
      nomePersonalizado: `${original.nomePersonalizado} (Cópia)`,
      createdAt: Date.now(),
    };
    
    storageService.saveWorkout(newWorkout);
    return newWorkout;
  }
};
