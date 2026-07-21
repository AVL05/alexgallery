# raw.vives - Home narrativa

## 1. Objetivo

La Fase 5 convierte la home en un recorrido editorial por el archivo sin reemplazar el hero, la galería completa, el sistema de datos ni las rutas existentes. La fotografía sigue siendo la materia principal y el movimiento solo ordena la lectura.

## 2. Narrativa

El recorrido parte de la identidad presentada por intro/hero, explica la intención del archivo, propone una historia humana, adelanta las series, abre la escala con una escena atmosférica y ofrece piezas individuales antes del archivo y el contacto.

## 3. Orden de secciones

1. Intro de sesión y hero cinematográfico.
2. Manifiesto (`#about`).
3. Historia destacada (`#featured-story`).
4. Series (`#series`).
5. Fotografía expansiva (`#expansive-image`).
6. Trabajo seleccionado (`#selected-work`).
7. Archivo (`#gallery`).
8. Contacto (`#contact`) y footer.

## 4. Arquitectura

`HomeClient` coordina intro, navegación, hero y footer. `HomeNarrative` resuelve una vez los datos curados y compone el orden de `homeExperienceConfig`, incluidos los slots de archivo/contacto. Los selectores viven en `lib/home/` y cruzan catálogo e `images-data.json` por ID estable.

## 5. Componentes

- `HomeNarrative`: composición y estados de previsualización en desarrollo.
- `HomeManifesto`: intención del archivo y autoría.
- `FeaturedStory`: fotografía, texto real y enlace a la ficha.
- `ExpansivePhoto`: única escena con scrub de esta fase.
- `VisualChapters`: referencia disponible, oculta del recorrido público por redundancia con filtros.
- `SelectedWork`: cuatro obras sin serie en una retícula editorial.
- `HomeSeries`: tres portadas; una destacada y dos compactas en móvil.
- `ClosingStatement`: referencia disponible, retirada del render por duplicar contacto/footer.
- `NarrativeImage`: ratio conocido, placeholder, fallback y refresh de layout.
- `SectionMarker`: numeración accesible y consistente de `01 / 08` a `08 / 08`.

## 6. Datos

La fuente de verdad sigue siendo `lib/gallery-data.ts`. Las dimensiones, variantes y placeholders proceden de `lib/images-data.json`. No se han creado registros fotográficos alternativos ni datos EXIF ficticios.

## 7. Configuración curada

`lib/home/curation.ts` contiene la única `homeCuration`: hero, historia destacada,
fotografía expansiva, portada por categoría y cuatro IDs de trabajo seleccionado.
`lib/home/validation.ts` bloquea IDs inexistentes, duplicados, conflictos,
categorías incorrectas y longitudes inválidas. `alternateHomeCuration` solo sirve
para revisión interna en desarrollo y cumple el mismo contrato.

- Hero: 14, imagen editorial reservada de Moher.
- Historia destacada: 46, `El acordeón y el abismo`.
- Fotografía expansiva: 3, `El ruido del cielo`.
- Capítulos: 7, 48, 30, 44 y 41.
- Selected Work: 1, 35, 37 y 49.
- Series: portadas 21, 17 y 5, configuradas por el sistema de series.

## 8. Manifiesto

El manifiesto sustituye la antigua sección visual `About`, conserva la presentación real de Alex Vicente y añade una declaración breve traducida. El ancla pública `#about` se mantiene.

## 9. Historia destacada

La sección usa la fotografía 46 y su título, descripción, categoría y año del catálogo. El enlace conduce a `/{locale}/photo/46`; no abre un modal ni inventa información adicional.

## 10. Fotografía expansiva

La fotografía 3 ocupa una escena de 145 svh en escritorio. Un contenedor sticky de CSS mantiene la imagen durante un tramo corto y GSAP interpola únicamente `transform: scale()` de 0.82 a 1. En touch y reduced motion la escena es estática y recupera el flujo normal.

## 11. Capítulos

El componente de capítulos corresponde a las cinco categorías reales: Fauna, Arquitectura,
Paisaje, Personas y Meteorología. Cada recuento se deriva del catálogo. En
escritorio se actualiza una imagen contextual al pasar el puntero o enfocar; en
móvil cada capítulo incluye su imagen. El enlace mantiene `#gallery` y emite una
petición interna al filtro ya existente. El slug histórico `retrato` permanece
estable para URLs de Personas. Desde Fase 13.4 no forma parte de `sectionOrder`: el archivo ya ofrece esas cinco entradas con filtros completos.

