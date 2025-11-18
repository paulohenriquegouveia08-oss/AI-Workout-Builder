import { GoogleGenAI, Type } from "@google/genai";
import { UserPreferences, WorkoutPlan, WorkoutDay, Exercise } from '../types';

const getClient = () => {
  // Assuming process.env.API_KEY is available in the environment
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateWorkoutPlan = async (prefs: UserPreferences): Promise<Omit<WorkoutPlan, 'id' | 'createdAt' | 'nomePersonalizado'>> => {
  const ai = getClient();
  
  const prompt = `
    Crie uma rotina de treino de musculação completa e detalhada.
    Contexto:
    - Modelos desejados: ${prefs.models.join(', ')}
    - Objetivo: ${prefs.goal}
    - Nível: ${prefs.level}
    - Equipamento disponível: ${prefs.equipment}
    - Frequência: ${prefs.frequency}
    - Restrições Físicas: ${prefs.restrictions.join(', ')}
    
    Regras de Ouro:
    1. Respeite estritamente os dias de frequência.
    2. Considere biomecânica e recuperação muscular.
    3. Inclua aquecimento específico se necessário nas dicas.
    4. Se houver restrições, evite exercícios perigosos para a articulação citada.
    
    Retorne APENAS o JSON estruturado conforme o schema.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          modelo: { type: Type.ARRAY, items: { type: Type.STRING } },
          objetivo: { type: Type.STRING },
          nivel: { type: Type.STRING },
          dias: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                nome: { type: Type.STRING },
                musculos: { type: Type.ARRAY, items: { type: Type.STRING } },
                exercicios: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      nome: { type: Type.STRING },
                      series: { type: Type.STRING },
                      reps: { type: Type.STRING },
                      descanso: { type: Type.STRING },
                      dicas: { type: Type.STRING },
                      alternativa: { type: Type.STRING, nullable: true }
                    },
                    required: ["nome", "series", "reps", "descanso", "dicas"]
                  }
                }
              },
              required: ["nome", "musculos", "exercicios"]
            }
          }
        },
        required: ["modelo", "objetivo", "nivel", "dias"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Falha ao gerar treino: Resposta vazia.");
  }

  const data = JSON.parse(response.text);

  // Post-process to add local IDs
  const processedDays: WorkoutDay[] = data.dias.map((dia: any) => ({
    id: crypto.randomUUID(),
    nome: dia.nome,
    musculos: dia.musculos,
    exercicios: dia.exercicios.map((ex: any) => ({
      id: crypto.randomUUID(),
      ...ex
    }))
  }));

  return {
    modelo: data.modelo,
    objetivo: prefs.goal, // Enforce strict enum type from input
    nivel: prefs.level,     // Enforce strict enum type from input
    dias: processedDays
  };
};

export const regenerateDay = async (currentDay: WorkoutDay, prefs: UserPreferences): Promise<WorkoutDay> => {
  const ai = getClient();
  
  const prompt = `
    Regenerar um único dia de treino.
    Dia atual (para referência do que mudar): ${currentDay.nome} - Foco: ${currentDay.musculos.join(', ')}.
    Objetivo: ${prefs.goal}. Nível: ${prefs.level}. Restrições: ${prefs.restrictions.join(', ')}.
    Mantenha o foco muscular, mas mude os exercícios ou a estratégia.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          nome: { type: Type.STRING },
          musculos: { type: Type.ARRAY, items: { type: Type.STRING } },
          exercicios: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                nome: { type: Type.STRING },
                series: { type: Type.STRING },
                reps: { type: Type.STRING },
                descanso: { type: Type.STRING },
                dicas: { type: Type.STRING },
                alternativa: { type: Type.STRING }
              },
              required: ["nome", "series", "reps", "descanso", "dicas"]
            }
          }
        },
        required: ["nome", "musculos", "exercicios"]
      }
    }
  });

  if(!response.text) throw new Error("Falha ao regenerar dia");
  
  const data = JSON.parse(response.text);
  
  return {
    id: currentDay.id, // Keep same ID to replace in place
    nome: data.nome,
    musculos: data.musculos,
    exercicios: data.exercicios.map((ex: any) => ({
      id: crypto.randomUUID(),
      ...ex
    }))
  };
};
