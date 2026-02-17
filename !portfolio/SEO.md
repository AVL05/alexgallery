Guía rápida de SEO para este proyecto

✅ Cambios realizados automáticamente:

- Ampliada la `metadata` global en `app/layout.tsx` (Open Graph, Twitter, keywords, robots, themeColor y canonical).
- Añadido `app/head.tsx` con JSON-LD (schema.org Person) y meta por defecto (favicon/canonical/twitter card).
- Añadidos archivos públicos: `public/robots.txt` y `public/sitemap.xml` (con URLs actualizadas al dominio).
- Añadida ruta dinámica `app/sitemap.xml/route.ts` para servir un `sitemap.xml` dinámico en runtime.
- Añadida `public/og-image.svg` como imagen por defecto para Open Graph.

🔧 Acciones que debes completar (recomendado):

1. Configurar la URL del sitio en la variable de entorno:

   - Añade `NEXT_PUBLIC_SITE_URL=https://tu-dominio.com` en tu `.env` o en la configuración de deployment.

2. Añadir recursos para Open Graph y favicon:

   - `public/og-image.png` → imagen para `og:image` (1200×630 recomendado).
   - `public/favicon.ico` → favicon del sitio.

3. Revisar y personalizar `app/head.tsx`:

   - Rellena `sameAs` con tus perfiles sociales (LinkedIn, GitHub, Instagram, etc.).

4. Optimización adicional:
   - Añade `alt` descriptivos a las imágenes en `components/`.
   - Usa `next/image` para optimizar imágenes y `priority` en la imagen principal.
   - Ejecuta Lighthouse/Pagespeed y mejora CLS/TTI/TTFB.
   - Considera generar el `sitemap.xml` dinámicamente si tienes muchas páginas.

💡 Siguientes recomendaciones opcionales:

- Añadir `hreflang` si el sitio tiene múltiples idiomas.
- Registrar el sitio en Google Search Console y verificar (meta tag o archivo verificación).
- Añadir datos estructurados adicionales (Project, Article, BreadcrumbList) por página según el contenido.

¿Quieres que implemente algunos de estos pasos ahora (p. ej. agregar `og-image` por defecto y configuración del sitemap dinámico)?
