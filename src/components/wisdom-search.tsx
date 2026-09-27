"use client";

import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SnapshotCard } from "@/components/snapshot-card";
import { searchWisdomAction } from "@/app/(app)/wisdom/actions";
import type { WisdomMatch } from "@/ai/flows/find-relevant-wisdom";

export function WisdomSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WisdomMatch[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    const matches = await searchWisdomAction(query);
    setResults(matches);
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ej. Voy a rendir un examen y tengo miedo"
        />
        <Button type="submit" size="icon" variant="glass" disabled={loading} aria-label="Buscar">
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {loading && <p className="px-1 text-sm text-ink-700/60 dark:text-cream-200/50">Buscando el consejo más relevante…</p>}

      {results && results.length === 0 && !loading && (
        <p className="glass-sm rounded-glass px-5 py-6 text-center text-sm text-ink-700/70 dark:text-cream-200/60">
          No encontré un consejo para eso todavía. Prueba con otras palabras.
        </p>
      )}

      {results && results.length > 0 && (
        <div className="flex flex-col gap-3">
          {results.map(({ capsule, reason }) => (
            <div key={capsule.id} className="flex flex-col gap-1.5">
              <p className="px-1 text-xs font-medium text-amber-500 dark:text-amber-400">{reason}</p>
              <SnapshotCard capsule={capsule} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
