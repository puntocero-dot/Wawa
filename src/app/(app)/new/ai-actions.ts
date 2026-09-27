"use server";

import { transcribeAudioAdvice, type TranscribeResult } from "@/ai/flows/transcribe-audio-advice";
import { suggestWisdomTags } from "@/ai/flows/suggest-wisdom-tags";

export async function transcribeAudioAction(audioBase64: string): Promise<TranscribeResult> {
  return transcribeAudioAdvice(audioBase64);
}

export async function suggestTagsAction(body: string): Promise<string[]> {
  return suggestWisdomTags(body);
}
