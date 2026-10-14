# Checklist técnica de lanzamiento — Wawa

Auditoría de los 20 puntos técnicos estándar de pre-lanzamiento, aplicados al proyecto real en este repo. Para cada uno: estado actual, cómo verificarlo, la herramienta/método para resolverlo, y prioridad.

**Nota de contexto importante antes de leer la lista:** Wawa no es un sitio de contenido/marketing tradicional. Tiene **una sola página pública** (`/`, la landing) y **una de autenticación** (`/login`); todo lo demás (`/home`, `/new`, `/wisdom`, `/moments`, `/secrets`, `/profile`) es el feed privado de una familia autenticada. Varios de los 20 puntos (intención de búsqueda por URL, indexación agresiva, redirecciones de contenido antiguo) aplican con fuerza a la landing y **no aplican, o aplican al revés, a las rutas privadas** — esas deben quedar fuera de los buscadores, no dentro. Lo señalo en cada punto donde corresponde.

---

## 1. Indexabilidad
**Estado:** ✅ Corregido a propósito, en ambas direcciones. La landing (`/`) y `/login` son indexables (sin restricciones). Las rutas privadas (`/home`, `/new`, `/wisdom`, `/moments`, `/secrets`, `/profile`) llevan `robots: { index: false, follow: false }` en `src/app/(app)/layout.tsx` — es información privada de cada familia, nunca debería aparecer en un buscador.
**Cómo verificar:** `curl -s https://tu-dominio/home | grep robots` debe mostrar `noindex`; lo mismo para `/` NO debe mostrarlo. También Search Console → Cobertura, una vez haya dominio real.
**Herramienta/método:** Ya implementado en código (metadata de Next.js). Nada que hacer salvo confirmar tras desplegar.
**Prioridad:** Alta.

## 2. Google Search Console
**Estado:** ⚠️ Pendiente — requiere un dominio real y una cuenta de Google, que no existen todavía en este entorno.
**Cómo verificar:** Entrar a search.google.com/search-console y revisar si la propiedad existe.
**Herramienta/método:** Una vez haya dominio: alta de propiedad (verificación por DNS TXT es la más robusta porque no depende del código del sitio), y enviar `https://tu-dominio/sitemap.xml` (ya generado dinámicamente por `src/app/sitemap.ts`, no hace falta crearlo a mano).
**Prioridad:** Alta (pero bloqueada hasta tener dominio).

## 3. Bing Webmaster Tools
**Estado:** ⚠️ Pendiente, misma razón que el punto 2.
**Cómo verificar:** bing.com/webmasters.
**Herramienta/método:** Bing permite importar la propiedad directamente desde Google Search Console una vez esa esté verificada — más rápido que configurar desde cero.
**Prioridad:** Media.

## 4. Contacto funcional (tel: / mailto:)
**Estado:** ⚠️ No implementado — la landing actual no tiene pie de página con datos de contacto porque no me diste un teléfono o correo de soporte real para poner. No quise inventar uno.
**Cómo verificar:** Inspeccionar la landing; cualquier número/correo visible debe tener `href="tel:+52..."` / `href="mailto:..."`.
**Herramienta/método:** Dime el correo/teléfono real de soporte y agrego un footer en `src/app/page.tsx` con esos enlaces.
**Prioridad:** Media (alta si el modelo de negocio depende de contacto directo; baja si todo el soporte es in-app).

## 5. Redes sociales
**Estado:** ⚠️ No implementado — mismo motivo que el punto 4, no tengo URLs reales de perfiles de Wawa.
**Cómo verificar:** Cada ícono social debe apuntar a un perfil que exista y tenga actividad, no a `#` o a la home del propio sitio.
**Herramienta/método:** Pásame las URLs reales (Instagram/TikTok/etc.) y las agrego al footer de la landing con `rel="noopener noreferrer"` y `target="_blank"`.
**Prioridad:** Baja para el lanzamiento técnico; media para marketing.

