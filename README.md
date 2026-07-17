# Alexgallery

Portfolio fotográfico de Alex Vicente Lopez — Next.js + exportación estática en Cloudflare.

## Stack

- Next.js 16 (App Router, `output: "export"`)
- React 19 · TypeScript estricto · Tailwind CSS 4
- GSAP + ScrollTrigger · Lenis smooth scroll adaptativo
- `sharp` · `plaiceholder` · `exifr` para imágenes

## Comandos

```bash
pnpm dev               # desarrollo local
pnpm build             # build estática → out/
pnpm typecheck         # validación TypeScript
pnpm test              # pruebas de infraestructura motion, intro y hero
pnpm optimize-images   # genera WebP/AVIF, blur placeholders y EXIF desde public/photos/raw
pnpm deploy:wrangler   # build + deploy a Cloudflare
```

## Configuración

Copia `.env.example` a `.env.local` si necesitas cambiar la URL canónica en
desarrollo. En producción, `NEXT_PUBLIC_BASE_URL` debe apuntar a
`https://gallery.aleviclop.dev`.

## Imágenes

Originales en `public/photos/raw/`. Después de añadir o cambiar fotos:

```bash
pnpm optimize-images
```

Genera variantes optimizadas en `public/photos/optimized/` y actualiza `lib/images-data.json`.

## Documentación técnica

- [Auditoría RAW.VIVES](docs/RAW_VIVES_AUDIT.md)
- [Arquitectura RAW.VIVES](docs/RAW_VIVES_ARCHITECTURE.md)
- [Sistema visual RAW.VIVES](docs/RAW_VIVES_DESIGN_SYSTEM.md)
- [Sistema motion RAW.VIVES](docs/RAW_VIVES_MOTION_SYSTEM.md)
- [Sistema de intro RAW.VIVES](docs/RAW_VIVES_INTRO_SYSTEM.md)
- [Sistema de hero RAW.VIVES](docs/RAW_VIVES_HERO_SYSTEM.md)
- [Home narrativa RAW.VIVES](docs/RAW_VIVES_HOME_NARRATIVE.md)
- [Sistema de archivo RAW.VIVES](docs/RAW_VIVES_ARCHIVE_SYSTEM.md)
- [Sistema de detalle fotográfico RAW.VIVES](docs/RAW_VIVES_PHOTO_DETAIL_SYSTEM.md)

## Licencia

El **código fuente** de este proyecto está disponible públicamente con fines de referencia únicamente.

Las **fotografías, imágenes y contenidos visuales** son obra exclusiva de Alex Vicente Lopez y están protegidos por derechos de autor. **Queda expresamente prohibido**:

- Reproducir, copiar o descargar las imágenes
- Distribuir o publicar las imágenes en cualquier medio
- Modificar, transformar o crear obras derivadas
- Usar las imágenes con fines comerciales o no comerciales sin autorización

Para solicitar permisos de uso: [alexviclop@gmail.com](mailto:alexviclop@gmail.com)

© 2026 Alex Vicente Lopez. Todos los derechos reservados.
