# Auditoría de producción de RAW.VIVES

Fecha: 17 de julio de 2026. Alcance: Fase 11 — rendimiento, accesibilidad y
robustez final. Esta auditoría evalúa el repositorio y su exportación estática
real; no abre la Fase 12 ni añade una nueva experiencia visual.

## 1. Resumen

La aplicación conserva sus 70 páginas estáticas, rutas ES/EN, catálogo, motion,
cursor y mejora WebGL. Se redujo el JavaScript inicial de la home un 8,23 % raw
y un 7,15 % Brotli, se retiraron seis dependencias runtime sin uso necesario, se
devolvió el contenido animado al árbol accesible y se reforzaron teclado, colores
forzados, SEO localizado, fallbacks de formulario y cleanup.

## 2. Estado inicial

- Rama: `main`; único archivo ajeno sin seguimiento: `AGENTS.md`, preservado.
- Next.js 16.2.6, React 19, TypeScript estricto, App Router y `output: "export"`.
- 30 fotografías de catálogo, una imagen de hero y 60 fichas localizadas.
- 0 procesos RAW auténticos elegibles; el comparador no se monta en producción.
- Three se cargaba de forma diferida y el HTML fotográfico ya era el fallback.
- `typecheck`, `lint`, 60 pruebas, build y `git diff --check` pasaban.

## 3. Métricas iniciales

Medidas sobre `out/` tras una build limpia de la revisión `1060953`:

| Métrica | Inicial |
| --- | ---: |
| Páginas generadas | 70 |
| Export completo | 46.365.511 B |
| Home ES HTML | 194.340 B |
| Home EN HTML | 193.221 B |
| Ficha ES 21 HTML | 89.323 B |
| Scripts iniciales home | 18 |
| JS inicial home raw / gzip / Brotli | 1.030.867 / 316.495 / 276.611 B |
| Scripts iniciales ficha | 16 |
| JS inicial ficha raw / gzip / Brotli | 891.813 / 280.972 / 245.397 B |
| Preloads de imagen por home/ficha | 1 / 1 |

En una observación local no simulada se registraron FCP 284 ms, CLS 0 y cero
long tasks. No es una ejecución Lighthouse ni una prueba de laboratorio aislada;
se conserva como dato orientativo, no como SLA.

## 4. Problemas encontrados

1. `autoAlpha: 0` aplicaba `visibility:hidden` a contenido bajo el fold hasta su
   reveal, retirándolo temporalmente del árbol accesible.
2. El formulario cargaba React Hook Form, Zod y resolver para reglas simples.
3. Se enviaban al cliente histogramas, alias AVIF y EXIF vacíos sin consumo.
4. Faltaba un skip link global localizado.
5. Forced Colors no desactivaba explícitamente cursor, Lenis ni WebGL.
6. El `lang` inglés solo se corregía tras hidratación.
7. Faltaban `x-default` y canonical localizado en la política.
8. El sitemap usaba la fecha de cada build como `lastModified` no verificable.
9. La navegación escribía estado React en cada evento de scroll.
10. Se mantenían dependencias de Masonry, lightbox y tema sin referencias.

## 5. Severidad

- Alta: contenido retirado del árbol accesible durante reveals.
- Media: coste inicial evitable del formulario; fallback incompleto en Forced
  Colors; navegación inicial inglesa con `lang` tardío.
- Baja: payload fotográfico redundante, scroll sin RAF, alternates incompletos,
  dependencias huérfanas y promesa de fuentes susceptible de callback tardío.
- Informativa: ausencia de Lighthouse local y títulos fotográficos ingleses aún
  procedentes de una traducción editorial manual previa.

## 6. Cambios realizados

- Validación propia, pura y probada para contacto/licencias.
- Fallback HTML `POST` a Web3Forms; la mejora cliente conserva estado y mensajes.
- Proyección segura de datos fotográficos antes del límite Server/Client.
- Reveals basados en `opacity` y transform, nunca en `visibility`.
- Skip link localizado y `main` enfocable en home, ficha y política.
- Capacidad Forced Colors centralizada y fallbacks nativos.
- Bootstrap temprano de idioma y alternates SEO completos.
- Scroll de navegación agrupado en RAF y callback de fuentes cancelable.
- Seis dependencias runtime y una declaración obsoleta retiradas.