## 12. Selected work

Se muestran cuatro fotografías sin repetir hero, historia, expansiva ni portadas de serie.
La secuencia `1, 35, 37, 49` alterna H/V/C/H y cubre 2022–2025. La
retícula de 12 columnas alterna anchos y desplazamientos en escritorio; en móvil
pasa a una sola columna. Cada marco usa dimensiones reales.

## 13. Series y archivo

Tres portadas enlazan al índice/rutas de serie. Después de la expansiva y Selected Work, `#gallery` cambia de narrativa a exploración libre con las 30 fotografías. No se añade una preview ni una ruta nueva de archivo.

## 14. Cierre

Contacto funciona como cierre. `ClosingStatement` deja de renderizarse porque archivo y contacto ya han aparecido y el footer conserva todas sus salidas útiles.

## 15. Animaciones

Las entradas reutilizan `Reveal` y `StaggerGroup`. Los enlaces e imágenes usan transiciones CSS existentes. No se añaden timelines globales, parallax, blur, scroll horizontal ni transiciones de ruta.

## 16. ScrollTrigger

`ExpansivePhoto` crea un único ScrollTrigger scoped. Se registra mediante `lib/motion/gsap.ts`, se revierte con `useGSAP`, retira `will-change` y nunca elimina triggers ajenos. El resto de entradas usa las primitivas de la Fase 2.

## 17. Lenis

No existe una segunda instancia ni un bucle adicional. La home utiliza la instancia global de `MotionProvider`; touch y reduced motion conservan el comportamiento definido por ese provider.

## 18. Responsive

Los layouts parten de una columna y progresan a retículas de 12 columnas. Se han validado 320, 375, 430, 768, 1024, 1280, 1440 y 1920 px sin overflow horizontal. Los títulos usan escalas fluidas y los marcos conservan su ratio.

## 19. Mobile

No hay sticky narrativo, scrub ni dependencia de hover. Los capítulos muestran la imagen en el propio enlace, los enlaces conservan áreas táctiles amplias y el contenido mantiene un orden lineal comprensible.

## 20. Reduced motion

`ExpansivePhoto` no crea su tween cuando el sistema solicita reducción de movimiento. Las primitivas existentes limpian opacidad y transform para mostrar el contenido inmediatamente, y Lenis permanece desactivado.

## 21. Accesibilidad

El hero conserva el único `h1`; cada módulo narrativo usa `h2` y las obras `h3`. Los enlaces son enlaces reales, las imágenes conservan la descripción del catálogo como texto alternativo, los marcadores de capítulo tienen nombre accesible y el filtro funciona con foco y teclado.

## 22. Internacionalización

Todos los textos de interfaz están bajo `home` en ambos diccionarios. Los nombres
de categoría reutilizan `gallery.categories`. Títulos, descripciones y alt se
resuelven por locale mediante `getLocalizedPhotoContent()`; la home inglesa no
consume campos editoriales españoles hardcodeados.

## 23. Imágenes

`NarrativeImage` usa `next/image`, `fill`, `sizes`, placeholder blur cuando está disponible, ratio calculado con dimensiones reales y lazy loading por defecto. Al cargar solicita un refresh controlado de ScrollTrigger. Un error cambia a una fotografía local válida sin bloquear el contenido.

## 24. Rendimiento

No se han añadido dependencias, fuentes, assets, preloads ni motion. Solo el hero
mantiene prioridad; narrativa e índice cargan de forma diferida. Selected Work
baja de seis a cinco y el índice añade una miniatura: el total de imágenes antes
del archivo no aumenta.

## 25. Pruebas

`tests/home/home-narrative.test.ts` comprueba IDs, hero exclusivo, capítulos,
Selected Work, máximo de apariciones, 14 obras únicas, categorías, orden,
fallback, ES/EN, alt y taxonomía. La aserción se ejecuta también al resolver la
home durante desarrollo/build. No se añade una suite E2E nueva.

## 26. Cómo cambiar la selección

Editar exclusivamente `homeCuration` en `lib/home/curation.ts`. Usar IDs
existentes, respetar categoría de capítulos y no repetir ningún rol. Ejecutar
`pnpm test`; el mensaje de validación identifica ID y secciones en conflicto.

## 27. Cómo añadir un capítulo

