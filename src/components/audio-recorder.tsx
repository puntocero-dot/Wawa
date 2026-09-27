"use client";

import { useRef, useState } from "react";
import { Mic, Square, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { transcribeAudioAction } from "@/app/(app)/new/ai-actions";

type AudioRecorderProps = {
  onTranscript: (text: string) => void;
};

export function AudioRecorder({ onTranscript }: AudioRecorderProps) {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcribing, setTranscribing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function startRecording() {
    setStatus(null);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];

    recorder.ondataavailable = (event) => chunksRef.current.push(event.data);
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      setAudioUrl(URL.createObjectURL(blob));
      stream.getTracks().forEach((track) => track.stop());
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    setRecording(true);
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  async function handleTranscribe() {
    if (!chunksRef.current.length) return;
    setTranscribing(true);
    setStatus(null);

    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    const arrayBuffer = await blob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const result = await transcribeAudioAction(base64);
    setTranscribing(false);

    if (result.text) {
      onTranscript(result.text);
    } else {
      setStatus(result.error ?? "No se pudo transcribir el audio.");
    }
  }

  return (
    <div className="glass-sm flex flex-col gap-3 rounded-2xl p-4">
      <div className="flex items-center gap-3">
        {!recording ? (
          <Button type="button" variant="outline" size="sm" onClick={startRecording}>
            <Mic className="h-4 w-4" /> Grabar consejo de voz
          </Button>
        ) : (
          <Button type="button" variant="primary" size="sm" onClick={stopRecording}>
            <Square className="h-4 w-4" /> Detener
          </Button>
        )}

        {audioUrl && !recording && (
          <Button type="button" variant="ghost" size="sm" onClick={handleTranscribe} disabled={transcribing}>
            <Wand2 className="h-4 w-4" /> {transcribing ? "Transcribiendo…" : "Transcribir con IA"}
          </Button>
        )}
      </div>

      {audioUrl && <audio controls src={audioUrl} className="w-full" />}
      {status && <p className="text-xs text-ink-700/70 dark:text-cream-200/60">{status}</p>}
    </div>
  );
}
