# Arquitectura de Wawa

Este documento explica las decisiones de stack y por qué están hechas así, no solo qué se usó. Está pensado para que cualquiera que se sume al proyecto entienda el razonamiento, no solo el resultado.

## Stack

- **Next.js 16 (App Router) + React 19 + TypeScript** — frontend y capa de API en un solo framework. Se eligió sobre alternativas porque es el mismo patrón que usan productos a la escala que se mencionó como referencia (feeds sociales con millones de usuarios): SSR/streaming para carga percibida rápida, Server Actions para mutaciones sin levantar un backend aparte, y despliegue flexible (Vercel o cualquier host Node).
- **Supabase (Postgres)** como base de datos y autenticación. Se prefirió sobre Firestore/Firebase por tres razones concretas para este dominio:
  1. El feed de Wawa necesita **queries relacionales reales** (cápsulas por familia + tipo + fecha, tags, condiciones de desbloqueo) — en Firestore esto se resuelve con desnormalización manual o Cloud Functions; en Postgres es un índice compuesto.
  2. **Row Level Security a nivel de fila** en el propio motor de base de datos, en vez de reglas de seguridad como un lenguaje aparte (Firestore Rules) que duplica la lógica de negocio.
  3. Migraciones versionadas en SQL (`supabase/migrations/`), auditable y reproducible, en vez de un esquema implícito.
- **Tailwind CSS v4** para estilos, con tokens de diseño propios (ver abajo) en vez de un theme por defecto.
- **@google/genai (Gemini)** para las funciones de IA (transcripción de audio, sugerencia de etiquetas, búsqueda semántica de sabiduría). Se optó por llamar al SDK directamente desde Server Actions en vez de introducir Genkit como capa extra: menos piezas que mantener mientras el volumen de flujos de IA es pequeño (3 flujos). Si el número de flujos crece y se necesita orquestación/tracing más sofisticado, migrar a Genkit es un cambio localizado a `src/ai/`.

## Por qué esto escala (y qué NO se sobre-construyó todavía)

El cuello de botella real en una app tipo red social nunca es el framework — son dos cosas:

1. **El feed (fan-out).** El esquema usa `family_id` como unidad de partición (índice `capsules(family_id, kind, created_at desc)`), así que leer el feed de una familia es una sola query indexada, sin importar cuántas familias use la plataforma en total. Esto es deliberadamente más simple que un fan-out-on-write estilo Instagram (que solo tiene sentido con grafos sociales grandes de "seguidores"); Wawa es privado por familia, no un grafo social público, así que ese problema no existe todavía.
2. **Entrega de medios.** El esquema ya separa `media_url`/`audio_url` como URLs, no como blobs — la intención es que estos apunten a un CDN de objetos (Cloudflare R2 + Cloudflare Images, o S3 + CloudFront) en cuanto haya carga real de fotos/audio. No se conectó todavía porque no hay credenciales de un bucket real; ver `.env.example`.

Lo que **no** se construyó de más: no hay cola de mensajes, no hay microservicios, no hay caché distribuida. Con Postgres + índices correctos + un CDN de medios, esta arquitectura sirve cómodamente cientos de miles de usuarios. Esas piezas se añaden cuando haya métricas reales que lo justifiquen, no antes — añadirlas ahora sería complejidad especulativa.

## Capa de datos: puertos y adaptadores

Ningún componente de UI llama a Supabase directamente. Todo pasa por `src/lib/repositories/` (ver `capsules.ts`), que es la única parte del código que sabe que los datos viven en Postgres/Supabase. Esto significa que:

- Cambiar de Supabase a otro proveedor (o a un backend propio) es un cambio contenido a esa carpeta.
- Los componentes de React y las páginas solo conocen el tipo `Capsule` de `src/lib/types.ts`, nunca las columnas de la tabla.

## Sistema de diseño: "vidrio cálido"

Se evitó deliberadamente la estética por defecto de una app "hecha con IA" (paleta morado/azul degradado, tipografía Inter sin personalidad, tarjetas `rounded-2xl` genéricas). En su lugar:

- **Tipografía**: Fraunces (serif con carácter, para títulos) + Plus Jakarta Sans (para cuerpo) — ver `src/app/layout.tsx`.
- **Paleta**: tonos cálidos de hora dorada (crema, terracota, ámbar, espresso) definidos como tokens CSS en `src/app/globals.css`, no colores sueltos en cada componente.
- **Glassmorphism**: una sola clase `.glass` / `.glass-sm` (blur + tinte + borde + sombra) reutilizada en toda la app vía el componente `<GlassPanel>` (`src/components/ui/glass-panel.tsx`) — el "look" vive en un solo lugar, no está repetido componente por componente.

## Estructura de carpetas

```
src/
├── app/
│   ├── login/                 Página pública de login (sin header/nav)
│   ├── (app)/                 Grupo de rutas autenticadas (header + bottom nav)
│   │   ├── page.tsx           Feed "Instant"
│   │   ├── new/                Crear cápsula (+ Server Actions)
│   │   ├── wisdom/             Búsqueda semántica de consejos
│   │   ├── moments/            Mensajes para hitos futuros
│   │   ├── secrets/            Placeholder premium
│   │   └── profile/
│   └── globals.css            Tokens de diseño
├── components/                Componentes de UI reutilizables
│   └── ui/                    Primitivas (button, input, glass-panel…)
├── lib/
│   ├── repositories/           Única capa que conoce Supabase
│   ├── supabase/                Clientes browser/server + tipos generados
│   └── types.ts                 Tipos de dominio (Capsule, Profile…)
└── ai/
    ├── client.ts                Cliente Gemini compartido
    └── flows/                   Un archivo por caso de uso de IA
```

## Próximos pasos razonables (no hechos todavía, a propósito)

- Conectar un proyecto real de Supabase y correr `supabase/migrations/0001_init.sql`.
- Conectar un bucket (R2/S3) para `media_url`/`audio_url` en vez de guardar solo texto.
- Cuando exista una app real con usuarios: evaluar Capacitor (reusa este mismo código web) antes que React Native — solo justifica una base de código nativa aparte si el rendimiento de cámara/notificaciones push lo exige.
- Tests: no se añadieron todavía porque no hay lógica de negocio compleja más allá de los repositorios — el primer test que vale la pena escribir es sobre `src/lib/repositories/capsules.ts` una vez haya un proyecto Supabase real para correrlo contra una base de datos de prueba.