## 7. Bundle

El chunk diferido de Three sigue fuera del JS inicial: 531.315 B raw en la build
final. No se fusionó con la home ni se añadió otro renderer. El chunk de cliente
de la home perdió las librerías de formulario; el número de scripts iniciales se
mantiene en 18 para no convertir el recorte en una falsa mejora por concatenación.

## 8. JavaScript

Home final: 946.063 B raw, 294.197 B gzip y 256.843 B Brotli. La reducción es
84.804 B raw, 22.298 B gzip y 19.768 B Brotli. La ficha queda prácticamente
estable: 892.380 B raw y 245.591 B Brotli; el pequeño aumento corresponde a la
infraestructura compartida de idioma, Forced Colors y skip link.

## 9. Imágenes

- Solo hero y media principal de ficha mantienen prioridad/preload.
- Archivo, narrativa, relacionadas y fullscreen permanecen lazy según contexto.
- El loader personalizado y las variantes locales no cambian.
- Payload cliente sin `histogram`, `srcAvif` ni EXIF vacío.
- Assets finales: 28.873.571 B en WebP/AVIF/PNG/SVG dentro de `out/`.

## 10. Fuentes

Prata y Manrope siguen autoalojadas por `next/font`, con `display: swap`. La build
contiene 105.712 B WOFF2. No se añadieron familias ni peticiones remotas. Tras
`document.fonts.ready` se refresca layout solo mientras el provider siga montado.

## 11. CSS

CSS final: 77.691 B sin comprimir. Se añadió únicamente el contrato Forced Colors
y el skip link reutiliza utilidades existentes. Reduced motion conserva duración
prácticamente nula, scroll automático y View Transitions sin movimiento visible.

## 12. DOM

Home final observada: un `h1`, diez `h1/h2` visibles semánticamente, 27 imágenes
montadas, cero imágenes sin `alt`, cero IDs duplicados y cero botones sin nombre.
Los dos enlaces visuales que no tienen texto obtienen nombre desde el `alt` de su
imagen. No se introdujo virtualización ni duplicación del archivo.

## 13. GSAP

GSAP sigue centralizado. Reveals, texto, imagen, hero y navegación animan
`opacity`/transform; `visibility` queda reservado a intro/cursor, donde sí forma
parte del estado modal o decorativo. Los contextos de `useGSAP` se revierten.

## 14. ScrollTrigger

No hay triggers por tarjeta. Se mantienen los triggers editoriales existentes y
el progreso de hero compartido con WebGL. Los refresh se agrupan en RAF y cada
primitive mata solo sus propios tweens/triggers.

## 15. Lenis

Continúa existiendo una sola instancia. Se activa únicamente con puntero fino,
hover, sin touch principal, sin reduced motion y sin Forced Colors. Locks por
fuente, desmontaje y cambios de capacidad destruyen o pausan la instancia.

## 16. Cursor

Sigue siendo un chunk diferido con un único `pointermove`. Forced Colors,
reduced motion, teclado, touch, opt-out, error y regiones nativas conservan
cursor del sistema. La CSS impide que un atributo residual oculte el cursor.

## 17. Comparador

Producción mantiene 0 comparativas auténticas y 0 payload de proceso. No se
generaron RAW ni fixtures. Su range, teclado, pointer capture, fallback estático
y fullscreen siguen cubiertos por la suite previa.

## 18. WebGL/WebGPU

Three/WebGL continúa siendo progresivo y diferido. Reduced motion, Save-Data,
touch primario, dispositivo limitado y Forced Colors producen 0 canvas. WebGPU
permanece informativo. El navegador confirmó 0 canvas en reduced/forced colors.

## 19. Memoria

No se añadió estado por frame. GPU, textura, geometría, material, observers y RAF
mantienen cleanup existente. La promesa de fuentes ya no dispara refresh tras
unmount. Las métricas CDP de proceso compartido no se atribuyen al sitio porque
incluyen otros documentos del navegador; se evita publicar una cifra engañosa.

## 20. Listeners

