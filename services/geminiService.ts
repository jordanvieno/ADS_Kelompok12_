import { GoogleGenAI, Type } from "@google/genai";
import { FacilityService } from "./facilityService";
import { AISearchResult } from "../types";

// Note: In a real app, do not expose API keys on the client side.
// This is for demonstration purposes within a secure environment or using a proxy.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const getFacilityRecommendations = async (query: string): Promise<AISearchResult> => {
  if (!apiKey) {
    console.warn("No API Key provided for Gemini");
    return { recommendedFacilityIds: [], reasoning: "AI service unavailable." };
  }

  try {
    // Fetch latest data from service
    const res = await FacilityService.getAllFacilities();
    const facilities = res.data || [];

    const facilityContext = facilities.map(f => ({
      id: f.id,
      name: f.name,
      type: f.type,
      capacity: f.capacity,
      features: f.features,
      location: f.location
    }));

    const prompt = `
      User Query: "${query}"
      
      Available Facilities (JSON):
      ${JSON.stringify(facilityContext)}

      Task: Recommend the best facilities based on the user's query. Consider capacity, type, and features.
      
      Return a JSON object with:
      - recommendedFacilityIds: array of strings (ids)
      - reasoning: string (brief explanation in Indonesian language)
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedFacilityIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            reasoning: { type: Type.STRING }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as AISearchResult;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { recommendedFacilityIds: [], reasoning: "Maaf, terjadi kesalahan pada analisis AI." };
  }
};

export const chatWithAssistant = async (history: {role: 'user' | 'model', text: string}[], message: string): Promise<string> => {
    if (!apiKey) return "AI Service Unavailable";

    try {
        const chat = ai.chats.create({
            model: 'gemini-3-flash-preview',
            history: history.map(h => ({
                role: h.role,
                parts: [{ text: h.text }]
            })),
            config: {
                systemInstruction: `You are 'Botani', a helpful AI assistant for IPB University Facility Booking. 
                You help students and staff find rooms, explain booking rules (mock rules: booking min 3 days in advance, max 5 hours for students). 
                Always answer in polite Indonesian. Be concise.`
            }
        });

        const result = await chat.sendMessage({ message });
        return result.text || "Maaf, saya tidak mengerti.";
    } catch (error) {
        console.error("Chat Error", error);
        return "Sedang ada gangguan jaringan.";
    }
}