/**
 * Hand-written placeholder until the real types are generated against a
 * live project:
 *
 *   npx supabase gen types typescript --project-id <id> > src/lib/supabase/database.types.ts
 *
 * Keeping a minimal shape here means the rest of the app can import
 * `Database` today instead of typing every Supabase call as `any`.
 */
export type Database = {
  public: {
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          avatar_url: string | null;
          child_name: string | null;
          child_birthday: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      capsules: {
        Row: {
          id: string;
          author_id: string;
          kind: "instant" | "moment" | "wisdom" | "secret";
          title: string;
          body: string;
          media_url: string | null;
          audio_url: string | null;
          tags: string[];
          unlock_type: "immediate" | "date" | "age" | "milestone";
          unlock_at: string | null;
          unlock_age: number | null;
          unlock_milestone: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["capsules"]["Row"]> & {
          author_id: string;
          kind: Database["public"]["Tables"]["capsules"]["Row"]["kind"];
          title: string;
          body: string;
        };
        Update: Partial<Database["public"]["Tables"]["capsules"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "capsules_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
  };
};
