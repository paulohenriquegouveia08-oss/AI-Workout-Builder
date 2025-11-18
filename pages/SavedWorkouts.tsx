import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Copy, ChevronRight } from 'lucide-react';
import { storageService } from '../services/storageService';
import { WorkoutPlan } from '../types';

interface SavedWorkoutsProps {
  onLoadWorkout: (w: WorkoutPlan) => void;
}

export const SavedWorkouts: React.FC<SavedWorkoutsProps> = ({ onLoadWorkout }) => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);

  useEffect(() => {
    setWorkouts(storageService.getWorkouts());
  }, []);

  const handleOpen = (w: WorkoutPlan) => {
    onLoadWorkout(w);
    navigate('/result?saved=true');
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Tem certeza que deseja excluir este treino?")) {
      storageService.deleteWorkout(id);
      setWorkouts(storageService.getWorkouts());
    }
  };

  const handleDuplicate = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const duplicated = storageService.duplicateWorkout(id);
    if (duplicated) {
      setWorkouts(storageService.getWorkouts());
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/')} className="flex items-center text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
        <ArrowLeft size={20} className="mr-2" /> Voltar
      </button>

      <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">Treinos Salvos</h1>

      {workouts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
           <div className="inline-block p-4 bg-slate-50 dark:bg-slate-700 rounded-full mb-4">
             <Copy size={32} className="text-slate-300 dark:text-slate-400" />
           </div>
           <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200 mb-2">Nenhum treino encontrado</h3>
           <p className="text-slate-500 dark:text-slate-400 mb-6">Você ainda não criou nenhum treino com nossa IA.</p>
           <button 
             onClick={() => navigate('/create')}
             className="bg-primary-600 text-white px-6 py-2 rounded-xl hover:bg-primary-700 transition-colors"
           >
             Criar meu primeiro treino
           </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {workouts.map((w) => (
            <div 
              key={w.id}
              onClick={() => handleOpen(w)}
              className="group bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md hover:border-primary-200 dark:hover:border-primary-900/50 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">{w.nomePersonalizado}</h3>
                <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                   <span className="bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-600">{w.modelo.join(' + ')}</span>
                   <span>•</span>
                   <span>{w.dias.length} dias/sem</span>
                   <span>•</span>
                   <span>{new Date(w.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                 <button 
                   onClick={(e) => handleDuplicate(e, w.id)}
                   className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                   title="Duplicar"
                 >
                   <Copy size={18} />
                 </button>
                 <button 
                   onClick={(e) => handleDelete(e, w.id)}
                   className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                   title="Excluir"
                 >
                   <Trash2 size={18} />
                 </button>
                 <div className="pl-2 text-slate-300 dark:text-slate-600">
                   <ChevronRight size={20} />
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};