- Un listener global de puntero para cursor/señal gráfica.
- Un listener de scroll de navegación, ahora limitado a un RAF pendiente.
- Teclado de overlays y ficha se registra solo durante su ciclo de vida.
- Media queries comparten store y eliminan el listener al último unsubscribe.

## 21. Observers

WebGL mantiene un `IntersectionObserver` y un `ResizeObserver` scoped. No hay
observers por tarjeta ni por filtro. Motion usa ScrollTrigger con cleanup local.
No se añadieron MutationObservers ni polling.

## 22. Accesibilidad

La corrección principal evita `visibility:hidden` en contenido editorial. Se
mantienen landmarks, un `h1`, jerarquía, alt, labels, `aria-live`, targets de
44 px, foco visible y controles semánticos. El objetivo operativo es WCAG 2.2 AA;
la conformidad formal requiere auditoría humana/AT independiente.

## 23. Teclado

Se añadió “Saltar al contenido”. Fullscreen confirmó apertura, lock, Escape,
cierre y retorno de foco. Menú móvil confirmó foco inicial, Escape, desbloqueo y
retorno al trigger. La ficha conserva flechas solo fuera de controles y overlays.

## 24. Lectores de pantalla

El snapshot accesible final incluye manifiesto, historia, capítulos, trabajo,
archivo, contacto y cierre sin necesidad de scroll. Imágenes y enlaces visuales
conservan nombres; estados de copia, filtros y formulario usan anuncios discretos.
No se ejecutó NVDA/JAWS/VoiceOver real, por lo que queda como validación pendiente.

## 25. Reduced motion

Emulación real: media query activa, 0 canvas, 0 cursor personalizado, `scroll-
behavior:auto` y todos los headings visibles. Press, diálogo, filtros, navegación
y contenido permanecen funcionales.

## 26. Forced colors

Emulación real: media query activa, 0 canvas y 0 cursor personalizado. Grano y
capas decorativas se ocultan, el cursor vuelve a `auto` y foco usa `Highlight`.
Lenis también queda desactivado por la capacidad central.

## 27. Touch

El contrato sigue basado en capacidades, no en ancho. Viewports 320–768 muestran
menú móvil y no desbordan. Un viewport estrecho con ratón puede conservar canvas;
un dispositivo touch primario lo desactiva mediante las media queries existentes.

## 28. SEO

Metadata localizada, Open Graph, Twitter, `ImageObject`, `Person`, `WebSite` e
`ImageGallery` se mantienen. `Person.email` reemplaza el `mailto:` incorrecto en
`sameAs`. Políticas declaran canonical y se mantienen `noindex,follow`.

## 29. Sitemap

XML válido con home, políticas y 60 fichas localizadas, más raíz. Cada pareja
incluye alternates `es`, `en` y `x-default`. Se retiró `lastModified` generado en
cada build porque no existía una fecha editorial real que lo justificara.

## 30. Robots

`robots.txt` permite rastreo global y referencia
`https://gallery.aleviclop.dev/sitemap.xml`. Las políticas controlan indexación
mediante metadata, no mediante bloqueo de crawling.

## 31. Canonicals

Home ES/EN, 60 fichas y políticas publican canonical absoluto mediante
`metadataBase`. Query de archivo y contexto de ficha no contaminan canonical.
La raíz conserva su canonical propio como selector de idioma.

## 32. Hreflang

ES/EN incluyen `es-ES`, `en-US` y `x-default`. La raíz es x-default de home; la
versión española es x-default de fichas y política por ser el contenido base.

## 33. Datos estructurados

JSON-LD raíz y 60 `ImageObject` siguen usando datos reales. No se añadió EXIF,
ubicación, RAW ni proceso ficticio. Email es propiedad de `Person`; `sameAs`
contiene solo perfiles HTTP verificables declarados por el proyecto.

## 34. i18n

El bootstrap del `<head>` aplica `lang` desde pathname antes de hidratación y el
componente cliente lo sincroniza durante navegación. El navegador confirmó `es`
y `en`. Títulos/descripciones del catálogo inglés siguen siendo contenido manual
parcialmente español; se documenta, no se inventa traducción.

## 35. Errores

Imagen, WebGL, textura, contexto, clipboard, Web Share, storage y formulario
conservan fallbacks. Se recorrieron rutas sin errores ni warnings de consola. La
build local encontró 0 referencias internas ausentes en 68 archivos HTML.

