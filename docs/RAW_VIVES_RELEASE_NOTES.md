# raw.vives 1.0.0-rc.1 — Release notes

Fecha de preparación: 17 de julio de 2026. Estado: candidata validada localmente, sin despliegue ni tag.

## Resumen

Esta candidata cierra la preparación profesional de raw.vives para Cloudflare Workers. No rediseña el producto: consolida el sistema de producción, protege el artefacto fotográfico, completa privacidad/metadata y entrega material de presentación verificable.

## Novedades

- Runtime y package manager fijados para builds reproducibles.
- CI en push/PR y despliegue de producción exclusivamente manual.
- Preview local real con Wrangler y dry-run de 1.242 assets.
- Headers de seguridad, Permissions Policy y caché por tipo de recurso.
- Manifest PWA, favicon adaptativo e iconos 16/32/180/192/512.
- URL de sitio centralizada para canonical, sitemap, robots y JSON-LD.
- Política de privacidad ES/EN y Web3Forms configurable por entorno.
- Pruning de fuentes `public/photos/raw` fuera del artefacto `out`.
- README, caso de estudio, portfolio, LinkedIn, capturas y guion de vídeo.

## Métricas de validación

- 67 tests correctos.
- 73 rutas estáticas generadas y 70 documentos HTML.
- 63 URLs en sitemap.
- 40.983.236 bytes en `out/`.
- 6 capturas WebP, aproximadamente 383 KiB.
- Home ES/EN, filtro, detalle, fullscreen, mobile, reduced motion, forced colors y 404 comprobados localmente.

## Breaking changes

- Node 22.22.2 y pnpm 10.34.1 pasan a ser el contrato soportado.
- El formulario necesita `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` durante build.
- `out/photos/raw/` deja de publicarse de forma intencionada.
- El workflow antiguo de Cloudflare Pages se sustituye por Workers Static Assets manual.

## Riesgos conocidos

- La versión pública observada antes de esta release seguía usando robots antiguos.
- HTTP no redirigía a HTTPS; requiere configuración manual de Cloudflare.
- Web3Forms es una dependencia externa y la restricción por dominio puede requerir plan Pro.
- No hay Web Vitals de campo, observabilidad externa ni E2E continuo.

## Acciones antes de producción

Configurar environment/secrets, validar preview remota, activar HTTPS forzado, registrar el deployment estable, autorizar el despliegue y completar el checklist posterior.
