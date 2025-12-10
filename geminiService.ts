import { GoogleGenAI } from "@google/genai";
import { Message, AnalysisResult } from '../types';

const MODEL_NAME = 'gemini-2.5-flash';

// Helper to get client instance safely at runtime
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeLoop = async (
  currentHistory: Message[], 
  newInput: string | null, 
  audioBase64: string | null
): Promise<AnalysisResult> => {
  
  // Initialize here instead of top-level to prevent crash on load
  const ai = getAiClient();

  // Construct context from history
  const historyContext = currentHistory.map(m => `${m.role === 'user' ? 'User' : 'Loopd AI'}: ${m.content}`).join('\n');
  
  const prompt = `
    You are Loopd, an intelligent feedback loop assistant. 
    Your goal is to help the user refine their thoughts, build habits, or close mental loops.
    Keep responses concise, insightful, and constructive.
    
    Current Conversation History:
    ${historyContext}
    
    ${newInput ? `User Input: ${newInput}` : ''}
    ${audioBase64 ? '[User provided Audio Input]' : ''}

    Respond directly to the user. If the user provided audio, assume the transcription will be handled elsewhere or just respond to the audio content if processed natively.
    If you detect a negative sentiment, offer a constructive reframe.
    If you detect a task, suggest a next step.
  `;

  const parts: any[] = [{ text: prompt }];

  if (audioBase64) {
    parts.push({
      inlineData: {
        mimeType: 'audio/wav', // Assuming WAV from MediaRecorder, adjust if needed
        data: audioBase64
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: { parts },
      config: {
        temperature: 0.7,
      }
    });

    return {
      text: response.text || "I couldn't process that loop. Try again.",
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      text: "Error processing the loop. Please check your connection.",
    };
  }
};

export const generateSessionName = async (firstMessage: string): Promise<string> => {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a very short (2-4 words) creative title for a session starting with: "${firstMessage}". Return ONLY the title.`,
        });
        return response.text?.trim() || "New Loop";
    } catch (e) {
        return "New Loop";
    }
}
