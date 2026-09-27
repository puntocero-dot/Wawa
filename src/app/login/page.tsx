import type { Metadata } from "next";
import { GlassPanel } from "@/components/ui/glass-panel";
import { SeasonalAmbient } from "@/components/seasonal-ambient";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <div className="ambient-glow relative flex min-h-dvh items-center justify-center overflow-hidden px-5 py-12">
      <SeasonalAmbient />

      <GlassPanel className="relative z-10 w-full max-w-sm px-7 py-10">
        <div className="mb-8 text-center">
          <p className="font-display text-4xl italic text-terracotta-600 dark:text-terracotta-400">Wawa</p>
          <p className="mt-2 text-balance text-sm text-ink-700/80 dark:text-cream-200/70">
            Tu sabiduría, su futuro. Una cápsula del tiempo para lo que quieres que tus hijos sepan algún día.
          </p>
        </div>

        <LoginForm />
      </GlassPanel>
    </div>
  );
}
