# RAW.VIVES — Sistema de recorrido editorial

## 1. Objetivo

La Fase 13.4 edita el recorrido existente para que home, series, archivo y detalle formen un sistema continuo sin añadir fotografías, rutas principales, efectos o dependencias. La prioridad es llegar antes a una decisión útil y conservar tanto una lectura rápida como una exploración profunda.

## 2. Estado anterior

La home encadenaba hero, manifiesto, historia, expansiva, capítulos, cinco obras seleccionadas, tres series, el archivo, contacto y un cierre. En 1280 × 720 medía 16.628 px (23,1 viewports); en 390 × 844, 20.288 px (24,0 viewports). El archivo comenzaba a 9.764 px en desktop y 10.584 px en móvil. Antes del archivo había 17 elementos `img`, 15 fotografías únicas y 20 ScrollTriggers.

## 3. Mapa de recorridos

| Recorrido | Entrada | Primera acción | Continuidad | Retorno |
| --- | --- | --- | --- | --- |
| A · rápido | home | serie, historia o Selected Work | fotografía individual | home o contexto guardado |
| B · profundo | home / índice de series | portada de serie | secuencia, ficha y siguiente serie | ancla de la fotografía en la serie |
| C · específico | header / CTA de hero | `#gallery` | filtros y detalle | estado, scroll y foco del archivo |
| D · directo | URL de fotografía | serie, siguiente o relacionadas | archivo global como fallback | URL limpia y navegación nativa |
| E · portfolio | home | manifiesto y trabajo | contacto, Instagram o aleviclop.dev | header y footer persistentes |

## 4. Puntos de abandono potenciales

- Series aparecía después de 7.891 px en desktop y 8.832 px en móvil: demasiado tarde para ser una promesa narrativa.
- Capítulos repetía el cambio de modo que ya ofrecen los filtros del archivo y añadía 2.782 px en móvil.
- Selected Work compartía la portada 21 con series y competía con ellas como segundo grid extenso.
- Series ofrecía dos CTAs finales equivalentes; el segundo volvía a apuntar al archivo.
- Contacto terminaba en otro cierre de 635/629 px que repetía archivo y contacto.
- Políticas ocupaba navegación principal pese a estar ya disponible en footer.

## 5. Orden anterior

`hero → manifesto → featuredStory → expansivePhoto → visualChapters → selectedWork → series → archive → contact → closing`

## 6. Orden final

`hero → manifesto → featuredStory → series → expansivePhoto → selectedWork → archive → contact → footer`

`homeExperienceConfig.sectionOrder` es la fuente única. Hero permanece primero por su coordinación con intro/LCP; `HomeNarrative` compone el resto y recibe archivo/contacto como slots para mantener una sola resolución de datos y un DOM con orden real.

## 7. Secciones mantenidas

Hero, manifiesto, historia destacada, las tres series, expansiva, Selected Work, archivo, contacto y footer conservan su responsabilidad. La configuración valida hero primero, secciones obligatorias, duplicados y serie destacada publicada.

## 8. Secciones reducidas

Selected Work pasa de cinco a cuatro fotografías. Series mantiene tres portadas, pero la primera es la entrada destacada y las dos siguientes son compactas en móvil. Se elimina el segundo CTA de series. La navegación principal pasa de cinco destinos internos a cuatro.

## 9. Secciones eliminadas

`visualChapters` y `closing` dejan de formar parte del recorrido público, pero sus componentes no se borran: quedan disponibles para referencia/desarrollo y están declarados como ocultos en la configuración. Los enlaces útiles del cierre ya existen en archivo, contacto y footer. Los capítulos no eran una ruta independiente y duplicaban las categorías del archivo.

## 10. Jerarquía de CTAs

Se cuentan como CTAs de continuidad los enlaces explícitos de sección, no tarjetas, filtros, navegación, footer ni controles de formulario. Pasan de 10 instancias / 9 textos distintos a 7 / 7. Cada sección conserva como máximo un CTA principal: hero → archivo, historia/expansiva → fotografía, series → índice completo. El archivo mantiene solo sus controles funcionales y “Volver al inicio”.

## 11. Vocabulario

- ES: `Explorar el archivo`, `Ver fotografía`, `Abrir fotografía`, `Ver todas las series`.
- EN: `Explore the archive`, `View photograph`, `Open photograph`, `View all series`.

Se eliminan `Abrir imagen`, `Explorar series` y el segundo `Abrir archivo` de la sección de series. Los títulos de tarjetas siguen siendo enlaces descriptivos, no botones genéricos.

