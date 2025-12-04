import { GoogleGenAI, Type } from "@google/genai";
import { ChildActivity, DayOfWeek } from "../types";

// Safety check for API Key
const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const parseActivityFromText = async (text: string): Promise<ChildActivity | null> => {
  if (!ai) {
    console.warn("Gemini API Key missing");
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Extract a child activity schedule from this text: "${text}". Return JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            day: { type: Type.STRING, enum: Object.values(DayOfWeek) },
            startTime: { type: Type.STRING, description: "Format HH:mm in 24h" },
            endTime: { type: Type.STRING, description: "Format HH:mm in 24h" },
            location: { type: Type.STRING }
          },
          required: ["name", "day", "startTime", "endTime"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        id: crypto.randomUUID(),
        ...data
      };
    }
    return null;

  } catch (error) {
    console.error("Gemini parse error", error);
    return null;
  }
};

export const suggestHangoutMessage = async (organiserName: string, windowTitle: string, location: string): Promise<string> => {
  if (!ai) return `Hey! Do you want to join for ${windowTitle} at ${location}?`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Write a short, warm, casual text message invite from ${organiserName} for a playdate/hangout.
      Context: The availability window is called "${windowTitle}" and location is "${location}".
      Keep it under 20 words. Friendly mom-to-mom tone.`
    });
    return response.text || "";
  } catch (error) {
    return `Hey! Do you want to join for ${windowTitle} at ${location}?`;
  }
}
