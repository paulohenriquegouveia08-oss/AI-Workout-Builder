import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Plus, Zap } from 'lucide-react';
import { InstallPwa } from '../components/InstallPwa';

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-lg mb-6 ring-4 ring-primary-50 dark:ring-slate-700 transition-all">
        <Zap size={48} className="text-primary-500 fill-current" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white mb-4 tracking-tight">
        AI Workout <span className="text-primary-600 dark:text-primary-400">Builder</span>
      </h1>
      
      <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-md leading-relaxed">
        Crie treinos profissionais em segundos usando Inteligência Artificial. 
        Personalizado para seu objetivo, nível e equipamento.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
        <button 
          onClick={() => navigate('/create')}
          className="group relative flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border-2 border-transparent hover:border-primary-500 hover:shadow-xl transition-all duration-300"
        >
          <div className="bg-primary-50 dark:bg-slate-700 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
            <Plus size={24} className="text-primary-600 dark:text-primary-400" />
          </div>
          <span className="font-bold text-slate-800 dark:text-white text-lg">Criar Novo Treino</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">Setup rápido com IA</span>
        </button>

        <button 
          onClick={() => navigate('/saved')}
          className="group relative flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border-2 border-transparent hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-xl transition-all duration-300"
        >
          <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
            <Book size={24} className="text-slate-600 dark:text-slate-300" />
          </div>
          <span className="font-bold text-slate-800 dark:text-white text-lg">Treinos Salvos</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">Acesse sua biblioteca</span>
        </button>

        {/* PWA Install Button */}
        <InstallPwa />
      </div>

      <footer className="mt-16 text-slate-400 dark:text-slate-600 text-sm font-medium">
        Sem login • Salvo localmente • Gratuito
      </footer>
    </div>
  );
};