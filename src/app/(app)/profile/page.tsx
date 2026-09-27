import type { Metadata } from "next";
import { Avatar } from "@/components/ui/avatar";
import { GlassPanel } from "@/components/ui/glass-panel";
import { SignOutButton } from "@/components/sign-out-button";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

export const metadata: Metadata = { title: "Perfil" };

export default async function ProfilePage() {
  const configured = isSupabaseConfigured();
  const email = configured ? await getUserEmail() : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="px-1">
        <h1 className="font-display text-2xl text-ink-900 dark:text-cream-50">Perfil</h1>
      </div>

      <GlassPanel className="flex flex-col items-center gap-3 px-6 py-10 text-center">
        <Avatar name={email ?? "Familia"} size={64} />
        <p className="text-sm text-ink-700/70 dark:text-cream-200/60">
          {configured ? (email ?? "Sesión no iniciada") : "Supabase no está conectado todavía (ver .env.example)"}
        </p>
        {configured && <SignOutButton />}
      </GlassPanel>
    </div>
  );
}

async function getUserEmail() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.email ?? null;
}