## 6. Redirecciones 301
**Estado:** N/A por ahora — es un sitio nuevo, no hay URLs antiguas que migrar. Si en el futuro cambia una ruta (por ejemplo si `/home` se renombra), hay que agregar la entrada correspondiente.
**Cómo verificar:** `curl -I` a cada URL vieja conocida; debe devolver `301` directo al destino final, nunca una cadena de 2+ saltos.
**Herramienta/método:** `redirects()` en `next.config.ts` (ya tiene la estructura lista para añadir reglas) o reglas a nivel de hosting (Vercel/Cloudflare).
**Prioridad:** Baja hoy; Alta el día que se renombre o retire una URL pública.

## 7. Dominio canónico único (HTTPS + con/sin www)
**Estado:** ⚠️ Parcialmente listo. El código está preparado (`metadataBase` y todos los canonical usan `NEXT_PUBLIC_SITE_URL`), pero **deliberadamente no agregué un redirect automático de host en `next.config.ts`**: hacerlo bien requiere el dominio final definido, y una regla mal escrita puede romper los despliegues de preview (`*.vercel.app`). Esto se resuelve mejor a nivel de hosting/DNS, no de código.
**Cómo verificar:** Probar las 4 variantes (`http://`, `https://`, `http://www.`, `https://www.`) y confirmar que las 3 incorrectas redirigen 301 a una sola.
**Herramienta/método:** En Vercel: Project Settings → Domains → marcar el dominio canónico, Vercel redirige las otras variantes automáticamente. En Cloudflare: regla de Page Rules/Redirect.
**Prioridad:** Alta (pero es una tarea de configuración de hosting, no de código).

## 8. URLs canónicas (`rel="canonical"`)
**Estado:** ✅ Implementado. `alternates.canonical` en `src/app/layout.tsx` (raíz, `/`) y en `src/app/login/page.tsx` (`/login`). Las páginas privadas no lo necesitan porque ya están en `noindex`.
**Cómo verificar:** `curl -s https://tu-dominio/ | grep canonical`.
**Herramienta/método:** Ya hecho.
**Prioridad:** Alta.

## 9. URLs amigables
**Estado:** ✅ Ya cumplía desde el diseño original: `/`, `/login`, `/home`, `/wisdom`, `/moments`, `/secrets`, `/new`, `/profile` — todas legibles, sin parámetros de query ni IDs expuestos.
**Cómo verificar:** Inspección visual de las rutas en `src/app/`.
**Herramienta/método:** N/A, ya correcto.
**Prioridad:** Alta (ya resuelto).

## 10. Enlazado interno
**Estado:** ✅ Razonable para el tamaño actual del sitio. La landing enlaza a `/login`; el bottom-nav enlaza las 4 secciones del feed + perfil; el header enlaza al feed. Son pocas páginas y todas están conectadas — no hay "páginas huérfanas". Anchor texts son descriptivos ("Empezar", nombres de sección), no genéricos tipo "click aquí".
**Cómo verificar:** Un crawler tipo Screaming Frog (modo gratuito hasta 500 URLs) sobre el dominio desplegado, revisando enlaces rotos (4xx) y profundidad de clics.
**Herramienta/método:** Screaming Frog SEO Spider, o `next build` ya falla si un `<Link href>` interno apunta a una ruta que no existe en rutas estáticas conocidas — primera línea de defensa gratis.
**Prioridad:** Media (poco riesgo con tan pocas páginas, pero revisar de nuevo cuando crezca el sitio).

## 11. Intención de búsqueda por URL
**Estado:** ✅ para la única página que compite por tráfico de búsqueda: la landing (`/`) está escrita para la intención "qué es Wawa / cápsula del tiempo digital para hijos", con un encabezado, propuesta de valor y las 4 funcionalidades como contenido único. Las rutas privadas no compiten por keywords — correctamente, porque no deben indexarse (punto 1).
**Cómo verificar:** Leer la copy de `src/app/page.tsx` contra las keywords objetivo reales (pídeme la lista si ya la tienes definida, por ejemplo "cápsula del tiempo para hijos", "cartas para el futuro de mis hijos", etc. — ahora mismo el copy es genérico sobre la propuesta de valor, no está optimizado para un keyword específico).
**Herramienta/método:** Google Keyword Planner / Ahrefs / Ubersuggest para validar volumen real antes de reescribir el copy a una keyword concreta.
**Prioridad:** Media — depende de si el lanzamiento busca tráfico orgánico desde el día uno o no.

