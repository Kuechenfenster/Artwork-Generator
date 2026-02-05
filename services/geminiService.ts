
import { GoogleGenAI } from "@google/genai";

/**
 * Service to handle Gemini API interactions for toy safety compliance.
 */

export async function suggestTranslation(text: string, targetLanguage: string): Promise<string> {
  // Always initialize GoogleGenAI with a named parameter using process.env.API_KEY directly.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Translate the following toy safety warning into ${targetLanguage}. Maintain a professional, compliant tone: "${text}"`,
  });
  // Use the .text property directly (do not call as a function).
  return response.text || "Translation failed";
}

export async function proofreadTranslation(text: string, context: string): Promise<string> {
  // Always initialize GoogleGenAI with a named parameter using process.env.API_KEY directly.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Proofread this translation in context of "${context}". Ensure terminology is accurate for global toy safety standards (EN 71). Text to check: "${text}"`,
  });
  // Use the .text property directly (do not call as a function).
  return response.text || "Proofreading failed";
}
