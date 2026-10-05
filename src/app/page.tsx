import Link from "next/link";
import type { Metadata } from "next";
import { Camera, Compass, Gift, Lock } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";
import { SeasonalAmbient } from "@/components/seasonal-ambient";

export const metadata: Metadata = { title: "Wawa — Tu sabiduría, su futuro" };

const features = [
  {
    icon: Camera,
    title: "Instant",
    description: "Momentos espontáneos del día a día, tal como pasaron, sin filtro.",
  },
  {
    icon: Gift,
    title: "Moments",
    description: "Mensajes que se guardan hasta un hito de vida: sus 15 años, su boda.",
  },
  {
    icon: Compass,
    title: "Wisdom",
    description: "Consejos de tu propia experiencia, listos para cuando los necesite.",
  },
  {
    icon: Lock,
    title: "Secrets",
    description: "Pistas y misterios que se van revelando con el tiempo.",
  },
];

export default function LandingPage() {
  return (
    <div className="ambient-glow relative flex min-h-dvh flex-col overflow-hidden px-5 py-12">
      <SeasonalAmbient />

      <div className="relative z-10 mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-10 py-8">
        <div className="text-center">
          <p className="font-display text-5xl italic text-terracotta-600 dark:text-terracotta-400">Wawa</p>
          <p className="mt-3 text-balance text-lg font-medium text-ink-800 dark:text-cream-100">
            Tu sabiduría, su futuro.
          </p>
          <p className="mt-2 text-balance text-sm leading-relaxed text-ink-700/75 dark:text-cream-200/65">
            Una cápsula del tiempo digital para guardar recuerdos, consejos y secretos — y que tus hijos los
            descubran en el momento justo del futuro.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {features.map(({ icon: Icon, title, description }) => (
            <GlassPanel key={title} tone="sm" className="flex flex-col gap-2 px-4 py-4">
              <Icon className="h-5 w-5 text-terracotta-600 dark:text-terracotta-400" strokeWidth={1.75} />
              <p className="font-display text-base text-ink-900 dark:text-cream-50">{title}</p>
              <p className="text-xs leading-snug text-ink-700/65 dark:text-cream-200/55">{description}</p>
            </GlassPanel>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3">
          <Button asChild size="lg" className="w-full">
            <Link href="/login">Empezar</Link>
          </Button>
          <p className="text-xs text-ink-700/60 dark:text-cream-200/50">
            Para padres que quieren dejar algo más que recuerdos.
          </p>
        </div>
      </div>
    </div>
  );
}