## 12. Ritmo

La densidad final alterna alta (hero), pausa (manifiesto), media-alta (historia), media (series), alta (expansiva), media-alta (Selected Work), exploración libre (archivo) y baja (contacto). El cambio de fondos, las líneas superiores, la numeración y la siguiente fotografía crean continuidad sin nuevas animaciones.

## 13. Series

Las tres series públicas siguen visibles en el orden `porto-river-night`, `atlantic-stone`, `small-encounters`. La primera se controla con `featuredSeriesId`; las demás se muestran como entradas compactas en móvil. Solo la primera conserva prefetch. No se cargan secuencias desde la home.

## 14. Selected Work

IDs finales: `1, 35, 37, 49`. Todos están fuera de series publicadas, no son portadas, conservan el ritmo horizontal → vertical → cuadrada → horizontal y enlazan directamente a sus fichas. La validación admite tres o cuatro obras y aplica el límite central de cuatro.

## 15. Archivo

No existe una ruta independiente de archivo en la arquitectura previa. Crear `/archive` habría infringido el límite de no añadir rutas principales; por ello se conserva `/{locale}#gallery` como destino directo, accesible desde header, hero, footer, series y detalle. El archivo sigue teniendo descripción, 30 fotografías, filtros, orden, búsqueda, carga progresiva y restauración contextual. `showArchivePreview: false` evita añadir otra preview antes del archivo real.

## 16. Contacto

Contacto queda como cierre editorial y funcional: identifica al autor, ofrece mensaje/licencia, email, Instagram, ubicación y privacidad. Se retira `ClosingStatement` del render porque duplicaba su acción y el footer ya ofrece archivo, series y aleviclop.dev.

## 17. Footer

Mantiene raw.vives, archivo, about, series, contacto, políticas, privacidad, Instagram, aleviclop.dev, email, idioma, año y derechos. Los enlaces legales se conservan aquí y salen del header. No se añadió copy ni recuentos.

## 18. Navegación

El orden principal es `Archivo → Series → Sobre mí/About → Contacto/Contact`, seguido de aleviclop.dev e idioma. El logo sigue siendo Inicio. En rutas internas, las anclas se convierten en `/{locale}#...`; las series mantienen ruta real. El menú móvil conserva un solo nivel y targets de 44 px.

## 19. Prefetch

Se mantiene el prefetch global de Next. Se permite en el índice de series, la serie destacada, siguiente serie y navegación anterior/siguiente. Se desactiva en portadas secundarias de home, Selected Work, tarjetas del archivo, fotografías dentro de una secuencia y todas menos la primera relacionada. Los destinos predecidos al cargar home pasan de tres (home, series, políticas) a dos (home y series); las transacciones internas de RSC pueden agruparse o duplicarse según el servidor estático.

## 20. Motion

No se crean variantes. Hero, Featured Story, expansiva, series, Selected Work y archivo reutilizan Fase 13.2. Al retirar capítulos y cierre, la medición real de home baja de 20 a 17 ScrollTriggers. El listener global delegado permanece 1; archivo conserva un único IntersectionObserver y el canvas hero otro observer de visibilidad.

## 21. Mobile

En 390 × 844 la home baja de 20.288 a 16.115 px, de 24,0 a 19,1 viewports. Series aparece en 2.754 px (~3,3 viewports) frente a 8.832 (~10,5), y archivo en 6.950 (~8,2) frente a 10.584 (~12,5). Las dos series secundarias usan imagen y metadata en una fila compacta; no hay overflow horizontal en 320, 360, 390, 430 ni horizontal móvil.

## 22. Desktop

En 1280 × 720 la home baja de 16.628 a 13.626 px, de 23,1 a 18,9 viewports. Series aparece a 2.618 px (~3,6 viewports) frente a 7.891 (~11,0); archivo, a 7.397 (~10,3) frente a 9.764 (~13,6). También se verifican 1440 × 900, 1920 × 1080 y 2560 × 1440 sin overflow.

## 23. Accesibilidad

El export mantiene un único `h1`, headings en orden, alt localizado, links reales, focus-visible, DOM narrativo, touch targets, zoom y reduced motion. El CTA del hero llega a `#gallery` con el encabezado visible. Fullscreen abre un `dialog`, enfoca cerrar y desaparece tras el cierre. En reduced motion no hay canvas ni fotografías ocultas.

## 24. SEO

