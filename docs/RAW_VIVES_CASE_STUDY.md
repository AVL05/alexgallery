# raw.vives — Caso de estudio

## 1. Resumen

raw.vives convierte un conjunto fotográfico personal en un archivo visual bilingüe, navegable y compartible. El resultado combina una home narrativa con un índice funcional y 60 páginas localizadas de detalle.

## 2. Problema inicial

Una galería lineal no explicaba la mirada del autor, dificultaba descubrir relaciones entre imágenes y ofrecía poco contexto técnico para presentar el proyecto como trabajo profesional.

## 3. Objetivo

Construir una experiencia editorial distintiva sin sacrificar accesibilidad, rendimiento, SEO, mantenibilidad ni la autonomía de cada fotografía.

## 4. Audiencia

Público general, equipos creativos, potenciales colaboradores y personas interesadas en fotografía, diseño y desarrollo frontend.

## 5. Identidad

La identidad usa contraste monocromo, tipografía serif a gran escala, metadatos monoespaciados, ritmo de publicación y una voz contenida. La interfaz funciona como marco, no como protagonista.

## 6. Arquitectura

Next.js App Router genera un sitio completamente estático. Los datos fotográficos y diccionarios se resuelven en build; React se reserva para filtros, motion y controles que necesitan estado. Cloudflare Workers Static Assets distribuye `out/`.

## 7. Evolución por fases

El proyecto avanzó desde auditoría y sistema visual hacia narrativa, archivo, detalle, proceso creativo, interacciones, hardening de accesibilidad/rendimiento y, finalmente, preparación de producción. Cada fase conservó las anteriores y documentó sus límites.

## 8. Home narrativa

La home ordena ocho momentos: intro, hero, manifiesto, historia destacada, capítulos, trabajo seleccionado, proceso y acceso al archivo. La secuencia introduce autoría antes de pedir exploración.

![Hero desktop](assets/screenshots/home-hero-desktop.webp)

## 9. Archivo

El archivo permite búsqueda textual, categorías, año, orden y carga progresiva. El estado se refleja en query params y la cuadrícula mantiene composición editorial con diferentes orientaciones.

![Archivo desktop](assets/screenshots/archive-grid-desktop.webp)

## 10. Detalle

Cada fotografía tiene URL, título, descripción, metadata localizada, fullscreen, enlace optimizado, navegación y selección relacionada. El detalle ya no es un modal efímero: es contenido indexable.

![Detalle fotográfico](assets/screenshots/photo-detail-desktop.webp)

## 11. Proceso creativo

Un pipeline con Sharp produce variantes WebP/AVIF, blur placeholders y metadata. Los controles validan correspondencia y evitan publicar fuentes de proceso o archivos de cámara.

## 12. Interacciones

Motion, feedback de presión, magnetismo y transiciones refuerzan continuidad. Los controles restauran foco, limpian timers y admiten teclado; la navegación sigue siendo comprensible sin efectos.

## 13. WebGL

El fondo hero aporta atmósfera mediante una capa WebGL diferida. Se omite con reduced motion, forced colors o capacidades insuficientes. La imagen y el mensaje principal nunca dependen del canvas.

## 14. Accesibilidad

Se añadieron landmarks, skip link, foco visible, cierre con Escape, estados live, tamaños táctiles y fallbacks. Los smoke tests comprobaron menús, fullscreen, foco restaurado, teclado, reduced motion y forced colors.

## 15. Rendimiento

La estrategia combina export estático, imágenes responsivas, carga diferida y activación condicional de efectos. La build validada contiene 73 rutas generadas, 70 HTML y aproximadamente 39,1 MiB, frente a unos 43,4 MiB antes de excluir fuentes web del artefacto.

## 16. Internacionalización

Todo el producto se ofrece en español e inglés mediante diccionarios tipados. Las rutas, metadata, alternates, privacidad y mensajes operativos respetan la locale actual.

## 17. SEO

Canonical, `hreflang`, Open Graph, Twitter cards, JSON-LD, robots y sitemap salen de una única URL de sitio. El sitemap final contiene 63 URLs indexables: raíz, dos homes y 60 detalles.

## 18. Principales retos

- Mantener el carácter visual sin bloquear dispositivos modestos.
- Crear rutas estáticas localizadas para contenido muy visual.
- Conservar contexto de archivo al abrir un detalle.
- Evitar que fuentes fotográficas terminen en el despliegue.
- Separar preparación técnica de una publicación aún no autorizada.

## 19. Decisiones

Se eligió export estático, i18n manual, datos locales, Wrangler como runtime de preview y deployment manual. No se incorporaron analítica, consent manager ni servicios de observabilidad sin necesidad confirmada.

## 20. Compromisos

La generación estática simplifica operación pero exige rebuild para contenido y variables. WebGL mejora atmósfera a cambio de un chunk opcional. Web3Forms evita backend propio, pero introduce un encargado externo y riesgo operativo.

## 21. Resultados

El repositorio termina con contrato de runtime, CI reproducible, pipeline manual de producción, política de caché y seguridad, privacidad explícita, manifest, iconos, material de portfolio y documentación de rollback.

## 22. Métricas reales

| Métrica | Resultado local |
| --- | --- |
| Tests | 67/67 |
| Rutas estáticas | 73 |
| HTML exportados | 70 |
| Sitemap | 63 URLs |
| Artefacto `out/` | 40.983.236 bytes |
| Fuentes en `out/photos/raw` | 0 |
| Capturas entregadas | 6 WebP, ~383 KiB total |

No se incluyen Core Web Vitals de producción porque esta versión no se ha desplegado.

## 23. Aprendizajes

La calidad percibida depende tanto del orden editorial como del acabado visual. Los fallbacks deben diseñarse desde el principio. Una release profesional necesita tratar dominio, privacidad, artefacto, rollback y evidencia con el mismo rigor que la interfaz.

## 24. Próximos pasos

Crear preview remoto, validar en dispositivos reales, desplegar con autorización y medir Web Vitals de campo. Solo después tendría sentido decidir analítica, monitorización o E2E continuo.

## 25. Stack

Next.js 16, React 19, TypeScript, Tailwind CSS 4, GSAP, Three.js, Vitest, Sharp, pnpm 10, Node 22 y Cloudflare Workers.

## 26. Enlaces

- Producción actual: [gallery.aleviclop.dev](https://gallery.aleviclop.dev)
- Guía de despliegue: [RAW_VIVES_DEPLOYMENT.md](RAW_VIVES_DEPLOYMENT.md)
- Arquitectura: [RAW_VIVES_ARCHITECTURE.md](RAW_VIVES_ARCHITECTURE.md)
- Auditoría: [RAW_VIVES_PRODUCTION_AUDIT.md](RAW_VIVES_PRODUCTION_AUDIT.md)
