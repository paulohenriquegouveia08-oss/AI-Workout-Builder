import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wand2, Check } from 'lucide-react';
import { UserPreferences, Goal, Level, Equipment, Frequency } from '../types';
import { WORKOUT_MODELS, GOAL_OPTIONS, LEVEL_OPTIONS, EQUIPMENT_OPTIONS, FREQUENCY_OPTIONS, RESTRICTION_OPTIONS } from '../constants';
import { generateWorkoutPlan } from '../services/geminiService';
import { Button } from '../components/Button';

interface CreateWorkoutProps {
  onWorkoutGenerated: (plan: any) => void;
}

export const CreateWorkout: React.FC<CreateWorkoutProps> = ({ onWorkoutGenerated }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [prefs, setPrefs] = useState<UserPreferences>({
    models: [],
    goal: Goal.HYPERTROPHY,
    level: Level.INTERMEDIATE,
    equipment: Equipment.FULL_GYM,
    frequency: Frequency.FOUR,
    restrictions: ['Nenhuma']
  });

  const toggleModel = (model: string) => {
    setPrefs(prev => {
      const exists = prev.models.includes(model);
      if (exists) return { ...prev, models: prev.models.filter(m => m !== model) };
      return { ...prev, models: [...prev.models, model] };
    });
  };

  const toggleRestriction = (res: string) => {
    setPrefs(prev => {
      if (res === 'Nenhuma') return { ...prev, restrictions: ['Nenhuma'] };
      
      const withoutNone = prev.restrictions.filter(r => r !== 'Nenhuma');
      const exists = withoutNone.includes(res);
      
      let newRestrictions;
      if (exists) {
        newRestrictions = withoutNone.filter(r => r !== res);
      } else {
        newRestrictions = [...withoutNone, res];
      }

      if (newRestrictions.length === 0) newRestrictions = ['Nenhuma'];
      return { ...prev, restrictions: newRestrictions };
    });
  };

  const handleSubmit = async () => {
    if (prefs.models.length === 0) {
      setError("Selecione pelo menos um modelo de treino.");
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const generatedPlan = await generateWorkoutPlan(prefs);
      // Add temporary ID and name
      const fullPlan = {
        ...generatedPlan,
        id: crypto.randomUUID(),
        nomePersonalizado: `${generatedPlan.objetivo} - ${generatedPlan.modelo.join(' + ')}`,
        createdAt: Date.now()
      };
      
      onWorkoutGenerated(fullPlan);
      navigate('/result');
    } catch (err) {
      console.error(err);
      setError("Erro ao gerar treino. Tente novamente. Verifique sua chave API.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24">
      <button onClick={() => navigate('/')} className="flex items-center text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
        <ArrowLeft size={20} className="mr-2" /> Voltar para Home
      </button>

      <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Configurar Novo Treino</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">Defina suas preferências e deixe a IA criar a periodização perfeita.</p>

      <div className="space-y-8 bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
        
        {/* Models */}
        <section>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
            <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-slate-700 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs mr-2">1</span>
            Modelo de Divisão (Selecione 1 ou mais)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {WORKOUT_MODELS.map(m => (
              <div 
                key={m}
                onClick={() => toggleModel(m)}
                className={`cursor-pointer p-3 rounded-xl border-2 transition-all flex items-center justify-between ${
                  prefs.models.includes(m) 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                    : 'border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 text-slate-600 dark:text-slate-300'
                }`}
              >
                <span className="text-sm font-medium">{m}</span>
                {prefs.models.includes(m) && <Check size={16} className="text-primary-600 dark:text-primary-400" />}
              </div>
            ))}
          </div>
        </section>

        {/* Basic Params */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center">
              <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-slate-700 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs mr-2">2</span>
              Objetivo
            </h2>
            <select 
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
              value={prefs.goal}
              onChange={(e) => setPrefs({...prefs, goal: e.target.value as Goal})}
            >
              {GOAL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center">
              <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-slate-700 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs mr-2">3</span>
              Nível de Experiência
            </h2>
            <select 
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
              value={prefs.level}
              onChange={(e) => setPrefs({...prefs, level: e.target.value as Level})}
            >
              {LEVEL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center">
              <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-slate-700 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs mr-2">4</span>
              Equipamento Disponível
            </h2>
            <select 
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
              value={prefs.equipment}
              onChange={(e) => setPrefs({...prefs, equipment: e.target.value as Equipment})}
            >
              {EQUIPMENT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
           <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center">
              <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-slate-700 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs mr-2">5</span>
              Frequência Semanal
            </h2>
            <select 
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
              value={prefs.frequency}
              onChange={(e) => setPrefs({...prefs, frequency: e.target.value as Frequency})}
            >
              {FREQUENCY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </section>

        {/* Restrictions */}
        <section>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
            <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-slate-700 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs mr-2">6</span>
            Restrições Físicas
          </h2>
          <div className="flex flex-wrap gap-3">
            {RESTRICTION_OPTIONS.map(res => (
              <button
                key={res}
                onClick={() => toggleRestriction(res)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  prefs.restrictions.includes(res)
                   ? 'bg-accent-500 text-white shadow-md'
                   : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {res}
              </button>
            ))}
          </div>
        </section>

      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center border border-red-100 dark:border-red-800">
          {error}
        </div>
      )}

      <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4 md:p-6 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] transition-colors">
        <div className="max-w-3xl mx-auto">
          <Button 
            onClick={handleSubmit} 
            isLoading={isLoading} 
            size="lg" 
            className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 shadow-lg transform active:scale-[0.99] transition-all"
            icon={<Wand2 size={20} />}
          >
            {isLoading ? 'A IA está criando seu treino...' : 'Gerar Treino com IA'}
          </Button>
        </div>
      </div>
    </div>
  );
};