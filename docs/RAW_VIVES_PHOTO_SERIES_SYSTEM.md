# RAW.VIVES — Sistema de series fotográficas

## 1. Objetivo

Fase 13.3 conecta fotografías reales en secuencias editoriales breves sin alterar el catálogo de 30 obras. Las series crean continuidad entre home, índice, detalle y archivo, conservan URLs directas y reutilizan el motion de Fase 13.2.

## 2. Auditoría

Se revisaron los 30 registros, las traducciones, años, categorías, descripciones, ratios, color dominante y metadata disponible. El EXIF publicado no contiene fechas ni localizaciones utilizables, por lo que solo se considera confirmada una relación geográfica cuando el texto editorial existente la declara. Se descartaron grupos genéricos por categoría y fenómenos con menos de tres fotografías.

| Candidato | Evidencia | Decisión |
| --- | --- | --- |
| Oporto 2024 | Cinco descripciones nombran Oporto y comparten año | Serie por localización confirmada |
| Costa e Irlanda 2025 | Acantilados, Moher y arquitectura irlandesa constan en el contenido | Serie por afinidad editorial; no se afirma una sesión |
| Fauna cercana 2025 | Escala, vegetación y observación próxima coinciden | Serie por afinidad visual; no se afirma lugar ni jornada |
| Rayos y tormenta | Solo dos fotografías defendibles | Rechazado por tamaño mínimo |
| Arquitectura general | Categoría demasiado amplia | Rechazado |

## 3. Criterios de agrupación

`confirmed-location` exige una localización explícita y coincidente. `editorial-affinity` admite una relación visual respaldada por títulos, descripciones o motivos reales, pero su texto debe negar cualquier sesión, fecha concreta o localización no verificable. Una fotografía pertenece como máximo a una serie pública.

## 4. Series creadas

| Serie | Criterio | Portada | Fotografías |
| --- | --- | --- | --- |
| Oporto, del río a la noche | Localización Oporto y archivo 2024 | 21 — Última parada: la noche | 21, 19, 26, 27, 24 |
| Piedra atlántica | Afinidad editorial documentada, no sesión única | 17 — Guardianes del acantilado | 17, 16, 46, 51 |
| Pequeños encuentros | Afinidad de escala y atención, no lugar compartido | 5 — Banquete en el bosque | 5, 11, 12 |

Hay 12 fotografías asignadas y 18 sin serie. Las no asignadas mantienen archivo, detalle y navegación global intactos.

## 5. Modelo

`PhotoSeries` guarda ID, slug, textos ES/EN, portada, orden de IDs, periodo opcional, localización opcional, criterio, estado y bloques editoriales. No duplica objetos fotográficos ni traducciones de fotografías.

## 6. Configuración

`lib/series/config.ts` es la única fuente de relaciones. `photoIds` define el orden público; `blocks` repite exactamente ese orden para declarar `single` o `diptych`. `published` entra en rutas, sitemap e interfaces; `draft` queda fuera.

## 7. Validaciones

`validatePhotoSeries` detecta IDs y slugs repetidos, slug inválido, textos incompletos, menos de tres obras, portada ausente o externa, fotografías inexistentes o duplicadas, pertenencia múltiple y bloques incoherentes. `assertValidPhotoSeries` se ejecuta al construir las rutas y el sitemap; los tests ejercitan mensajes de error.

## 8. Traducciones

Títulos y descripciones de serie son manuales en ES/EN. La interfaz está en los diccionarios y las fotografías reutilizan título, descripción y alt localizados del catálogo. El slug no cambia entre idiomas y el fallback editorial es español.

## 9. Rutas

Existen `/es/series`, `/en/series` y una ruta estática por slug e idioma. `generateStaticParams` solo publica series válidas; `dynamicParams = false` y `notFound()` resuelven el 404. Las páginas no dependen de navegación previa ni reproducen la intro global.

## 10. Índice

