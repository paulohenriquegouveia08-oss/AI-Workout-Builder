import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, RotateCw } from 'lucide-react';
import { WorkoutPlan, Exercise } from '../types';
import { storageService } from '../services/storageService';
import { regenerateDay } from '../services/geminiService';
import { Button } from '../components/Button';
import { ExerciseCard } from '../components/ExerciseCard';

interface WorkoutResultProps {
  workout: WorkoutPlan | null;
  setWorkout: (w: WorkoutPlan) => void;
}

export const WorkoutResult: React.FC<WorkoutResultProps> = ({ workout, setWorkout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeDayId, setActiveDayId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  // Determine if we are viewing a saved workout or a newly created one
  const isSavedView = location.pathname.includes('saved');

  useEffect(() => {
    if (!workout) {
      navigate('/');
    } else if (workout.dias.length > 0 && !activeDayId) {
      setActiveDayId(workout.dias[0].id);
    }
  }, [workout, navigate]);

  if (!workout) return null;

  const activeDay = workout.dias.find(d => d.id === activeDayId);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate small delay for UX
    setTimeout(() => {
      storageService.saveWorkout(workout);
      setIsSaving(false);
      if (!isSavedView) navigate('/saved'); // Go to saved list after first save
    }, 600);
  };

  const handleRegenerateDay = async () => {
    if (!activeDay) return;
    if (!confirm("Tem certeza? Isso irá substituir todos os exercícios deste dia por uma nova sugestão da IA.")) return;

    setIsRegenerating(true);
    try {
        // Reconstruct basic preferences from the workout data for context
        const pseudoPrefs: any = {
            goal: workout.objetivo,
            level: workout.nivel,
            restrictions: ['Nenhuma'] // Restrictions aren't saved in plan structure, using default safe assumption or needs schema update
        };

        const newDay = await regenerateDay(activeDay, pseudoPrefs);
        
        const updatedDays = workout.dias.map(d => d.id === activeDay.id ? { ...newDay, id: activeDay.id } : d);
        setWorkout({ ...workout, dias: updatedDays });
        
    } catch (e) {
        alert("Erro ao regenerar dia. Tente novamente.");
    } finally {
        setIsRegenerating(false);
    }
  };

  const updateExercise = (dayId: string, exId: string, updatedEx: Exercise) => {
    const updatedDays = workout.dias.map(d => {
      if (d.id !== dayId) return d;
      return {
        ...d,
        exercicios: d.exercicios.map(e => e.id === exId ? updatedEx : e)
      };
    });
    setWorkout({ ...workout, dias: updatedDays });
    // If auto-save is desired for saved workouts:
    if (isSavedView) storageService.saveWorkout({ ...workout, dias: updatedDays });
  };

  const removeExercise = (dayId: string, exId: string) => {
    if (!confirm("Remover exercício?")) return;
    const updatedDays = workout.dias.map(d => {
      if (d.id !== dayId) return d;
      return {
        ...d,
        exercicios: d.exercicios.filter(e => e.id !== exId)
      };
    });
    setWorkout({ ...workout, dias: updatedDays });
    if (isSavedView) storageService.saveWorkout({ ...workout, dias: updatedDays });
  };

  const moveExercise = (dayId: string, index: number, direction: 'up' | 'down') => {
    const dayIndex = workout.dias.findIndex(d => d.id === dayId);
    if (dayIndex === -1) return;

    const day = workout.dias[dayIndex];
    const newExercises = [...day.exercicios];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newExercises.length) return;

    const [movedItem] = newExercises.splice(index, 1);
    newExercises.splice(targetIndex, 0, movedItem);

    const newDays = [...workout.dias];
    newDays[dayIndex] = { ...day, exercicios: newExercises };
    
    setWorkout({ ...workout, dias: newDays });
    if (isSavedView) storageService.saveWorkout({ ...workout, dias: newDays });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-32">
       <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(isSavedView ? '/saved' : '/')} className="flex items-center text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            <ArrowLeft size={20} className="mr-2" /> {isSavedView ? 'Meus Treinos' : 'Voltar'}
        </button>
        {!isSavedView && (
            <Button onClick={handleSave} isLoading={isSaving} icon={<Save size={18}/>} size="sm">
                Salvar Treino
            </Button>
        )}
       </div>

       <header className="mb-8">
         {isSavedView ? (
            <input 
                className="text-3xl font-bold text-slate-800 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-primary-500 focus:outline-none w-full transition-all"
                value={workout.nomePersonalizado}
                onChange={(e) => {
                    const updated = { ...workout, nomePersonalizado: e.target.value };
                    setWorkout(updated);
                    storageService.saveWorkout(updated);
                }}
            />
         ) : (
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">{workout.nomePersonalizado}</h1>
         )}
         
         <div className="flex flex-wrap gap-2 mt-3">
            <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                {workout.objetivo}
            </span>
            <span className="bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-200 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                {workout.nivel}
            </span>
            <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                {workout.dias.length} Dias
            </span>
         </div>
       </header>

       {/* Days Navigation */}
       <div className="flex space-x-3 overflow-x-auto pb-4 mb-4 no-scrollbar">
         {workout.dias.map((day) => (
            <button
                key={day.id}
                onClick={() => setActiveDayId(day.id)}
                className={`flex-shrink-0 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                    activeDayId === day.id
                    ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 shadow-lg transform scale-105'
                    : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-slate-600 hover:text-primary-600 dark:hover:text-slate-200'
                }`}
            >
                {day.nome}
            </button>
         ))}
       </div>

       {/* Active Day Content */}
       {activeDay && (
         <div className="animate-fade-in">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{activeDay.nome}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Foco: <span className="font-medium text-slate-700 dark:text-slate-300">{activeDay.musculos.join(', ')}</span></p>
                </div>
                <button 
                    onClick={handleRegenerateDay}
                    disabled={isRegenerating}
                    className="flex items-center text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-slate-800 hover:bg-primary-100 dark:hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                    <RotateCw size={14} className={`mr-1.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                    {isRegenerating ? 'Regenerando...' : 'Regenerar Dia'}
                </button>
            </div>

            <div className="space-y-2">
                {activeDay.exercicios.map((exercise, idx) => (
                    <ExerciseCard 
                        key={exercise.id} 
                        exercise={exercise} 
                        index={idx}
                        totalCount={activeDay.exercicios.length}
                        onRemove={(id) => removeExercise(activeDay.id, id)}
                        onUpdate={(id, ex) => updateExercise(activeDay.id, id, ex)}
                        onMoveUp={(i) => moveExercise(activeDay.id, i, 'up')}
                        onMoveDown={(i) => moveExercise(activeDay.id, i, 'down')}
                        viewMode={false}
                    />
                ))}
                {activeDay.exercicios.length === 0 && (
                   <div className="p-8 text-center text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                      Dia vazio. Regenere o dia para novos exercícios.
                   </div>
                )}
            </div>
         </div>
       )}
    </div>
  );
};