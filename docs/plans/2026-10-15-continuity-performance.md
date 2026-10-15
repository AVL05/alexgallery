# Continuidad del archivo y carga adaptativa

## Cambios

- Una fotografía abierta directamente con parámetros del archivo conserva los filtros al regresar, incluso sin sessionStorage. Se reutiliza la serialización validada; la serie y el origen guardado mantienen su prioridad.
- El desplazamiento numérico sin Lenis actualiza la caché de ScrollTrigger mediante su API existente. Antes, un refresh posterior restablecía la posición anterior (0), aunque el lote y el foco se recuperaban correctamente.
- La política de calidad del hero omite WebGL cuando Network Information informa `2g` o `slow-2g`, además de las restricciones existentes. Si la API no existe, conserva el comportamiento anterior. La fotografía y la navegación siguen disponibles.
- Sin dependencias nuevas, cambios de catálogo, fotografías, CSP ni arquitectura de export estático.

## Evidencia

Los tests nuevos reprodujeron antes de corregir:

- ES y EN: ausencia del enlace de regreso con `category=fauna&sort=newest` al abrir directamente la fotografía.
- Regreso tras recargar la fotografía: posición esperada cercana a 4764 px, posición real 0. Instrumentación temporal confirmó un refresh de ScrollTrigger después del desplazamiento; se retiró la instrumentación.

Medición local con Chromium, export estático y Wrangler, viewport 1440 × 900, DPR 1, tres contextos nuevos por variante. Se simuló únicamente `navigator.connection.effectiveType = "2g"`; no se limitó la red ni la CPU. Observación hasta networkidle más 3 segundos para incluir intro y escena diferida. Bytes: suma de encodedBodySize de recursos, excluye el documento HTML y no representa transferencia comprimida de producción.

| Métrica | Antes | Después |
| --- | ---: | ---: |
| Recursos descargados | 3 472 097 bytes | 894 504 bytes |
| Modelo decorativo solicitado | Sí, 2 196 844 bytes | No |
| Canvas montado | Sí, 3/3 | No, 3/3 |

Reducción de recursos: aproximadamente 74 %. No se atribuye una mejora de Core Web Vitals de producción a estos datos locales. Sin cambiar la señal de conexión, el diseño de escritorio mantiene la escena. El móvil de 390 px ya la omitía antes de esta fase.

## Validación

- `pnpm typecheck`: PASS.
- `pnpm test`: PASS, 152 tests.
- `pnpm build`: PASS, 203 páginas generadas y 197 payloads normalizados.
- Pruebas específicas de continuidad: PASS; incluye ES/EN sin contexto guardado, lote 2 tras recarga, foco y posición con/sin movimiento reducido, serie y ausencia de descarga GLB en 2G.
- `pnpm e2e` contra Wrangler recién iniciado: PASS, 32/32 en Chromium (28,8 s), incluidos contacto, responsive 320–2560 px, colores forzados y las seis pruebas nuevas.
- `git diff --check`: PASS.

## Límites

No hay `.env.local` ni clave real de Web3Forms en este entorno; únicamente `.env.example`. No se enviaron mensajes reales. No se probaron dispositivos físicos, Safari ni producción. No se hizo commit, push ni despliegue.

## Ajuste posterior de jerarquía del inicio

- Inicio ES/EN: identificación directa del archivo y de Alex Vicente; descriptor de ciudad, naturaleza y luz.
- CTA del archivo con la variante principal existente y altura de 48 px. Menú compartido: Archivo, Series, Selección, Sobre mí.
- Marcos decorativos al 30 % de opacidad para reforzar la fotografía principal. Sin modificar fotografías, recortes ni curación.
- Las introducciones específicas de las tres series ya estaban presentes y se conservaron. Correo directo comprobado en ES/EN como alternativa al formulario.
- Validación final: typecheck, 152 tests, build, diff check y 36/36 E2E PASS. Inspección visual de capturas a 390 y 1440 px; las cuatro nuevas pruebas comprueban autor, CTA visible completo, destino y correo en ES/EN a 320 y 1440 px.
- Capturas: `C:/Users/alexv/.codex/visualizations/2026/10/15/raw-vives-home/home-390.png` y `home-1440.png`.