## 12. Metadatos de previsualización (Open Graph / Twitter Cards)
**Estado:** ✅ Implementado completo. `openGraph` y `twitter` (tipo `summary_large_image`) en `src/app/layout.tsx`, con una imagen OG generada dinámicamente en `src/app/opengraph-image.tsx` (1200×630, con la identidad visual real de Wawa — tipografía y paleta cálida — no una plantilla genérica).
**Cómo verificar:** Pegar la URL del sitio ya desplegado en Facebook Sharing Debugger, Twitter Card Validator, o simplemente `curl -s https://tu-dominio/ | grep 'og:'`.
**Herramienta/método:** Ya hecho; solo falta ver la vista previa real una vez haya una URL pública (las herramientas de debug no funcionan contra `localhost`).
**Prioridad:** Alta.

## 13. Caché y rendimiento
**Estado:** ⚠️ Parcial. Lo que da Next.js por defecto ya está activo: las páginas públicas se generan estáticas en build (`○ Static` en la salida de `next build` para `/`, `/login`, `/robots.txt`, `/sitemap.xml`, `/opengraph-image`), y las mutaciones usan `revalidatePath` en vez de refrescos completos. Lo que falta: cabeceras de caché explícitas para `/videos/*` (el video del zorro, ~2–3 MB) y, sobre todo, correr Lighthouse contra un despliegue real — no tiene sentido medir rendimiento contra `localhost`.
**Cómo verificar:** Lighthouse (pestaña Performance de Chrome DevTools, o PageSpeed Insights) contra la URL de producción.
**Herramienta/método:** PageSpeed Insights / `next build && next start` + Lighthouse local como primer paso; luego CDN del hosting (Vercel ya cachea `/public` automáticamente).
**Prioridad:** Alta.