Se crea el índice porque hay tres series publicadas. Presenta una portada, título, periodo real, número de fotografías, descripción y enlace. Es un índice de historias, no un segundo archivo ni un filtro fotográfico.

## 11. Página de serie

La página contiene un único `h1`, cabecera editorial, descripción, periodo/localización cuando existen, portada prioritaria, secuencia, progreso, cierre, retorno, archivo y siguiente serie. Cada imagen abre su ficha individual mediante un enlace real.

## 12. Orden narrativo

- Oporto: noche urbana como apertura, puente y río como contexto, díptico de torre/cielo como desarrollo, detalle arquitectónico como cierre.
- Piedra atlántica: acantilado de apertura, díptico de hito natural y presencia humana, arquitectura irlandesa como cierre pausado.
- Pequeños encuentros: contexto terrestre de apertura y díptico final de alas entre vegetación.

El orden nunca se deriva del ID ni de una fecha inexistente.

## 13. Layout

El DOM es una secuencia vertical. Los bloques simples alternan anchos máximos controlados; no hay masonry, aleatoriedad, canvas, pinning ni scroll horizontal. Se reservan dimensiones mediante `aspect-ratio` y `next/image`.

## 14. Dípticos

Los dípticos están declarados manualmente: 26/27, 16/46 y 11/12. En escritorio usan dos columnas y en móvil conservan el mismo orden apilado. Cada figura conserva enlace, `figcaption` y alt propio.

## 15. Motion

La portada usa el reveal editorial existente. La secuencia usa `PhotoMotionGroup` y la selección determinista de Fase 13.2: vertical `mask-up`, horizontal `mask-side`, cuadrada `soft-scale`. Hay un grupo para la portada y uno para la secuencia, sin ScrollTrigger ni scrub por fotografía. Reduced motion y fallos de JavaScript dejan todo visible.

## 16. Progreso

Un único `IntersectionObserver` actualiza el texto visual `03 / 06` directamente en el DOM, sin render por frame. La etiqueta accesible permanece estable y los cambios visuales llevan `aria-hidden`, evitando anuncios continuos. Se oculta en pantallas muy estrechas.

## 17. Contexto

La ficha acepta únicamente `?series=<slug>`. El slug debe estar publicado y contener la fotografía actual. Nunca se serializa la lista de IDs. Un parámetro inválido se elimina y degrada al contexto existente.

## 18. Navegación

Prioridad: serie válida, archivo válido, orden editorial global. En contexto de serie, anterior/siguiente respetan límites sin circularidad, el índice muestra la posición de serie y volver apunta al ancla `#series-photo-ID`. La ficha directa conserva el comportamiento de Fase 7.

## 19. Integración con detalle

Las fotografías asignadas muestran “Parte de la serie”, título localizado, posición y enlace completo. Las no asignadas no muestran el bloque. La cabecera y el enlace de retorno distinguen serie, archivo y archivo global sin duplicar metadata.

## 20. Integración con home

La sección compacta de tres portadas sustituye el antiguo índice visual de una fotografía; no se añade una nueva sección al recorrido. Usa portadas 21, 17 y 5, nunca el hero 14. La portada 21 repite una aparición pequeña de Selected Work; el total narrativo queda en 15 fotografías únicas.

## 21. Integración con archivo

Cada tarjeta asignada muestra una referencia discreta `Serie / título`. No se añade filtro porque solo existen tres valores y la prioridad continúa siendo explorar fotografías. No hay listeners, observers ni cargas adicionales por tarjeta.

## 22. Related Photos

La selección reserva como máximo una fotografía de la misma serie y completa con categoría, año y proximidad editorial fuera de esa serie. Excluye actual, evita duplicados y es determinista; así aporta continuidad sin repetir anterior/siguiente.

## 23. Siguiente serie

El orden de `photoSeries` define la continuación. Se toma la siguiente publicada de forma determinista y localizada; con una sola serie no se renderizaría el bloque. Solo se carga su miniatura en lazy.

## 24. SEO

