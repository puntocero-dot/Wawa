@AGENTS.md

# Wawa — guía para trabajar en este repo

Ver `ARCHITECTURE.md` antes de cambios estructurales: explica por qué Supabase es el único proveedor de backend (Postgres + Auth + Storage), el patrón de puertos/adaptadores en `src/lib/repositories/`, y las decisiones de escalabilidad.

Reglas del proyecto:

- **Sin Firebase.** Este proyecto no usa ningún producto de Firebase (Auth, Firestore, Storage, Hosting, Genkit). Todo el backend es Supabase; si algo parece necesitar Firebase, la respuesta es resolverlo con Supabase (Postgres/Auth/Storage/Edge Functions) o preguntar antes de introducir un proveedor nuevo.
- **Nunca** llamar a `createClient()` de Supabase directamente desde un componente o página — pasar siempre por `src/lib/repositories/`. Esto es lo que permite cambiar de backend sin reescribir la UI.
- El sistema de diseño ("vidrio cálido") vive en `src/app/globals.css` (`.glass`, `.glass-sm`, tokens de color) y `src/components/ui/glass-panel.tsx`. No definir blur/transparencia sueltos en un componente — usar `<GlassPanel>`.
- No usar la paleta morado/azul por defecto ni tipografía Inter — este proyecto usa Fraunces (display) + Plus Jakarta Sans (texto) y una paleta cálida terracota/ámbar/crema a propósito, para no verse como una plantilla genérica de IA.
- Las funciones de IA (`src/ai/flows/`) deben fallar de forma silenciosa y clara cuando falta `GOOGLE_GENERATIVE_AI_API_KEY`, nunca lanzar una excepción no controlada hacia la UI.