## 36. Progressive enhancement

Links, archivo en `<noscript>`, imagen HTML del hero, media principal y contenido
editorial existen sin JavaScript. Contacto/licencias tienen `action` y `method`
HTML además del envío mejorado. WebGL, cursor, filtros avanzados y fullscreen son
mejoras que no sustituyen contenido esencial.

## 37. Seguridad

`public/_headers` mantiene CSP, HSTS, nosniff, DENY, referrer y Permissions
Policy. `form-action`/`connect-src` permiten únicamente Web3Forms además de self.
La clave pública del formulario ya era cliente y no se trata como secreto. No se
añadieron HTML remotos ni ejecución dinámica.

## 38. Dependencias

Runtime baja de 22 a 16 dependencias directas. Retiradas: `@hookform/resolvers`,
`react-hook-form`, `zod`, `next-themes`, `react-masonry-css` y
`yet-another-react-lightbox`. Las restantes tienen uso de aplicación o pipeline;
no se actualizó el stack ni se añadió ninguna dependencia.

## 39. Compatibilidad

Base: navegadores evergreen con módulos, App Router y `<dialog>`. Sin WebGL,
Clipboard, Web Share, storage, View Transitions o smooth scroll la experiencia
de contenido/navegación sigue disponible. Safari/Firefox/Edge reales no se
automatizaron en esta máquina y quedan como comprobación manual de publicación.

## 40. Responsive

Matriz automatizada 320, 375, 430, 768, 1024, 1440 y 1920 px: cero overflow
horizontal, un `h1`, menú móvil por debajo de 1024 y navegación desktop desde
1024. También se comprobó 375×844 en inglés y ficha sin overflow.

## 41. Lighthouse

Lighthouse no estaba instalado global ni localmente. No se añadió como dependencia
pesada. La verificación sustituta cubre artefacto raw/gzip/Brotli, FCP local, CLS,
long tasks, DOM, consola, red local, breakpoints y rutas. Puntuaciones Lighthouse:
**no disponibles; no inventadas**.

## 42. Tests

La suite pasa de 60 a 66 pruebas. Nuevos contratos: validación de ambos formularios,
payload cliente, permanencia de reveals en el árbol accesible, fallback Forced
Colors, alternates x-default y sintaxis del bootstrap de idioma. También se amplió
la elegibilidad de cursor.

## 43. Métricas finales

| Métrica | Final |
| --- | ---: |
| Páginas generadas | 70 |
| Export completo | 45.464.954 B |
| Home ES / EN HTML | 191.478 / 190.351 B |
| Ficha ES / EN 21 HTML | 86.171 / 85.277 B |
| JS home raw / gzip / Brotli | 946.063 / 294.197 / 256.843 B |
| JS ficha raw / gzip / Brotli | 892.380 / 281.179 / 245.591 B |
| CSS / fuentes / imágenes | 77.691 / 105.712 / 28.873.571 B |
| Pruebas | 66/66 |

Observación local final: FCP 128–132 ms, CLS 0 y cero long tasks en la captura.
La caché/sesión no permite compararla científicamente con el dato inicial.

## 44. Comparación

| Métrica | Inicial | Final | Diferencia |
| --- | ---: | ---: | ---: |
| Export completo | 46.365.511 | 45.464.954 | −900.557 B (−1,94 %) |
| Home ES HTML | 194.340 | 191.478 | −2.862 B (−1,47 %) |
| Ficha ES 21 HTML | 89.323 | 86.171 | −3.152 B (−3,53 %) |
| JS home raw | 1.030.867 | 946.063 | −84.804 B (−8,23 %) |
| JS home Brotli | 276.611 | 256.843 | −19.768 B (−7,15 %) |
| JS ficha Brotli | 245.397 | 245.591 | +194 B (+0,08 %) |
| Tests | 60 | 66 | +6 |

## 45. Pendiente

- Auditoría manual con NVDA/JAWS/VoiceOver.
- Lighthouse/CrUX desde CI o URL publicada, con condiciones controladas.
- Safari iOS, Firefox y Edge físicos.
- Traducción editorial inglesa completa del catálogo.
- Validar respuesta real de Web3Forms sin hacerlo durante esta auditoría.

