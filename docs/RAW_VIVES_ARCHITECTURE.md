# Arquitectura de RAW.VIVES

Este documento describe la aplicación existente `alexgallery`, publicada en
`https://gallery.aleviclop.dev/`. La Fase 0 confirmó la base técnica y la Fase 1
añadió el sistema visual sin cambiar rutas, catálogo, idiomas ni despliegue.

## Arquitectura actual

La aplicación usa Next.js 16 App Router y se exporta completamente a archivos
estáticos. No existe servidor de aplicación en producción. Durante `pnpm build`,
Next genera la home raíz, dos homes localizadas, dos políticas, 60 fichas de
fotografía, metadata y archivos SEO. Wrangler publica `out/` como Cloudflare
Assets.

La frontera principal es:

```text
Catálogo TypeScript + diccionarios JSON + metadatos de imágenes
                            |
                     build de Next.js
                            |
          HTML/React estático + componentes cliente interactivos
                            |
                    Cloudflare Assets
```

Los Server Components cargan diccionarios y datos durante el build. La home pasa
el resultado a `home-client.tsx`, que coordina loader, scroll y secciones. Menú,
filtros, lightbox, motion y formularios funcionan en cliente.

## Responsabilidad de carpetas y archivos

| Ruta | Responsabilidad |
| --- | --- |
| `app/layout.tsx` | HTML raíz, fuentes, metadata global, JSON-LD y estilos |
| `app/page.tsx` | Landing raíz con elección de idioma |
| `app/[locale]/layout.tsx` | Validación de locales y sincronización de `lang` en cliente |
| `app/not-found.tsx` | Página 404 estática con recuperación bilingüe |
| `app/[locale]/page.tsx` | Carga del diccionario y datos de home |
| `app/[locale]/home-client.tsx` | Composición cliente e intro de sesión |
| `app/[locale]/photo/[id]/page.tsx` | Ficha SSG, metadata localizada y JSON-LD |
| `app/[locale]/politica-uso/` | Política bilingüe |
| `app/globals.css` | Tokens RAW.VIVES, tipos, layout, foco y reduced motion |
| `components/` | Secciones, navegación, footer y comportamientos reutilizables |
| `components/intro/` | Gate, piezas visuales y timeline de `RAW.VIVES SYSTEM` |
| `components/hero/` | Media LCP, contenido editorial y motion scoped del hero |
| `components/photo-detail/` | Ficha editorial, contexto, fullscreen y navegación |
| `components/photo-process/` | Comparador opcional, sección y harness solo de desarrollo |
| `components/ui/` | Botones, layout y metadatos conectados a páginas |
| `PRODUCT.md` | Contexto estratégico y límites duraderos de producto |
| `DESIGN.md` | Tokens machine-readable y reglas visuales resumidas |
| `docs/RAW_VIVES_DESIGN_SYSTEM.md` | Contrato visual completo de Fase 1 |
| `dictionaries/` | Copia localizada de la interfaz |
| `lib/intro/` | Persistencia, decisión, bootstrap, tiempos y desarrollo de la intro |
| `lib/hero/` | Selección de imagen, facts, perfiles motion y preview de desarrollo |
| `lib/photo-detail/` | Contenido localizado, selectores, interacción y SEO de ficha |
| `lib/photo-process/` | Curación, elegibilidad, interacción y validación de procesos |
| `lib/gallery-data.ts` | Fuente de verdad del catálogo y su orden |
| `lib/images-data.json` | Metadatos generados; no editar a mano |
| `lib/image-loader.ts` | Mapeo de anchos de Next a variantes locales |
| `lib/dictionary.ts` | Locales, validación y carga de diccionarios |
| `scripts/optimize-images.ts` | Generación de derivados y metadata |
| `scripts/prepare-photo-process.ts` | Derivados web autorizados de etapas auténticas |
| `scripts/validate-photo-process.ts` | Validación previa a cada build |
| `public/photos/raw/` | Fuentes fotográficas versionadas |
| `public/photos/optimized/` | Derivados versionados y servidos |
| `public/_headers` | Caché, CSP y cabeceras de seguridad de Cloudflare |
| `out/` | Artefacto local de build; no versionar |

