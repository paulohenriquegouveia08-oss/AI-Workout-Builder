import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { CreateWorkout } from './pages/CreateWorkout';
import { WorkoutResult } from './pages/WorkoutResult';
import { SavedWorkouts } from './pages/SavedWorkouts';
import { WorkoutPlan } from './types';
import { ThemeToggle } from './components/ThemeToggle';

const App: React.FC = () => {
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutPlan | null>(null);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('ai_workout_theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('ai_workout_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('ai_workout_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <HashRouter>
      <div className="min-h-screen bg-[#F8F8F9] dark:bg-slate-900 text-[#2A2A2E] dark:text-slate-100 font-sans selection:bg-primary-100 dark:selection:bg-primary-900 selection:text-primary-900 dark:selection:text-primary-100 transition-colors duration-300">
        <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/create" 
            element={<CreateWorkout onWorkoutGenerated={setCurrentWorkout} />} 
          />
          <Route 
            path="/result" 
            element={
              <WorkoutResult 
                workout={currentWorkout} 
                setWorkout={setCurrentWorkout} 
              />
            } 
          />
          <Route 
            path="/saved" 
            element={<SavedWorkouts onLoadWorkout={setCurrentWorkout} />} 
          />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;