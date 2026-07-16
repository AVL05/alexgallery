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
| `app/[locale]/home-client.tsx` | Composición cliente y loader |
| `app/[locale]/photo/[id]/page.tsx` | Ficha SSG, metadata y navegación circular |
| `app/[locale]/politica-uso/` | Política bilingüe |
| `app/globals.css` | Tokens RAW.VIVES, tipos, layout, foco y reduced motion |
| `components/` | Secciones, navegación, footer y comportamientos reutilizables |
| `components/ui/` | Botones, layout y metadatos conectados a páginas |
| `PRODUCT.md` | Contexto estratégico y límites duraderos de producto |
| `DESIGN.md` | Tokens machine-readable y reglas visuales resumidas |
| `docs/RAW_VIVES_DESIGN_SYSTEM.md` | Contrato visual completo de Fase 1 |
| `dictionaries/` | Copia localizada de la interfaz |
| `hooks/use-image-preloader.ts` | Precarga imperativa de imágenes del intro |
| `lib/gallery-data.ts` | Fuente de verdad del catálogo y su orden |
| `lib/images-data.json` | Metadatos generados; no editar a mano |
| `lib/image-loader.ts` | Mapeo de anchos de Next a variantes locales |
| `lib/dictionary.ts` | Locales, validación y carga de diccionarios |
| `scripts/optimize-images.ts` | Generación de derivados y metadata |
| `public/photos/raw/` | Fuentes fotográficas versionadas |
| `public/photos/optimized/` | Derivados versionados y servidos |
| `public/_headers` | Caché, CSP y cabeceras de seguridad de Cloudflare |
| `out/` | Artefacto local de build; no versionar |

## Flujo de navegación

1. `/` ofrece enlaces a `/es` y `/en`.
2. La home localizada muestra el intro `System Initializing`.
3. La navegación usa anchors `#hero`, `#about`, `#gallery` y `#contact`.
4. Los filtros actualizan la colección local sin cambiar URL.
5. Un clic normal en una tarjeta abre el lightbox; la URL de la tarjeta sigue
   siendo la ficha individual para teclado, nueva pestaña y navegación directa.
6. La ficha individual ofrece anterior, siguiente y vuelta a `#gallery`.
7. Flechas izquierda/derecha y Escape replican esa navegación.
8. Política abre `/{locale}/politica-uso`.

El orden de `photos` determina tanto la galería como el ciclo anterior/siguiente.

## Flujo de datos de fotografías

`lib/gallery-data.ts` contiene los datos editoriales. El script de imágenes lee
cada archivo de `public/photos/raw/`, genera derivados y escribe
`lib/images-data.json`. Galería y ficha cruzan ambos conjuntos mediante el ID
numérico convertido a string.

La entrada 14 no está en `photos`: es una imagen editorial reservada para hero,
Open Graph estructurado y precarga. No es un huérfano accidental.

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

Actualmente no existe un modelo traducido para fotografías. No se debe duplicar
el array ni cambiar IDs. La evolución recomendada es separar campos estables
(`id`, `year`, `image`, flags) de `title` y `description` por locale.

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

`lint` es actualmente otro nombre para `typecheck`. No hay suite de tests ni
formatter configurado. `pnpm build` genera `out/` y valida TypeScript de nuevo.
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

- `app/template.tsx`: transición entre rutas.
- `home-client.tsx`: reveal de home y texto de fondo ligado a scroll.
- `hero.tsx`: reveal, parallax y CTA.
- `loading-screen.tsx`: entrada, progreso y salida.
- `about.tsx` y `gallery.tsx`: Framer Motion al entrar en viewport.
- `contact.tsx`: ScrollTrigger y estado de envío.
- `politica-client.tsx`: timeline de entrada.
- `smooth-scroll.tsx`: Lenis sincronizado con ticker/ScrollTrigger.

Antes de añadir efectos, seguir la propuesta de `RAW_VIVES_AUDIT.md`: registro
único, preferencias centralizadas, timelines por sección y cleanup verificable.

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
- Loader/home: actualmente controla cuándo existe el contenido en DOM.
- Lenis/GSAP ticker: configuración global compartida por secciones.
- Diccionario español: actúa como contrato TypeScript de todos los idiomas.

No eliminar archivos, derivados, dependencias o categorías por parecer sin uso
sin comprobar historial, build, sitemap y comportamiento publicado.
