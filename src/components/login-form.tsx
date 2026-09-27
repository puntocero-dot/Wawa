"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const supabase = createClient();

    const { error: authError } =
      mode === "sign-in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="px-1 text-sm font-medium text-ink-700 dark:text-cream-200">
          Correo electrónico
        </label>
        <Input id="email" name="email" type="email" autoComplete="email" required placeholder="tu@correo.com" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="px-1 text-sm font-medium text-ink-700 dark:text-cream-200">
          Contraseña
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
          required
          minLength={6}
          placeholder="••••••••"
        />
      </div>

      {error && (
        <p role="alert" className="rounded-2xl bg-terracotta-500/10 px-4 py-2.5 text-sm text-terracotta-600 dark:text-terracotta-400">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={loading} className="mt-2">
        {loading ? "Un momento…" : mode === "sign-in" ? "Entrar" : "Crear cuenta"}
      </Button>

      <button
        type="button"
        onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
        className="mx-auto mt-1 text-sm text-ink-700/70 underline-offset-4 hover:underline dark:text-cream-200/70"
      >
        {mode === "sign-in" ? "¿Primera vez aquí? Crea tu cuenta" : "¿Ya tienes cuenta? Inicia sesión"}
      </button>
    </form>
  );
}
