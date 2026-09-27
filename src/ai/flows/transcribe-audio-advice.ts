import { getAiClient, AI_MODEL } from "@/ai/client";

export type TranscribeResult = { text: string | null; error?: string };

/**
 * Turns a short voice memo into text so a parent can record advice out loud
 * instead of typing it. `audioBase64` is a webm/opus clip from
 * `AudioRecorder` (browser `MediaRecorder` output).
 */
export async function transcribeAudioAdvice(audioBase64: string): Promise<TranscribeResult> {
  const ai = getAiClient();
  if (!ai) {
    return {
      text: null,
      error: "La transcripción por IA no está configurada todavía (falta GOOGLE_GENERATIVE_AI_API_KEY).",
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: AI_MODEL,
      contents: [
        {
          role: "user",
          parts: [
            { text: "Transcribe este audio al español, tal cual se dice, sin resumir." },
            { inlineData: { mimeType: "audio/webm", data: audioBase64 } },
          ],
        },
      ],
    });

    return { text: response.text?.trim() || null };
  } catch (error) {
    return { text: null, error: error instanceof Error ? error.message : "Error al transcribir." };
  }
}
