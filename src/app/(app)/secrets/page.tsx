import type { Metadata } from "next";
import { Lock, Sparkle } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Secrets" };

export default function SecretsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="px-1">
        <h1 className="font-display text-2xl text-ink-900 dark:text-cream-50">Secrets</h1>
        <p className="text-sm text-ink-700/70 dark:text-cream-200/60">
          Pistas y misterios que se revelan con el tiempo.
        </p>
      </div>

      <GlassPanel className="flex flex-col items-center gap-3 px-6 py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-amber-400 to-terracotta-500 text-cream-50">
          <Lock className="h-6 w-6" />
        </div>
        <h2 className="font-display text-xl text-ink-900 dark:text-cream-50">Próximamente</h2>
        <p className="max-w-xs text-balance text-sm text-ink-700/70 dark:text-cream-200/60">
          Secrets es una función premium en construcción: pistas que tus hijos van descubriendo con el tiempo,
          hasta revelar algo que guardaste solo para ellos.
        </p>
        <Button variant="glass" size="sm" className="mt-2">
          <Sparkle className="h-3.5 w-3.5" /> Avísame cuando esté lista
        </Button>
      </GlassPanel>
    </div>
  );
}