## Flujo de navegación

1. `/` ofrece enlaces a `/es` y `/en`.
2. La primera home localizada de una sesión muestra `RAW.VIVES SYSTEM`; rutas
   internas, cambio de idioma y reduced motion la omiten.
3. La navegación usa anchors `#hero`, `#about`, `#gallery` y `#contact`.
4. Los filtros actualizan la colección local sin cambiar URL.
5. Un clic en una tarjeta abre la ficha y transporta el estado del archivo.
6. La ficha reconstruye anterior/siguiente contextual y vuelve al mismo `#gallery`.
7. Flechas navegan cuando el foco no ocupa un control; Escape cierra fullscreen.
8. Política abre `/{locale}/politica-uso`.

El orden de `photos` determina tanto la galería como el ciclo anterior/siguiente.

## Flujo de datos de fotografías

`lib/gallery-data.ts` contiene los datos editoriales. El script de imágenes lee
cada archivo de `public/photos/raw/`, genera derivados y escribe
`lib/images-data.json`. Galería y ficha cruzan ambos conjuntos mediante el ID
numérico convertido a string.

La entrada 14 no está en `photos`: es una imagen editorial reservada para hero,
Open Graph estructurado y precarga. No es un huérfano accidental.

El hero resuelve la entrada 14 y el fallback 46 desde `imagesData`; así reutiliza
las variantes, dimensiones y blur placeholder generados por el pipeline. Los
metadatos 30 y 2022–2025 se derivan de `photos` y no se duplican en JSX.

## Cómo añadir una fotografía

1. Elegir un ID numérico nuevo y estable. No reutilizar IDs retirados.
2. Añadir la fuente a `public/photos/raw/{id}.webp`.
3. Añadir una entrada a `photos` en `lib/gallery-data.ts` con `image: "/{id}.webp"`.
4. Usar una categoría incluida en `PhotoCategory` y `categories`.
5. Ejecutar `pnpm optimize-images`.
6. Confirmar ocho derivados: WebP y AVIF en 400, 800, 1200 y original.
7. Verificar que `lib/images-data.json` contiene dimensiones, blur y el mismo ID.
8. Ejecutar `pnpm typecheck`, `pnpm lint` y `pnpm build`.
9. Abrir la tarjeta, lightbox, ficha y navegación anterior/siguiente en ambos idiomas.

No editar `lib/images-data.json` manualmente ni apuntar una entrada a una imagen
externa sin una decisión arquitectónica explícita.

## Cómo añadir una categoría

1. Añadir el literal a `PhotoCategory` en `types/photo.ts`.
2. Añadirlo a `categories` en `lib/gallery-data.ts`.
3. Añadir la misma clave a `gallery.categories` en `dictionaries/es.json` y
   `dictionaries/en.json`.
4. Asignarlo al menos a una fotografía y validar filtro, contador y build.

`GalleryFilter` incluye `Todo`; no debe guardarse como categoría de fotografía.
`Virtual` existe en tipos/diccionarios, pero no está habilitada en el array de
filtros ni tiene entradas actuales.

## Cómo añadir una traducción

La forma de los diccionarios está tipada a partir de `dictionaries/es.json`.
Para modificar la interfaz:

1. Añadir la clave primero en español.
2. Añadir la misma estructura en inglés.
3. Actualizar el tipo especializado solo si hace falta en `types/dictionary.ts`.
4. Consumir la clave a través de props, no mediante texto condicional nuevo.
5. Ejecutar TypeScript y revisar `/es` y `/en`.

El contenido inglés de las 30 fotografías vive en `lib/photo-detail/content.ts`;
español usa el catálogo base. No se duplica el array estable ni se cambian IDs.

