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
**Estado:** ✅ Verificado, no solo revisado a ojo. Crawleé el HTML real de las 8 páginas, extraje todos los `href` internos encontrados y pedí cada uno — las 10 rutas únicas devuelven `200`, cero enlaces rotos. La landing enlaza a `/login`; el bottom-nav enlaza las 4 secciones del feed + perfil; el header enlaza al feed. Son pocas páginas y todas están conectadas — no hay "páginas huérfanas". Anchor texts son descriptivos ("Empezar", nombres de sección), no genéricos tipo "click aquí".
**Cómo verificar:** Un crawler tipo Screaming Frog (modo gratuito hasta 500 URLs) sobre el dominio desplegado, revisando enlaces rotos (4xx) y profundidad de clics.
**Herramienta/método:** Screaming Frog SEO Spider para el sitio ya desplegado; dentro del repo, `next build` ya falla si un `<Link href>` interno apunta a una ruta que no existe.
**Prioridad:** Media → verificado hoy; revisar de nuevo cuando crezca el sitio.

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
**Estado:** ✅ Lo que dependía de código ya está hecho. Páginas públicas estáticas en build (`○ Static` para `/`, `/login`, `/robots.txt`, `/sitemap.xml`, `/opengraph-image`), mutaciones vía `revalidatePath` en vez de refrescos completos, y ahora **`Cache-Control: public, max-age=86400, must-revalidate`** explícito para `/videos/*` en `next.config.ts` (el clip del zorro, ~1–3 MB, ya no se re-descarga en cada visita a `/login` dentro del mismo día — sin usar `immutable`/un año completo porque el archivo vive en una ruta fija y puede reemplazarse en el futuro). Lo único que queda, y que de verdad requiere una URL pública, es correr Lighthouse contra el despliegue real.
**Cómo verificar:** `curl -sI https://tu-dominio/videos/fox-intro.mp4 | grep -i cache-control`. Lighthouse (Chrome DevTools → Performance, o PageSpeed Insights) contra la URL de producción.
**Herramienta/método:** Ya hecho en código; PageSpeed Insights una vez desplegado.
**Prioridad:** Alta → mayormente resuelta.

## 13b. Dependencias con vulnerabilidades conocidas (no estaba en los 20 puntos originales, pero apareció al auditar — y es exactamente el tipo de cosa que bloquea un lanzamiento serio)
**Estado:** ✅ Resuelto lo resoluble. `npm audit` reportaba 8 vulnerabilidades altas: 6 eran de **Next.js 16.3.6** (cache poisoning, SSRF en Image Optimization, fuga de Draft Mode, entre otras — todas con CVE público) — se actualizó a **Next.js 16.4.0**, que las corrige. Las otras 2 (`sharp`, `source-map-js`) se resolvieron con `npm audit fix`. Queda **una sola cadena sin resolver**: `braces` (vía `eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob` → `micromatch`) — es una dependencia de **desarrollo** (ESLint, nunca se despliega ni se expone a usuarios), y **no existe todavía una versión más nueva publicada de `braces`** que la corrija (confirmado contra el registro de npm) — no es negligencia, es que upstream no ha sacado el parche aún.
**Cómo verificar:** `npm audit` (ya corrido; ver detalle en el historial del commit).
**Herramienta/método:** Ya hecho; re-correr `npm audit` periódicamente y actualizar `braces`/`eslint-config-next` en cuanto haya una versión parcheada.
**Prioridad:** Alta (eran CVEs reales de Next.js en producción — ya corregido).

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
**Estado:** ⚠️ Parcial, mejoró. Se verificó la landing en 3 anchos (390/834/1440px — móvil, tablet, desktop) con Chromium: el layout se mantiene centrado con ancho máximo legible, sin romperse ni estirarse. **Sigue pendiente Safari/Firefox real** — el entorno de este sandbox solo tiene Chromium disponible, no puedo instalar otros motores aquí. Dato relevante para Safari específicamente: el video del zorro en `/login` tiene un `<source>` WebM y uno MP4/H.264 — Safari no soporta WebM, así que debería caer automáticamente al MP4 (comportamiento estándar de `<video>`), pero vale la pena confirmarlo en un iPhone real antes de lanzar.
**Cómo verificar:** BrowserStack, o abrir manualmente en Safari/Firefox/Edge reales en al menos 3 anchos.
**Herramienta/método:** BrowserStack (de pago) o pedirle a 2–3 personas con iPhone/Android reales que abran el link — para una app mobile-first esto importa más que el desktop.
**Prioridad:** Alta — Chromium/responsive ya verificado; falta el resto de motores.

