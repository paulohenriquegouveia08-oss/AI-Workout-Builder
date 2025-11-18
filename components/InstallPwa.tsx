import React, { useState, useEffect } from 'react';
import { Download, X, Share, Smartphone } from 'lucide-react';

export const InstallPwa: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showIosInstructions, setShowIosInstructions] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed/standalone
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsStandalone(isStandaloneMode);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    // If Android/Chrome specific prompt is available
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          setDeferredPrompt(null);
        }
      });
    } else {
      // If generic or iOS, show instructions
      setShowIosInstructions(true);
    }
  };

  // Don't show anything if already installed
  if (isStandalone) return null;

  return (
    <>
      <button 
        onClick={handleInstallClick}
        className="group relative flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border-2 border-transparent hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-xl transition-all duration-300"
      >
        <div className="bg-blue-50 dark:bg-slate-700 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
          <Download size={24} className="text-blue-600 dark:text-blue-400" />
        </div>
        <span className="font-bold text-slate-800 dark:text-white text-lg">Instalar App</span>
        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">Usar como aplicativo</span>
      </button>

      {/* Modal de Instruções (Principalmente iOS) */}
      {showIosInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 relative">
            <button 
              onClick={() => setShowIosInstructions(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-4">
                <Smartphone size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Instalar App</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Adicione à sua tela inicial para usar como um aplicativo nativo.
              </p>
            </div>

            <div className="space-y-4 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-slate-600 font-bold text-xs shadow-sm">1</span>
                <span>Toque no botão de <strong>Compartilhar</strong> <Share size={14} className="inline mx-1"/> do navegador.</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-slate-600 font-bold text-xs shadow-sm">2</span>
                <span>Role para baixo e selecione <strong>Adicionar à Tela de Início</strong>.</span>
              </div>
            </div>
            
            <button 
              onClick={() => setShowIosInstructions(false)}
              className="w-full mt-6 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-xl transition-colors"
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </>
  );
};