## Cómo ejecutar el proyecto

Requisitos validados: Node.js 22 y pnpm 10.

```powershell
pnpm install --frozen-lockfile
pnpm dev
```

Si pnpm se ejecuta sin TTY y necesita reconstruir `node_modules`:

```powershell
$env:CI = 'true'
pnpm install --frozen-lockfile
```

Abrir `http://localhost:3000/es`. Usar `localhost`, no `127.0.0.1`, para evitar
el bloqueo de origen de recursos HMR de Next durante desarrollo.

## Cómo validar y generar una build

```powershell
pnpm typecheck
pnpm lint
pnpm build
```

`lint` es actualmente otro nombre para `typecheck`. La suite usa Node Test Runner
mediante `pnpm test`; no hay formatter. `pnpm build` genera `out/` y valida tipos.
El script `pnpm export` es un alias redundante de build.

Tras cambiar fuentes fotográficas:

```powershell
pnpm optimize-images
pnpm build
```

## Variables de entorno

Solo se consume `NEXT_PUBLIC_BASE_URL`. Controla `metadataBase`, sitemap,
robots y datos estructurados. `.env.example` documenta el valor de producción.

```dotenv
NEXT_PUBLIC_BASE_URL=https://gallery.aleviclop.dev
```

Al ser `NEXT_PUBLIC_*`, no debe contener secretos. La clave de Web3Forms está
actualmente embebida en el bundle y debe tratarse como identificador público con
restricciones de dominio configuradas en el proveedor.

## Cómo desplegar

El despliegue deducido y documentado es Cloudflare mediante Wrangler:

```powershell
pnpm deploy:wrangler
```

Este comando construye y ejecuta `wrangler deploy --assets=./out`. `wrangler.json`
publica en el dominio `gallery.aleviclop.dev`. `public/_headers` se copia al
artefacto y define caché/CSP. No usar `next start` como simulación fiel de
producción: el destino real son archivos estáticos.

No hacer push o deploy sin autorización explícita. Verificar antes `/`, `/es`,
`/en`, varias fichas, política, sitemap, robots y una URL 404.

En `next dev`, una URL con un valor dinámico no incluido en
`generateStaticParams` puede devolver 500 debido a `output: "export"`. La 404 se
debe validar también sobre el artefacto estático o el hosting, no solo con dev.

## Motion actual

La Fase 2 centraliza GSAP, ScrollTrigger y Lenis. `app/layout.tsx` monta un único
`MotionProvider`; `lib/motion/gsap.ts` registra plugins una vez; hooks y primitivas
viven en `hooks/` y `components/motion/`. Lenis solo se habilita con puntero fino,
hover y movimiento permitido. Touch y reduced motion usan scroll nativo.

Menú, lightbox e intro comparten `ScrollLockManager`. Cada animación usa scope y
cleanup local; la galería agrupa reveals con `ScrollTrigger.batch`. La referencia
completa y los ejemplos están en `docs/RAW_VIVES_MOTION_SYSTEM.md`.

La intro se documenta en `docs/RAW_VIVES_INTRO_SYSTEM.md`. Su gate usa
`sessionStorage`, solo se monta en la home y no espera fotografías.

El hero se documenta en `docs/RAW_VIVES_HERO_SYSTEM.md`. `HomeClient` entrega un
handoff explícito cuando la intro termina, se salta o se omite. Su timeline y su
único ScrollTrigger permanecen dentro del scope de `components/hero/`.

## Integraciones externas

- Cloudflare Assets y dominio personalizado.
- Web3Forms para contacto/licencias.
- Instagram y correo mediante enlaces.
- Google Fonts a través de `next/font` durante el build.
- Archivo de verificación de Google en `public/`.
- Schema.org JSON-LD, Open Graph, robots y sitemap.

No hay analítica, CMS, almacenamiento, autenticación ni API propia confirmados.

## Partes que deben modificarse con cuidado

