# Alexgallery

Portfolio fotografico y archivo visual de Alex Vicente Lopez construido con Next.js App Router y exportacion estatica.

## Stack

- Next.js 16 con App Router
- React 19
- TypeScript estricto
- Tailwind CSS 4
- GSAP y Framer Motion para animaciones
- `sharp`, `plaiceholder` y `exifr` para optimizacion y metadata de imagenes
- Wrangler para desplegar los assets exportados en Cloudflare

## Desarrollo

```bash
pnpm install
pnpm dev
```

## Scripts

- `pnpm dev`: servidor local de desarrollo.
- `pnpm build`: build estatica de produccion.
- `pnpm typecheck`: validacion TypeScript.
- `pnpm lint`: alias de `pnpm typecheck`.
- `pnpm optimize-images`: genera versiones WebP/AVIF, blur placeholders y metadata desde `public/photos/raw`.
- `pnpm deploy:wrangler`: build y despliegue con Wrangler assets desde `out/`.

## Estructura

- `app/`: rutas, layouts, metadata, sitemap y robots.
- `components/`: secciones y componentes UI.
- `dictionaries/`: textos en `es` y `en`.
- `hooks/`: hooks reutilizables.
- `lib/`: datos de galeria, diccionarios y loader de imagenes.
- `public/photos/`: imagenes raw y optimizadas.
- `scripts/optimize-images.ts`: pipeline de optimizacion.
- `types/`: tipos compartidos.

## Imagenes

Las imagenes originales viven en `public/photos/raw`. No deben modificarse salvo que sea intencional. Para regenerar derivados:

```bash
pnpm optimize-images
```

El script escribe versiones optimizadas en `public/photos/optimized` y actualiza `lib/images-data.json`.

## Licencia

© 2026 Alex Vicente Lopez. Todas las fotografias, imagenes y contenidos visuales estan protegidos por derechos de autor. Queda prohibida su reproduccion, distribucion, modificacion o explotacion sin permiso previo y por escrito.

Contacto: `alexviclop@gmail.com`.
