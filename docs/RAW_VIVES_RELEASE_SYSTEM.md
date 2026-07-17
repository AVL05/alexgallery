# raw.vives — Sistema final de release (Fase 12)

## 1. Objetivo

Convertir el checkout validado en una candidata reproducible, publicable y reversible sin alterar el producto ni ejecutar acciones externas no autorizadas.

## 2. Estado previo

Fase 11 dejó rendimiento, accesibilidad y fallbacks validados en cuatro commits locales. Fase 12 comenzó en `main`, con `AGENTS.md` como único archivo no versionado.

## 3. Hosting

Cloudflare Workers Static Assets con `out/` como directorio servido. El workflow antiguo de Pages era inconsistente y fallaba por caché npm frente a lockfile pnpm.

## 4. Entornos

Local (`next dev`), preview de artefacto (`wrangler dev`) y producción (Worker custom domain). No existe staging persistente.

## 5. Variables

`NEXT_PUBLIC_BASE_URL` y `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` son inputs públicos de build. Token y account ID de Cloudflare son secretos operativos.

## 6. Dominio

Canonical único: `gallery.aleviclop.dev`.

## 7. DNS

Cloudflare proxied; A observadas en la auditoría: `188.114.96.5` y `188.114.97.5`. La route custom domain queda declarada en Wrangler.

## 8. HTTPS

TLS válido observado, pero HTTP devolvía 200. Pendiente activar redirección edge y volver a probar.

## 9. Redirecciones

No se detectó alias válido que conservar. `www.gallery...` no resuelve y el antiguo workers.dev devuelve 404; cualquier alta futura debe redirigir al canonical.

## 10. Headers

`_headers` define seguridad y caché con 14 reglas confirmadas por Wrangler local.

## 11. CSP

Mantiene `default-src 'self'`, permite los orígenes estrictamente necesarios para imágenes, Web3Forms y estilos/scripts del build. Cambios externos requieren revisión.

## 12. Permissions Policy

Deshabilita sensores, cámara, micrófono, geolocalización, pagos, USB, serial, XR y otras capacidades no usadas.

## 13. Caché

HTML revalidable; chunks inmutables; imágenes con TTL editorial; metadata con TTL corto. No se asigna `immutable` a fotografías que pueden reemplazarse conservando URL.

## 14. Compresión

Responsabilidad del edge. La producción observada negoció Brotli para HTML y gzip para JavaScript.

## 15. CDN

Cloudflare distribuye assets; no hay un segundo CDN ni transformación remota de imágenes.

## 16. Imágenes

Sharp genera originales web, 400/800/1200 WebP+AVIF, dimensiones y placeholders. `next/image` usa el loader propio.

## 17. Analítica

No instalada. Se evita crear telemetría sin finalidad ni política de datos.

## 18. Eventos

No se emiten eventos de producto. Una taxonomía futura debería cubrir navegación, filtros y contacto sin capturar consultas o PII por defecto.

## 19. Privacidad

Página ES/EN, enlace en contacto/footer y explicación de Web3Forms, almacenamiento de sesión, cookies y derechos.

## 20. Cookies

No hay cookies propias ni consent banner. Cloudflare/Web3Forms pueden tener tratamiento independiente sujeto a sus políticas.

## 21. Monitorización

Se define un mínimo de disponibilidad, TLS, rutas y formulario; no se contrata proveedor en esta fase.

## 22. Logs

GitHub Actions y Cloudflare ofrecen evidencia operativa. `wrangler tail` queda para diagnóstico autorizado; evitar PII y retención innecesaria.

## 23. Source maps

No se publican sourcemaps deliberadamente. Al ser assets estáticos y no existir integración de errores, su exposición no aporta suficiente valor en esta release.

## 24. CI

Push/PR a `main`: install frozen, typecheck, lint, tests, build y diff check con Node/pnpm fijados.

## 25. Pipeline

Producción usa workflow manual, environment protegido, mismas validaciones, deploy Wrangler y smoke HTTP.

## 26. Preview

Local validada. Preview URL remota queda pendiente de credenciales; se recomienda `versions upload --preview-alias release-candidate`.

## 27. Producción

No desplegada durante Fase 12. La web pública observada corresponde a una versión anterior.

## 28. Build reproducible

Lockfile frozen, versiones declaradas, Wrangler local, entorno explícito y pipeline sin dependencias globales.

## 29. SEO final

URL central, canonical, alternates, robots, sitemap y JSON-LD. 63 URLs indexables.

## 30. Metadata social

Open Graph/Twitter conservan imágenes fotográficas reales. La validación final de cards requiere la release accesible públicamente.

## 31. Manifest

Manifest estático localizado como aplicación `raw.vives`, display standalone, tema oscuro e iconos any/maskable.

## 32. Favicons

SVG adaptativo y PNG 16, 32, 180, 192 y 512 generados desde la identidad existente.

## 33. README

Reescrito como entrada de producto, desarrollo, arquitectura, operación y derechos.

## 34. Caso de estudio

Documento de 26 secciones con problema, evolución, decisiones, métricas y enlaces.

## 35. Portfolio

Resumen breve con contribución, resultado, stack y URL.

## 36. LinkedIn

Borrador preparado, con aviso de actualizar el estado tras el despliegue.

## 37. Capturas

Seis WebP reales: hero desktop/mobile, seleccionado, archivo desktop/mobile y detalle. No se simularon intro, comparador, cursor ni tablet.

## 38. Vídeo

Plan, timeline y voz entregados; no se grabó ni publicó un vídeo.

## 39. Changelog

`CHANGELOG.md` adopta secciones Added/Changed/Security/Fixed bajo Unreleased.

## 40. Release notes

`1.0.0-rc.1` describe candidata, métricas, breaking changes, riesgos y tareas previas, sin crear tag.

## 41. Rollback

Registrar version ID estable y usar `wrangler rollback <VERSION_ID>`; validar dominio después. Static Assets no tiene migraciones de datos propias.

## 42. Smoke tests

Localmente: ES/EN, query de archivo, detalle, fullscreen/Escape/foco, menú mobile, 404, raw 404, reduced motion, forced colors, headers y metadatos.

## 43. Validación

Typecheck, lint, 67 tests, build de 73 rutas, dry-run Wrangler de 1.241 assets y diff check. La build eliminó 4.831.474 bytes de fuentes públicas.

## 44. Publicación

No ejecutada. Exige autorización, secrets, preview y checklist.

## 45. Riesgos

HTTP sin redirect, dependencia Web3Forms, ausencia de field data/monitorización, preview remota pendiente y release pública antigua.

## 46. Problemas pendientes

Configurar entorno externo, activar HTTPS, validar formulario/dominio, medir Web Vitals y decidir observabilidad. Ninguno justifica falsificar el estado de release.

## 47. Checklist final

El checklist separa checks técnicos completados de acciones externas pendientes. El resultado es **release-ready local**, no “publicado”.

## Evidencia local

| Comprobación | Resultado |
| --- | --- |
| Node / pnpm / Wrangler | 22.22.2 / 10.34.1 / 4.112.0 |
| Typecheck / lint | Correctos |
| Vitest | 67/67 |
| Build | 73 rutas; 70 HTML |
| Sitemap | 63 URLs |
| Output | 40.983.236 bytes |
| Wrangler headers | 14 reglas válidas |
| Raw en output | Ausente; 404 |
| Producción desplegada | No |
