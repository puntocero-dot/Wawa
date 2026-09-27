# Wawa

**Tu sabiduría, su futuro.** Una cápsula del tiempo digital para que los padres guarden recuerdos, consejos y secretos, y sus hijos los descubran en el momento justo del futuro.

Ver [`ARCHITECTURE.md`](./ARCHITECTURE.md) para el razonamiento detrás del stack, el modelo de datos y las decisiones de escalabilidad.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Supabase (Postgres + Auth + Storage) · Gemini (`@google/genai`)

Sin Firebase: Supabase es el único proveedor de backend (base de datos, autenticación y almacenamiento de fotos/audio en un mismo proyecto).

## Empezar en local

```bash
npm install
cp .env.example .env.local   # y completa las claves de Supabase / Gemini
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Sin un proyecto de Supabase conectado, la app carga con datos de ejemplo (`src/lib/data.ts`) pero el login y guardar cápsulas requieren credenciales reales.

### Conectar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Copia la URL y la anon key a `.env.local` (ver `.env.example`).
3. Corre las migraciones en orden: pega el contenido de `supabase/migrations/0001_init.sql` y luego `0002_storage.sql` en el SQL Editor del proyecto, o usa la CLI de Supabase (`supabase db push`). La segunda crea el bucket de Storage (`capsule-media`) que reemplaza a Firebase Storage para fotos y audios.

### Conectar Gemini (funciones de IA)

Añade `GOOGLE_GENERATIVE_AI_API_KEY` en `.env.local` (consíguela en [Google AI Studio](https://aistudio.google.com/apikey)). Sin esta variable, las funciones de IA (transcripción de audio, sugerencia de etiquetas, búsqueda semántica en Wisdom) responden con un mensaje de "no configurado" en vez de fallar.

## Estructura

Ver la sección "Estructura de carpetas" en [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Scripts

```bash
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run start    # servir el build de producción
npm run lint     # eslint
```