1. Añadir la categoría al contrato `PhotoCategory` y al catálogo.
2. Añadirla a `categories` y a ambos diccionarios.
3. Incluirla en `homeChapterOrder` y `chapterPhotoIds`.
4. Añadir su descripción traducida.
5. Comprobar el filtro y los tests.

La categoría `Virtual` permanece fuera de la narrativa porque no tiene fotografías publicadas en el catálogo actual.

## 28. Cómo modificar el orden

El orden de capítulos se controla en `homeChapterOrder`. El orden global de secciones se controla de forma explícita en `HomeClient` y `HomeNarrative`. Si se cambia, actualizar también la numeración de `SectionMarker` y este documento.

## 29. Fallbacks

- ID curado ausente o categoría incorrecta: error explícito de validación.
- Variante optimizada ausente: ruta original declarada en el catálogo.
- Imagen que falla en red: `/photos/optimized/800/1.webp`.
- Recurso fallido: fallback local existente sin cambiar la selección editorial.
- Categorías o selección vacías en preview: estado textual visible.

## 30. Riesgos

- La home completa es larga porque convive con las 30 imágenes del archivo.
- La galería sigue cargando su lightbox y Masonry en la ruta principal.
- Una categoría nueva exige actualizar el contrato curado de forma explícita.
- Personas y Meteorología solo disponen de dos obras cada una.
- El watermark forma parte de algunas fotografías originales y no se modifica.

## 31. Preparación para la Fase 6

La Fase 6 puede evolucionar `#gallery` por separado: el índice, los capítulos y el evento de filtro ya ofrecen puntos de entrada estables. No debe duplicar la curación de home ni convertir `SelectedWork` en un segundo archivo completo.

## 32. Integración completada por la Fase 6

Los capítulos enlazan ahora a URLs compartibles como
`/{locale}?category=fauna#gallery` y conservan el evento cliente para respuesta
inmediata. El índice, hero, cierre y navegación mantienen `#gallery`. El selector
de idioma conserva parámetros y hash. La curación de home no se duplica dentro
del nuevo archivo; sus reglas viven en `RAW_VIVES_ARCHIVE_SYSTEM.md`.

## 33. Decisión de integración de la Fase 8

La auditoría no encontró comparativas auténticas: `featuredPhotoId` permanece
`null` y la home no añade `THE PROCESS`, imágenes ni JavaScript de interacción.
Cuando exista al menos un caso validado podrá insertarse una única pieza diferida
entre narrativa y archivo, sin tutorial, nuevo storytelling ni varios sliders.

## 34. Interacción selectiva de la Fase 9

Capítulos e índice anuncian `EXPLORE`; Selected Work, historia y fotografía
expansiva anuncian `VIEW`. El CTA del hero es el único control narrativo magnético.
Hover y foco comparten escala/brillo/título, y el cierre distingue archivo de
contacto. No se añaden previews, listeners por pieza ni seguimiento de imagen.

## 35. Motion fotográfica de la Fase 13.2

Hero mantiene su lenguaje propio; Featured Story usa una timeline `mask-side`;
la expansiva amplía su único scrub; capítulos usan un escenario cancelable de dos
capas; Selected Work elige variante por ratio y el índice reutiliza `soft-scale`.
Las fotografías son visibles antes de GSAP y reduced motion muestra el estado
final. Véase `RAW_VIVES_PHOTO_MOTION_SYSTEM.md`.

## 36. Continuidad mediante series en la Fase 13.3

El antiguo índice visual de una sola fotografía se sustituye por tres portadas
compactas de series. No se alarga la home con una sección adicional: cambia la
función del mismo tramo final. Las portadas son 21, 17 y 5; nunca reutilizan el
hero 14. La 21 mantiene una segunda aparición pequeña y funcional tras Selected
Work. El recorrido queda en 15 fotografías únicas y enlaza a rutas reales ES/EN.

## 37. Edición del recorrido en la Fase 13.4

`lib/home/experience.ts` centraliza orden, secciones obligatorias/ocultas, límite de Selected Work, serie destacada, preview y prefetch. Series se adelanta, capítulos y cierre salen del render, y Selected Work queda en cuatro obras sin serie. Antes del archivo pasan a existir 10 fotografías únicas; la home baja a ocho secciones públicas y 17 ScrollTriggers. La auditoría y métricas completas viven en `RAW_VIVES_EXPERIENCE_FLOW_SYSTEM.md`.
Véase `RAW_VIVES_PHOTO_SERIES_SYSTEM.md`.
