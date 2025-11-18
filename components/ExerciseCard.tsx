import React, { useState } from 'react';
import { Exercise } from '../types';
import { GripVertical, Trash2, Edit2, Info, Save } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updated: Exercise) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  totalCount: number;
  viewMode: boolean; // If true, editing is disabled (readonly view)
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ 
  exercise, 
  index, 
  onRemove, 
  onUpdate,
  onMoveUp,
  onMoveDown,
  totalCount,
  viewMode
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedExercise, setEditedExercise] = useState(exercise);
  const [showTips, setShowTips] = useState(false);

  const handleSave = () => {
    onUpdate(exercise.id, editedExercise);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md border-2 border-primary-100 dark:border-primary-900 mb-3 transition-all">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Exercício</label>
            <input 
              className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
              value={editedExercise.nome}
              onChange={(e) => setEditedExercise({...editedExercise, nome: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Séries</label>
              <input 
                className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
                value={editedExercise.series}
                onChange={(e) => setEditedExercise({...editedExercise, series: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Reps</label>
              <input 
                className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
                value={editedExercise.reps}
                onChange={(e) => setEditedExercise({...editedExercise, reps: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Descanso</label>
              <input 
                className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
                value={editedExercise.descanso}
                onChange={(e) => setEditedExercise({...editedExercise, descanso: e.target.value})}
              />
            </div>
          </div>
          <div>
             <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Dicas</label>
             <textarea
               className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
               rows={2}
               value={editedExercise.dicas}
               onChange={(e) => setEditedExercise({...editedExercise, dicas: e.target.value})}
             />
          </div>
          <div className="flex justify-end space-x-2 mt-2">
             <button onClick={() => setIsEditing(false)} className="px-3 py-1 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">Cancelar</button>
             <button onClick={handleSave} className="flex items-center px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                <Save size={14} className="mr-1"/> Salvar
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 mb-3 hover:shadow-md transition-all flex items-start gap-3">
      {/* Drag Handle Visual / Move Controls */}
      {!viewMode && (
        <div className="flex flex-col items-center justify-center space-y-1 mt-1">
          <button 
            onClick={() => onMoveUp(index)} 
            disabled={index === 0}
            className="text-slate-300 dark:text-slate-600 hover:text-primary-500 dark:hover:text-primary-400 disabled:opacity-20"
          >
            ▲
          </button>
          <GripVertical size={18} className="text-slate-300 dark:text-slate-600 cursor-grab active:cursor-grabbing" />
          <button 
             onClick={() => onMoveDown(index)} 
             disabled={index === totalCount - 1}
             className="text-slate-300 dark:text-slate-600 hover:text-primary-500 dark:hover:text-primary-400 disabled:opacity-20"
          >
            ▼
          </button>
        </div>
      )}

      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-lg leading-tight">{exercise.nome}</h4>
          {!viewMode && (
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setIsEditing(true)} className="p-1.5 text-slate-400 hover:text-primary-500 rounded hover:bg-primary-50 dark:hover:bg-slate-700">
                <Edit2 size={16} />
              </button>
              <button onClick={() => onRemove(exercise.id)} className="p-1.5 text-slate-400 hover:text-red-500 rounded hover:bg-red-50 dark:hover:bg-red-900/30">
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2 text-sm text-slate-600 dark:text-slate-300">
           <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md font-medium text-xs uppercase tracking-wider flex items-center">
             Séries: <b className="ml-1 text-slate-800 dark:text-white">{exercise.series}</b>
           </span>
           <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md font-medium text-xs uppercase tracking-wider flex items-center">
             Reps: <b className="ml-1 text-slate-800 dark:text-white">{exercise.reps}</b>
           </span>
           <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md font-medium text-xs uppercase tracking-wider flex items-center">
             Descanso: <b className="ml-1 text-slate-800 dark:text-white">{exercise.descanso}</b>
           </span>
        </div>

        <div className="mt-3">
           <button 
             onClick={() => setShowTips(!showTips)} 
             className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center focus:outline-none"
           >
             <Info size={14} className="mr-1" />
             {showTips ? 'Ocultar dicas' : 'Ver dicas de execução'}
           </button>
           
           {showTips && (
             <div className="mt-2 p-2 bg-blue-50 dark:bg-slate-700/50 text-blue-900 dark:text-blue-100 text-sm rounded-lg border border-blue-100 dark:border-slate-600 leading-relaxed">
               {exercise.dicas}
               {exercise.alternativa && (
                 <div className="mt-1 pt-1 border-t border-blue-200 dark:border-slate-600 text-xs text-blue-800 dark:text-blue-200">
                   <strong>Alternativa:</strong> {exercise.alternativa}
                 </div>
               )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};