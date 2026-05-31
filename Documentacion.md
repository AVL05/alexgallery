# Documentacion Tecnica

## Proyecto

Alexgallery es un portfolio fotografico bilingue y archivo visual personal. Esta optimizado para exportacion estatica y despliegue en Cloudflare mediante Wrangler assets.

## Arquitectura

El proyecto usa Next.js App Router con una separacion ligera:

- `app/`: rutas, layouts, metadata, sitemap, robots y paginas localizadas.
- `components/`: componentes de seccion y UI reutilizable.
- `dictionaries/`: contenido traducido para `es` y `en`.
- `hooks/`: logica de cliente reutilizable.
- `lib/`: datos, helpers, diccionarios y loader de imagenes.
- `types/`: contratos TypeScript compartidos.
- `public/`: assets estaticos.
- `scripts/`: utilidades de mantenimiento, incluida la optimizacion de imagenes.

## Requisitos

- Node.js compatible con Next.js 16.
- pnpm.

## Instalacion

```bash
pnpm install
```

## Desarrollo

```bash
pnpm dev
```

## Validacion

```bash
pnpm typecheck
pnpm build
```

`pnpm lint` existe como alias de `pnpm typecheck`. No hay ESLint configurado en el proyecto.

## Build y despliegue

```bash
pnpm build
pnpm deploy:wrangler
```

`next.config.mjs` usa `output: "export"`, por lo que la salida estatica se genera en `out/`.

## Imagenes

El pipeline esta en `scripts/optimize-images.ts`.

Entrada:

```text
public/photos/raw
```

Salida:

```text
public/photos/optimized
lib/images-data.json
```

El script genera variantes WebP/AVIF, una version optimizada original, blur placeholders, EXIF basico e histogramas. No modifica los archivos originales.

## Internacionalizacion

Las rutas localizadas son:

- `/es`
- `/en`

Los textos se cargan desde `dictionaries/es.json` y `dictionaries/en.json` mediante `lib/dictionary.ts`.

## SEO

El layout global define metadata base, Open Graph, Twitter card, robots y JSON-LD. Tambien existen:

- `app/sitemap.ts`
- `app/robots.ts`
- `app/opengraph-image.tsx`

Las paginas de foto generan metadata especifica por imagen.

## Buenas practicas del proyecto

- Mantener cambios pequenos y localizados.
- Preservar calidad, metadata, lazy loading y estabilidad visual de imagenes.
- No modificar imagenes originales sin necesidad explicita.
- No anadir dependencias sin aprobacion.
- Usar TypeScript estricto y tipos compartidos para diccionarios, fotos y datos generados.
