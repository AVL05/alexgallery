# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

```bash
pnpm dev              # servidor de desarrollo
pnpm build            # build estática (output: out/)
pnpm typecheck        # validación TypeScript (también alias: pnpm lint)
pnpm optimize-images  # regenerar WebP/AVIF, blur placeholders y EXIF desde public/photos/raw
pnpm validate-photo-process # validar configuración y recursos de proceso auténticos
pnpm prepare-photo-process -- --id <id> --stage <original|corrected> --input <export>
pnpm deploy:wrangler  # build + deploy a Cloudflare via Wrangler assets
```

Las pruebas automatizadas usan Node Test Runner mediante `pnpm test`.

## Arquitectura

**Exportación estática** (`output: "export"` en `next.config.mjs`). No hay runtime de servidor en producción; todo se sirve como HTML/JS/CSS estático desde `out/` vía Cloudflare.

**i18n manual** con App Router: la ruta raíz (`app/page.tsx`) redirige a `/es` por defecto. Las páginas viven bajo `app/[locale]/` y reciben el diccionario cargado en el servidor (RSC), que pasan como prop al componente cliente (`home-client.tsx`). Los locales soportados son `es` y `en`, definidos en `lib/dictionary.ts`.

**Pipeline de imágenes**: las fotos originales viven en `public/photos/raw/`. El script `scripts/optimize-images.ts` genera:
- Versiones WebP + AVIF en `public/photos/optimized/{400,800,1200,original}/`
- Blur data URLs (plaiceholder) y datos EXIF + histograma
- Escribe todo en `lib/images-data.json`

El custom image loader (`lib/image-loader.ts`) mapea los anchos que pide Next.js a las variantes pre-generadas. **No usar `next/image` con loader por defecto** — siempre pasa por este loader.

**Datos de galería** centralizados en `lib/gallery-data.ts`: array `photos` tipado con `BasePhoto`, y array `categories`. Para añadir una foto: agregar entrada al array y colocar el raw en `public/photos/raw/`, luego ejecutar `pnpm optimize-images`.

**Página de foto individual**: `app/[locale]/photo/[id]/page.tsx` genera locales × fotos, metadata y JSON-LD en build time. La experiencia modular vive en `components/photo-detail/`; `lib/photo-detail/` centraliza contenido localizado, contexto, relacionadas y SEO.

**Proceso creativo**: `lib/photo-process/config.ts` solo habilita comparativas con procedencia auténtica. El inventario actual tiene cero elegibles: `public/photos/raw` contiene fuentes finales WebP, no RAW de cámara. La build ejecuta `validate-photo-process`; componentes, modelo y guía están en `components/photo-process/`, `types/photo-process.ts` y `docs/RAW_VIVES_CREATIVE_PROCESS_SYSTEM.md`.

**Animaciones**: GSAP + ScrollTrigger para el parallax del texto de fondo y la entrada de contenido. Lenis para smooth scroll (`components/smooth-scroll.tsx`). Framer Motion disponible pero GSAP es el principal. Siempre respetar `prefers-reduced-motion`.

**Despliegue**: Cloudflare via `wrangler deploy --assets=./out`. La variable de entorno `NEXT_PUBLIC_BASE_URL` debe apuntar al dominio de producción (`https://gallery.aleviclop.dev`).
