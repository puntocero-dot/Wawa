"use client";

import { useActionState, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AudioRecorder } from "@/components/audio-recorder";
import { cn } from "@/lib/utils";
import { createCapsuleAction, type NewCapsuleFormState } from "@/app/(app)/new/actions";
import type { CapsuleKind } from "@/lib/types";

const kinds: { value: CapsuleKind; label: string; hint: string }[] = [
  { value: "instant", label: "Instant", hint: "Un momento de hoy, sin filtro" },
  { value: "moment", label: "Moment", hint: "Para un hito futuro" },
  { value: "wisdom", label: "Wisdom", hint: "Un consejo para un desafío" },
  { value: "secret", label: "Secret", hint: "Una pista que se revela con el tiempo" },
];

const initialState: NewCapsuleFormState = { error: null };

export function NewSnapshotForm() {
  const router = useRouter();
  const formId = useId();
  const [kind, setKind] = useState<CapsuleKind>("instant");
  const [unlockType, setUnlockType] = useState<"immediate" | "date" | "age" | "milestone">("immediate");
  const [body, setBody] = useState("");
  const [state, formAction, pending] = useActionState(async (prev: NewCapsuleFormState, formData: FormData) => {
    const result = await createCapsuleAction(prev, formData);
    if (!result.error) {
      router.push(kind === "instant" ? "/" : `/${kind === "wisdom" ? "wisdom" : "moments"}`);
    }
    return result;
  }, initialState);

  const needsUnlockDate = kind !== "instant" && unlockType !== "immediate";

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="kind" value={kind} />

      <div>
        <p className="mb-2 px-1 text-sm font-medium text-ink-700 dark:text-cream-200">¿Qué tipo de cápsula es?</p>
        <div className="grid grid-cols-2 gap-2">
          {kinds.map((option) => (
            <button
              type="button"
              key={option.value}
              onClick={() => {
                setKind(option.value);
                if (option.value === "instant") setUnlockType("immediate");
              }}
              className={cn(
                "rounded-2xl px-3.5 py-3 text-left transition-all",
                kind === option.value ? "glass ring-2 ring-amber-400/70" : "glass-sm opacity-70 hover:opacity-100",
              )}
            >
              <span className="block text-sm font-semibold text-ink-900 dark:text-cream-50">{option.label}</span>
              <span className="block text-[11px] text-ink-700/60 dark:text-cream-200/50">{option.hint}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-title`} className="px-1 text-sm font-medium text-ink-700 dark:text-cream-200">
          Título
        </label>
        <Input id={`${formId}-title`} name="title" required placeholder="Un título que lo resuma" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-body`} className="px-1 text-sm font-medium text-ink-700 dark:text-cream-200">
          Tu mensaje
        </label>
        <Textarea
          id={`${formId}-body`}
          name="body"
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Escribe con calma. Esto lo va a leer en el futuro."
        />
        <AudioRecorder onTranscript={(text) => setBody((prev) => (prev ? `${prev} ${text}` : text))} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-tags`} className="px-1 text-sm font-medium text-ink-700 dark:text-cream-200">
          Etiquetas <span className="font-normal text-ink-700/50">(separadas por coma)</span>
        </label>
        <Input id={`${formId}-tags`} name="tags" placeholder="resiliencia, primer día, risas" />
      </div>

      {kind !== "instant" && (
        <div>
          <p className="mb-2 px-1 text-sm font-medium text-ink-700 dark:text-cream-200">¿Cuándo se desbloquea?</p>
          <div className="grid grid-cols-3 gap-2">
            {(["date", "age", "milestone"] as const).map((option) => (
              <button
                type="button"
                key={option}
                onClick={() => setUnlockType(option)}
                className={cn(
                  "rounded-2xl px-3 py-2 text-xs font-medium capitalize transition-all",
                  unlockType === option ? "glass ring-2 ring-amber-400/70" : "glass-sm opacity-70 hover:opacity-100",
                )}
              >
                {option === "date" ? "Fecha" : option === "age" ? "Edad" : "Hito"}
              </button>
            ))}
          </div>

          <input type="hidden" name="unlockType" value={unlockType} />

          {needsUnlockDate && unlockType === "date" && (
            <Input type="date" name="unlockAt" required className="mt-3" />
          )}
          {needsUnlockDate && unlockType === "age" && (
            <Input type="number" name="unlockAge" min={1} max={99} required placeholder="Edad, ej. 15" className="mt-3" />
          )}
          {needsUnlockDate && unlockType === "milestone" && (
            <Input name="unlockMilestone" required placeholder="Ej. Su boda, primer trabajo…" className="mt-3" />
          )}
        </div>
      )}

      {state.error && (
        <GlassPanel tone="sm" className="px-4 py-2.5 text-sm text-terracotta-600 dark:text-terracotta-400">
          {state.error}
        </GlassPanel>
      )}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Guardando…" : "Guardar cápsula"}
      </Button>
    </form>
  );
}
