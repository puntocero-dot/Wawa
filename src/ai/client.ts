import { GoogleGenAI } from "@google/genai";

/**
 * Single place the app talks to Gemini. Returns `null` when no API key is
 * configured (local dev without `.env.local`) so every flow can fail soft
 * instead of crashing the request.
 */
export function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

export const AI_MODEL = "gemini-2.5-flash";