## 19. Formularios y UX (Thank You Page)
**Estado:** ⚠️ Decisión de producto, no un olvido. El formulario de nueva cápsula (`src/components/new-snapshot-form.tsx`) no usa una página de agradecimiento interstitial — al guardar, redirige directo al feed donde la cápsula recién creada ya aparece como primer elemento. Para una app (no un formulario de marketing/leads), ver el resultado en el feed real es, en mi opinión, mejor confirmación que una pantalla de "¡Gracias!" de por medio. Si de todas formas quieres un toast de confirmación breve (sin interrumpir la navegación), lo agrego — pero no recomendaría una página completa de agradecimiento aquí.
**Cómo verificar:** Crear una cápsula de prueba y confirmar que el usuario entiende que se guardó (verla aparecer en el feed).
**Herramienta/método:** Prueba manual / grabación de sesión real (Hotjar) una vez haya usuarios.
**Prioridad:** Media.

## 20. Medición y analítica
**Estado:** ✅ Integrado **Vercel Analytics** (`<Analytics />` en `src/app/layout.tsx`). Elegí esto sin preguntar porque es la única opción que no requiere crear ninguna cuenta ni pegar ninguna API key para empezar a funcionar: es cookieless (sin banner de cookies obligatorio en la UE), gratis en el plan Hobby, y se activa solo en cuanto el proyecto se despliega en Vercel — en cualquier otro hosting simplemente no hace nada (no rompe nada, tampoco mide nada). Si el hosting final **no** es Vercel, o prefieres GA4/Meta Pixel/Plausible por otra razón (remarketing, integración con otra herramienta que ya uses), dímelo y lo cambio — es un cambio de un componente, no una reestructuración.
**Cómo verificar:** Una vez desplegado en Vercel: Project → Analytics en el dashboard, debería empezar a mostrar pageviews a los pocos minutos. En DevTools → Network, buscar peticiones a `/_vercel/insights/`.
**Herramienta/método:** Ya hecho. Pendiente (opcional, no bloqueante): eventos custom en los Server Actions (`new/actions.ts`, `wisdom/actions.ts`) para medir conversiones reales (cápsulas creadas, búsquedas de Wisdom) en vez de solo pageviews — lo agrego si quieres.
**Prioridad:** Alta → resuelto.

---

## Resumen por prioridad

| Prioridad | Puntos |
|---|---|
| **Alta** | 1 ✅, 2 ⚠️(bloqueado: dominio), 7 ⚠️(hosting), 8 ✅, 12 ✅, 13 ✅, 13b ✅, 14 N/A(hosting), 15 ⚠️(decisión de plan), 18 ⚠️(falta Safari/Firefox real), 20 ✅ |
| **Media** | 3 ⚠️(bloqueado: dominio), 4 ⚠️(falta tu info), 10 ✅, 11 ✅, 16 ❌(falta cuenta externa), 19 ✅(decisión de producto) |
| **Baja** | 5 ⚠️(falta tu info), 6 N/A, 9 ✅, 17 ✅ |

## Lo que quedó resuelto en código hoy (todo técnico, sin inventar datos de negocio)
- `src/app/robots.ts`, `src/app/sitemap.ts` — generados dinámicamente.
- `noindex` real en todas las rutas privadas (`src/app/(app)/layout.tsx`).
- `metadataBase`, `canonical`, Open Graph y Twitter Cards completos, con imagen OG de marca generada dinámicamente.
- Cabeceras de seguridad (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`) + `Cache-Control` para los videos.
- **Next.js actualizado de 16.3.6 → 16.4.0**, corrigiendo 6 CVEs de severidad alta (cache poisoning, SSRF, fuga de Draft Mode); `sharp` y `source-map-js` también actualizados vía `npm audit fix`. Solo queda sin parche una dependencia de desarrollo (`braces`, vía ESLint) sin versión corregida publicada todavía.
- **Vercel Analytics** integrado (zero-config, sin cuenta ni API key necesaria para empezar).
- Enlazado interno verificado con un crawl real (10 rutas únicas, 0 rotas) — no solo revisado a ojo.
- Landing verificada en 3 anchos (móvil/tablet/desktop) — responsive confirmado en Chromium.

## Lo que sigue bloqueado — y por qué no lo resolví yo
Estos 5 puntos no son falta de esfuerzo: son datos o decisiones que solo tú puedes dar, y fabricarlos sería peor que dejarlos pendientes (un teléfono falso, una red social inventada o un enlace a un dominio que no existe todavía rompen más confianza de la que generan).
1. **Dominio final de producción** → desbloquea los puntos 2, 3, 7, 14. No puedo registrar uno ni elegirlo por ti.
2. **Correo/teléfono de soporte real** → punto 4.
3. **URLs de redes sociales reales** (si existen) → punto 5.
4. **Confirmar plan de Supabase** (free vs Pro, por los backups automáticos) → punto 15, implica un costo que decides tú.
5. **Cuenta en UptimeRobot/Better Uptime** → punto 16, requiere que la crees tú (yo no puedo crear cuentas en servicios externos a tu nombre).