## 14. Seguridad SSL
**Estado:** N/A en este entorno (no hay dominio ni hosting conectado todavía) — es responsabilidad del proveedor de hosting, no del código.
**Cómo verificar:** `https://www.ssllabs.com/ssltest/` contra el dominio final.
**Herramienta/método:** Vercel/Netlify/Cloudflare emiten y renuevan el certificado automáticamente (Let's Encrypt) en cuanto el dominio apunta a ellos — no requiere configuración manual si se usa uno de esos.
**Prioridad:** Alta (bloqueante para lanzar, pero no es tarea de código).

## 15. Copias de seguridad
**Estado:** ⚠️ Pendiente — depende del plan de Supabase que se contrate, no existe un proyecto Supabase real conectado todavía (ver `ARCHITECTURE.md`).
**Cómo verificar:** Supabase Dashboard → Database → Backups.
**Herramienta/método:** Los backups diarios automáticos de Supabase requieren el plan Pro (el free tier no los incluye) — si el lanzamiento maneja datos reales de familias, vale la pena contratarlo antes del día uno, no después de perder algo.
**Prioridad:** Alta.

## 16. Monitoreo de actividad (uptime)
**Estado:** ❌ No configurado — requiere una URL en producción y una cuenta en un servicio externo.
**Cómo verificar:** Que exista una alerta (email/Slack/SMS) configurada y que dispare una prueba real apagando el servicio un momento.
**Herramienta/método:** UptimeRobot (plan gratuito alcanza perfectamente para esta escala) o Better Uptime — 5 minutos de configuración una vez haya dominio.
**Prioridad:** Media.

## 17. Limpieza de contenido de desarrollo
**Estado:** ✅ Revisado — no hay lorem ipsum ni páginas de prueba olvidadas en el repo. Lo único que parece "contenido de ejemplo" es `src/lib/data.ts`, pero es **intencional**: son datos placeholder documentados (`// Placeholder data so the UI is real to look at before Supabase is wired up`) que solo se usan mientras no hay un proyecto Supabase conectado — el día que se conecte, ese archivo deja de usarse automáticamente porque las páginas pasan a leer de `src/lib/repositories/capsules.ts`. No hace falta borrarlo ni recordar borrarlo antes de lanzar.
**Cómo verificar:** `grep -ri "lorem ipsum\|test post\|asdf" src/` — ya corrido, sin resultados.
**Herramienta/método:** N/A, ya limpio.
**Prioridad:** Baja (ya resuelto).

## 18. Compatibilidad multiplataforma
**Estado:** ⚠️ Parcial — todo el diseño y las capturas de verificación en este proyecto se hicieron en viewport móvil (390×844, que es el uso principal esperado de Wawa). **No se ha probado todavía en desktop/tablet ni en Safari/Firefox real** — el entorno de este sandbox solo tiene Chromium disponible.
**Cómo verificar:** BrowserStack o abrir manualmente en Chrome, Safari, Firefox, Edge, en al menos 3 anchos (móvil, tablet, desktop).
**Herramienta/método:** BrowserStack (de pago) o, más simple y gratis, pedirle a 2–3 personas con iPhone/Android reales que abran el link antes del lanzamiento — para una app mobile-first esto importa más que el desktop.
**Prioridad:** Alta.

## 19. Formularios y UX (Thank You Page)
**Estado:** ⚠️ Decisión de producto, no un olvido. El formulario de nueva cápsula (`src/components/new-snapshot-form.tsx`) no usa una página de agradecimiento interstitial — al guardar, redirige directo al feed donde la cápsula recién creada ya aparece como primer elemento. Para una app (no un formulario de marketing/leads), ver el resultado en el feed real es, en mi opinión, mejor confirmación que una pantalla de "¡Gracias!" de por medio. Si de todas formas quieres un toast de confirmación breve (sin interrumpir la navegación), lo agrego — pero no recomendaría una página completa de agradecimiento aquí.
**Cómo verificar:** Crear una cápsula de prueba y confirmar que el usuario entiende que se guardó (verla aparecer en el feed).
**Herramienta/método:** Prueba manual / grabación de sesión real (Hotjar) una vez haya usuarios.
**Prioridad:** Media.

## 20. Medición y analítica
**Estado:** ❌ No configurado — no hay ningún proveedor de analítica conectado todavía (sin Google Analytics, sin Meta Pixel, sin Vercel Analytics). Requiere que elijas un proveedor antes de que yo lo cablee, porque implica aceptar sus términos/política de privacidad.
**Cómo verificar:** DevTools → pestaña Network, filtrar por el dominio del proveedor (`google-analytics.com`, `connect.facebook.net`, etc.) y confirmar que dispara al cargar.
**Herramienta/método:** Mi recomendación para este stack: **Vercel Analytics** o **Plausible** (privacidad-first, sin banner de cookies obligatorio en la UE) para métricas de tráfico, más eventos custom server-side desde los Server Actions (`new/actions.ts`, `wisdom/actions.ts`) para medir conversiones reales (cápsulas creadas, búsquedas de Wisdom) — eso es más confiable que un pixel de cliente porque no depende de que el usuario no tenga un ad-blocker. Dime cuál prefieres y lo integro.
**Prioridad:** Alta.

---

## Resumen por prioridad

| Prioridad | Puntos |
|---|---|
| **Alta** | 1 ✅, 2 ⚠️(bloqueado), 7 ⚠️(hosting), 8 ✅, 12 ✅, 13 ⚠️, 14 N/A(hosting), 15 ⚠️, 18 ⚠️, 20 ❌ |
| **Media** | 3, 4, 10 ✅, 11, 16, 19 |
| **Baja** | 5, 6, 9 ✅, 17 ✅ |

## Lo que ya quedó resuelto en código (este commit)
- `src/app/robots.ts`, `src/app/sitemap.ts` — generados dinámicamente, no archivos estáticos que se desactualizan.
- `noindex` en todas las rutas privadas (`src/app/(app)/layout.tsx`).
- `metadataBase`, `canonical`, Open Graph y Twitter Cards completos (`src/app/layout.tsx`, `src/app/login/page.tsx`).
- Imagen OG de marca generada dinámicamente (`src/app/opengraph-image.tsx`).
- Cabeceras de seguridad básicas (`next.config.ts`).

## Lo que necesito de ti para seguir
1. Dominio final de producción → desbloquea los puntos 2, 3, 7, 14.
2. Correo/teléfono de soporte real → punto 4.
3. URLs de redes sociales reales (si existen) → punto 5.
4. Proveedor de analítica preferido (Vercel Analytics / Plausible / GA4 / otro) → punto 20.
5. Confirmar plan de Supabase (free vs Pro) → punto 15.