## 46. Riesgos aceptados

- El `<html lang="es">` del archivo fuente EN se corrige mediante script temprano;
  resolverlo en HTML puro exige reorganizar el root layout y queda fuera del
  cambio seguro. Navegador y clientes con JS reciben `lang="en"` antes de hidratar.
- Three conserva un chunk diferido de ~531 KB raw por decisión artística Fase 10.
- La home sigue siendo larga y monta 12 tarjetas iniciales más narrativa.
- CSP necesita `'unsafe-inline'` por scripts/estilos generados por Next.
- La ficha usa `<dialog>` nativo y APIs evergreen, con degradación de contenido.

## 47. Recomendaciones de publicación

1. Ejecutar Lighthouse en preview de Cloudflare con móvil/desktop y guardar JSON.
2. Comprobar headers reales con `curl -I` tras publicar.
3. Recorrer ES/EN con NVDA y Safari iOS antes de marcar conformidad AA formal.
4. Vigilar CrUX/LCP/INP durante 28 días antes de cambiar más motion o imágenes.
5. Probar un envío de contacto y otro de licencia con datos autorizados.

Estas acciones son cierre operativo de Fase 11; no definen ni inician Fase 12.

## 48. Checklist final

- [x] Documentación y configuración leídas antes de editar.
- [x] Estado Git y commits previos revisados; `AGENTS.md` preservado.
- [x] Línea base registrada antes de cambios.
- [x] TypeScript, lint, 66 tests, build y diff check correctos.
- [x] 70 páginas estáticas y sitemap/robots válidos.
- [x] Bundle, HTML, assets y referencias locales medidos.
- [x] Teclado, overlays, reduced motion y Forced Colors comprobados.
- [x] Responsive 320–1920 y ES/EN comprobados.
- [x] Ciclo archivo → ficha → archivo restaura filtros, scroll y foco.
- [x] Consola sin errores en las rutas revisadas.
- [x] Sin push, deploy ni Pull Request.
- [ ] Lighthouse y lectores de pantalla reales, pendientes documentados.

## 49. Addendum de Fase 12 — sistema de producción

La Fase 12 revalidó la línea base y cerró el sistema reproducible de release. El
workflow anterior mezclaba npm, Cloudflare Pages y Node 20 con un repositorio
pnpm orientado a Workers; las ejecuciones remotas fallaban en `setup-node`. La
configuración final usa Node 22.22.2, pnpm 10.34.1, Wrangler 4.112.0 y Workers
Static Assets, con CI automática y producción manual.

La auditoría externa del dominio confirmó TLS y CDN activos, pero también dos
hechos que impiden declarar esta candidata publicada: la web visible pertenece a
una build antigua (robots apunta al dominio workers.dev) y HTTP responde `200`
sin redirección a HTTPS. Ambas comprobaciones deberán repetirse después de un
despliegue autorizado; “Always Use HTTPS” queda como acción manual de Cloudflare.

## 50. Evidencia de Fase 12

- Typecheck y lint correctos.
- 67/67 tests.
- 73 rutas estáticas, 70 HTML y 63 URLs en sitemap.
- `out/` de 40.983.236 bytes; `out/photos/raw` ausente.
- Wrangler dry-run correcto y 14 reglas `_headers` aceptadas.
- Preview local: ES/EN 200, 404 real, raw 404 y metadata correcta.
- Navegador: filtro con una coincidencia, fullscreen y foco restaurado, menú
  mobile, reduced motion y forced colors sin overflow ni imágenes rotas.
- Seis capturas WebP reales entregadas.
- Sin push, deploy, tag ni Pull Request.

## 51. Riesgos y pendientes operativos

- Configurar environment/secrets y validar una preview remota.
- Activar y comprobar HTTP → HTTPS.
- Revisar controles anti-spam/restricción de dominio en Web3Forms.
- Medir Web Vitals de campo y decidir monitorización tras publicar.
- Ejecutar smoke tests sobre el dominio y confirmar robots/sitemap nuevos.

El detalle y la separación entre checks completados y acciones externas están en
`RAW_VIVES_RELEASE_CHECKLIST.md` y `RAW_VIVES_RELEASE_SYSTEM.md`.
