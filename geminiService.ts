import { GoogleGenAI, Type } from "@google/genai";
import { Inspiration } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMusicalInspiration = async (): Promise<Inspiration | null> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const response = await ai.models.generateContent({
      model,
      contents: "Generate a creative musical loop idea with Genre, BPM, Key, Chord Progression, and a short vibe description.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            genre: { type: Type.STRING },
            bpm: { type: Type.INTEGER },
            key: { type: Type.STRING },
            progression: { type: Type.STRING },
            description: { type: Type.STRING },
            suggestedInstruments: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["genre", "bpm", "key", "progression", "description", "suggestedInstruments"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    
    // Sanitize the text to remove any markdown code block fencing that Gemini might add
    const jsonString = text.replace(/```json|```/g, '').trim();

    return JSON.parse(jsonString) as Inspiration;
  } catch (error) {
    console.error("Failed to generate inspiration:", error);
    return null;
  }
};
