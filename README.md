# Alexgallery

Portfolio fotográfico de Alex Vicente Lopez — Next.js + exportación estática en Cloudflare.

## Stack

- Next.js 16 (App Router, `output: "export"`)
- React 19 · TypeScript estricto · Tailwind CSS 4
- GSAP + Framer Motion · Lenis smooth scroll
- `sharp` · `plaiceholder` · `exifr` para imágenes

## Comandos

```bash
pnpm dev               # desarrollo local
pnpm build             # build estática → out/
pnpm typecheck         # validación TypeScript
pnpm optimize-images   # genera WebP/AVIF, blur placeholders y EXIF desde public/photos/raw
pnpm deploy:wrangler   # build + deploy a Cloudflare
```

## Imágenes

Originales en `public/photos/raw/`. Después de añadir o cambiar fotos:

```bash
pnpm optimize-images
```

Genera variantes optimizadas en `public/photos/optimized/` y actualiza `lib/images-data.json`.

## Licencia

El **código fuente** de este proyecto está disponible públicamente con fines de referencia únicamente.

Las **fotografías, imágenes y contenidos visuales** son obra exclusiva de Alex Vicente Lopez y están protegidos por derechos de autor. **Queda expresamente prohibido**:

- Reproducir, copiar o descargar las imágenes
- Distribuir o publicar las imágenes en cualquier medio
- Modificar, transformar o crear obras derivadas
- Usar las imágenes con fines comerciales o no comerciales sin autorización

Para solicitar permisos de uso: [alexviclop@gmail.com](mailto:alexviclop@gmail.com)

© 2026 Alex Vicente Lopez. Todos los derechos reservados.