Índice y detalle tienen título, descripción, canonical, hreflang ES/EN/x-default, Open Graph y Twitter. La portada real alimenta la imagen social. El JSON-LD usa `CollectionPage`, `CreativeWorkSeries`, `ImageObject` y `BreadcrumbList` con URLs absolutas y sin fechas inventadas.

## 25. Sitemap

Incluye dos índices y seis detalles de series. Solo usa series publicadas, nunca query strings, borradores ni rutas internas. Las alternates son simétricas ES/EN.

## 26. Rendimiento

Solo la portada de una serie es prioritaria; secuencia y siguiente serie son lazy, con `sizes`, dimensiones reservadas y recursos optimizados existentes. Home carga tres portadas, no secuencias. No se añaden dependencias, RAF, ScrollTriggers ni listeners por tarjeta; cada página de serie crea un solo observer de progreso.

## 27. Accesibilidad

Un `h1`, headings jerárquicos, figuras, captions, alt localizado, enlaces descriptivos, foco visible y orden DOM preservado. Los anclajes de retorno son enfocables programáticamente. No hay traps, autoplay, información exclusiva de hover ni anuncios continuos del progreso.

## 28. Mobile

La secuencia es vertical, los dípticos se apilan, el progreso se oculta bajo `sm`, no hay sticky largo ni hover necesario. Las fotografías mantienen gran tamaño, targets existentes y ausencia de overflow horizontal.

## 29. Progressive enhancement

El HTML contiene la serie completa y enlaces reales. Sin JavaScript desaparecen únicamente la actualización de progreso y el contexto puede degradarse a navegación global; contenido, orden, retorno y fichas continúan disponibles.

## 30. Tests

La suite cubre configuración, IDs, slugs, traducciones, portada, orden, duplicados, bloques, dípticos, pertenencia, posición, extremos, contexto válido/inválido, fallback, relacionadas, siguiente, sitemap, rutas/404, metadata, home, archivo, detalle y ausencia de ScrollTrigger.

## 31. Cómo crear una serie

Añadir una entrada a `photoSeries`, elegir de tres a ocho IDs existentes, escribir textos ES/EN basados en evidencia, elegir portada incluida, declarar criterio/estado/bloques y ejecutar `pnpm test` y `pnpm build`. No publicar afinidades que sugieran una sesión no confirmada.

## 32. Cómo cambiar el orden

Modificar `photoIds` y reproducir exactamente el nuevo orden en `blocks`. Revisar apertura, pausa, variación y cierre en ES/EN y móvil. La validación rechaza cualquier divergencia.

## 33. Cómo añadir una fotografía

Usar solo un ID ya presente en el catálogo, confirmar que no pertenece a otra serie, actualizar orden y bloques, revisar alt/traducción/ratio y validar la navegación de sus vecinos.

## 34. Cómo retirar una serie

Cambiar a `draft` para retirarla de índice, rutas generadas, sitemap y asociaciones públicas. Antes de eliminarla definitivamente, comprobar enlaces externos; el slug debe considerarse estable.

## 35. Riesgos

- El catálogo no publica EXIF geográfico: nuevas relaciones requieren evidencia editorial explícita.
- Una portada compartida con home puede alterar la curación si cambia Selected Work.
- El hash restaura foco y posición, pero el scroll exacto depende de la restauración nativa y del navegador.
- Más series podrían justificar un filtro futuro; con tres sería ruido.

## 36. Preparación para Fase 13.4

La siguiente fase puede consumir helpers y contexto sin modificar este modelo. No se han adelantado funciones de Fase 13.4. Antes de ampliar, conviene observar navegación real, uso de series y estabilidad del retorno en producción.

## 37. Integración del recorrido en la Fase 13.4

Las tres series pasan a la cuarta posición de la home. `porto-river-night` es la entrada destacada; las otras dos se compactan en móvil y desactivan prefetch. La portada 21 sale de Selected Work, por lo que series y piezas individuales ya no compiten ni duplican protagonistas. El CTA único de la sección es `Ver todas las series` / `View all series`.
