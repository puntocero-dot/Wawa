import type { Metadata } from "next";
import { GlassPanel } from "@/components/ui/glass-panel";
import { SeasonalAmbient } from "@/components/seasonal-ambient";
import { FoxIntroVideo } from "@/components/fox-intro-video";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <div className="ambient-glow relative flex min-h-dvh items-center justify-center overflow-hidden px-5 py-12">
      <SeasonalAmbient />

      <GlassPanel className="relative z-10 w-full max-w-sm overflow-hidden px-7 pb-10">
        <FoxIntroVideo className="-mx-7 -mt-[1px] h-44 w-[calc(100%+3.5rem)]" />

        <div className="mb-6 mt-3 text-center">
          <p className="font-display text-3xl italic text-terracotta-600 dark:text-terracotta-400">Wawa</p>
          <p className="mt-1 text-sm text-ink-700/70 dark:text-cream-200/60">Bienvenido de vuelta</p>
        </div>

        <LoginForm />
      </GlassPanel>
    </div>
  );
}
