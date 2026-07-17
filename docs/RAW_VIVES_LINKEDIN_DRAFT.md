# Borrador para LinkedIn

He convertido mi archivo fotográfico en una experiencia digital completa: **raw.vives**.

No quería construir otra cuadrícula de imágenes. El objetivo fue crear una pieza editorial en la que cada fotografía tuviera contexto, ritmo y una URL propia, y donde la tecnología permaneciera al servicio de la mirada.

El proyecto incluye:

- una home narrativa y bilingüe;
- un archivo con búsqueda, filtros y orden compartible;
- 60 páginas localizadas de detalle;
- motion con GSAP, cursor contextual y WebGL progresivo;
- navegación por teclado, reduced motion y fallbacks reales;
- pipeline de imágenes WebP/AVIF, SEO técnico y despliegue estático en Cloudflare.

La preparación final ha cerrado también lo que normalmente no aparece en una captura: CI reproducible, headers, caché, CSP, privacidad, manifest, rollback y smoke tests.

Resultado local: 73 rutas estáticas, 67 tests y un artefacto de 39,1 MiB sin publicar fuentes fotográficas.

Diseño, desarrollo y fotografía por Alex Vicente.

🔗 https://gallery.aleviclop.dev

#nextjs #react #typescript #webdesign #photography #accessibility #webperformance

> Nota de publicación: actualizar la frase de disponibilidad solo después de desplegar esta release y completar los smoke tests de producción.