La home conserva descripción, autoría, manifiesto, historia, enlaces a tres series, cuatro fotografías y las 30 obras del archivo. Canonical, ES/EN/x-default, JSON-LD, sitemap de 71 URLs y las 81 páginas estáticas no cambian. No se añade texto invisible ni una ruta duplicada.

## 25. Rendimiento

Una sola imagen hero mantiene prioridad; el resto continúa lazy. El HTML ES baja de 200.464 a 175.077 bytes (-12,7 %). El JS bruto inicial pasa de 967.498 a 968.396 bytes (+898 bytes, +0,09 %), debido a configuración/validación central. En carga fría local del export: 66 requests se mantienen, imágenes bajan 23 → 22 y transferencia 1.965.460 → 1.923.929 bytes (-2,1 %). No hay dependencias, preloads o RAF nuevos.

## 26. Métricas comparativas

| Métrica | Antes | Después |
| --- | ---: | ---: |
| Secciones públicas de home | 10 | 8 |
| `img` montados en home | 29 | 22 |
| URLs de imagen únicas montadas | 22 | 18 |
| Fotografías antes del archivo | 17 | 10 |
| Fotografías únicas antes del archivo | 15 | 10 |
| CTAs de continuidad | 10 / 9 textos | 7 / 7 textos |
| 390 × 844 | 24,0 vp | 19,1 vp |
| 1280 × 720 | 23,1 vp | 18,9 vp |
| Archivo, 390 px | 12,5 vp | 8,2 vp |
| Archivo, 1280 px | 13,6 vp | 10,3 vp |
| Tiempo estimado hasta archivo móvil a 900 px/s | 11,8 s | 7,7 s |
| Tiempo estimado hasta archivo desktop a 900 px/s | 10,8 s | 8,2 s |
| Requests fríos | 66 | 66 |
| Transferencia fría | 1.965.460 B | 1.923.929 B |
| JS bruto referenciado | 967.498 B | 968.396 B |
| Destinos de prefetch inicial | 3 | 2 |
| ScrollTriggers | 20 | 17 |
| Listener global de cursor | 1 | 1 |
| Observers propios de home | 2 | 2 |
| Errores de consola | 0 | 0 |

Las alturas incluyen las 12 tarjetas iniciales del archivo. Los tiempos son una comparación reproducible por distancia/900 px por segundo, no datos de usuarios.

## 27. Tests

`tests/home/home-experience.test.ts` cubre orden, obligatorias, ocultas, ausencia de duplicados, Selected Work sin serie, las tres series, CTAs ES/EN, anclas/rutas públicas, legales en footer y prefetch selectivo. La suite existente se adapta al límite de cuatro obras y mantiene curación, i18n, accesibilidad, motion, archivo, detalle, series, sitemap y producción.

## 28. Cómo cambiar el orden

Editar solo `homeExperienceConfig.sectionOrder`. No repetir IDs, no mover hero del primer lugar y conservar las obligatorias. `getHomeSectionPosition` actualiza la numeración visible. Ejecutar tests y revisar ES/EN, móvil y el punto de entrada al archivo.

## 29. Cómo reducir una sección

Primero reducir el límite/configuración o compactar su presentación responsive. No ocultar contenido con CSS si debe desaparecer del recorrido: retirarlo de `sectionOrder`. Conservar sus enlaces necesarios en navegación/footer y documentar el cambio.

## 30. Cómo añadir un CTA

Usar un destino real y una etiqueta específica localizada. Añadir como máximo un CTA principal por sección; las tarjetas pueden ser enlaces de contenido. Definir conscientemente su prefetch y comprobar modificadores/nueva pestaña cuando corresponda.

## 31. Riesgos

- El archivo sigue dentro de la home porque no existe ruta previa y la fase prohíbe crearla; es todavía el bloque más largo.
- Ocultar capítulos reduce una entrada visual por categoría, compensada por filtros completos y enlaces de archivo.
- El HTML conserva el `noscript` completo del archivo por progressive enhancement, aunque su peso haya bajado.
- El prefetch de Next puede emitir varias peticiones RSC por un único destino; se debe medir por destinos además de transacciones.

## 32. Recomendaciones posteriores

Medir con analítica existente o pruebas de usuario los eventos `hero_archive`, `series_open`, `selected_open`, `archive_photo_open`, `context_return` y `contact_start`; no se añade proveedor en esta fase. Si en el futuro se autoriza una ruta de archivo independiente, migrar `#gallery` preservando redirecciones/contexto antes de retirar el grid de la home. No añadir otra fase ni nuevos efectos como sustituto de esa decisión de arquitectura.