- `lib/gallery-data.ts`: cambia orden, filtros, URLs generadas y navegación.
- `public/photos/*` y `images-data.json`: deben mantenerse sincronizados.
- `lib/image-loader.ts`: cualquier cambio afecta todas las imágenes.
- `app/[locale]/photo/[id]/page.tsx`: genera 60 rutas y metadata.
- `app/layout.tsx`: metadata global, CSP indirecta, fuentes y `lang`.
- `public/_headers`: errores pueden bloquear scripts, imágenes o Web3Forms.
- `wrangler.json`: dominio y directorio de publicación.
- Intro/home: mantener la home en HTML, el criterio de sesión y el timeout seguro.
- Hero: conservar `primaryId`/`fallbackId`, prioridad LCP, un único `h1` y el
  contrato explícito de handoff con la intro.
- `MotionProvider`, Lenis y GSAP ticker: configuración global compartida; no crear
  instancias, registros o loops fuera de esta capa.
- Diccionario español: actúa como contrato TypeScript de todos los idiomas.

No eliminar archivos, derivados, dependencias o categorías por parecer sin uso
sin comprobar historial, build, sitemap y comportamiento publicado.

## Home narrativa de la Fase 5

La composición localizada continúa en `app/[locale]/home-client.tsx`. Entre el
hero y la galería se monta `components/home/home-narrative.tsx`, que compone
módulos pequeños sin cambiar las rutas ni el origen de datos.

`lib/home/curation.ts` contiene exclusivamente decisiones editoriales por ID.
`lib/home/selectors.ts` cruza esas decisiones con `gallery-data.ts` e
`images-data.json`, deriva recuentos y proporciona fallbacks. Los componentes no
buscan fotografías por su cuenta.

La navegación de capítulos al archivo conserva `#gallery` y utiliza
`lib/gallery-filter-events.ts` para solicitar el filtro al componente existente.
Este evento no sustituye el estado de la galería ni crea una segunda fuente de
verdad. La guía detallada vive en `RAW_VIVES_HOME_NARRATIVE.md`.

## Archivo editorial de la Fase 6

`components/gallery.tsx` es ahora un punto de compatibilidad que delega en
`components/archive/archive-page.tsx`. El archivo conserva `/{locale}#gallery`,
pero categoría, año, búsqueda, orden y bloque visible se serializan en query
params mediante `lib/archive/url.ts`. Los selectores puros cruzan el catálogo y
la metadata una vez; el grid, filtros, estados y panel móvil se separan en
componentes pequeños.

La ficha sigue en su ruta pública. `sessionStorage` guarda solo un contexto de
retorno temporal para recuperar URL, scroll y foco; una entrada directa no
depende de él. La referencia completa vive en `RAW_VIVES_ARCHIVE_SYSTEM.md`.

## Detalle fotográfico de la Fase 7

La ruta conserva 60 páginas SSG. `components/photo-detail/` separa media, cartela,
relato, acciones, navegación y relacionadas; `lib/photo-detail/` mantiene las 30
traducciones inglesas, reconstrucción contextual y SEO. Canonical, alternates,
Open Graph, Twitter e `ImageObject` usan datos reales. El fullscreen es progresivo
y carga el recurso ampliado al abrir. Véase `RAW_VIVES_PHOTO_DETAIL_SYSTEM.md`.

## Proceso creativo de la Fase 8

`types/photo-process.ts` modela original, corrección, final, notas y pasos sin
duplicar la fotografía. El final se resuelve desde el archivo por ID;
`lib/photo-process/config.ts` activa solo casos auténticos y la build valida rutas,
formatos, dimensiones, ratios y traducciones. El inventario actual tiene cero
elegibles, así que producción no monta comparador, preview de home ni marcas de
archivo. El harness `?process-debug=1` existe solo en desarrollo. Véase
`RAW_VIVES_CREATIVE_PROCESS_SYSTEM.md`.
