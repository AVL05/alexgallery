# raw.vives - Home narrativa

## 1. Objetivo

La Fase 5 convierte la home en un recorrido editorial por el archivo sin reemplazar el hero, la galería completa, el sistema de datos ni las rutas existentes. La fotografía sigue siendo la materia principal y el movimiento solo ordena la lectura.

## 2. Narrativa

El recorrido parte de la identidad presentada por la intro y el hero, explica la intención del archivo, se detiene en una historia humana, abre la escala con una escena atmosférica, organiza el contenido en capítulos y termina ofreciendo el archivo completo y un cierre autoral.

## 3. Orden de secciones

1. Intro de sesión.
2. Hero cinematográfico existente.
3. Manifiesto (`#about`).
4. Historia destacada (`#featured-story`).
5. Fotografía expansiva (`#expansive-image`).
6. Capítulos visuales (`#visual-chapters`).
7. Trabajo seleccionado (`#selected-work`).
8. Índice del archivo (`#archive-index`).
9. Galería completa existente (`#gallery`).
10. Contacto existente (`#contact`).
11. Cierre narrativo (`#closing-statement`).
12. Footer existente.

## 4. Arquitectura

`HomeClient` continúa coordinando la página. `HomeNarrative` resuelve una vez los datos curados y compone módulos de sección sin asumir detalles de la galería. Los selectores viven en `lib/home/` y cruzan el catálogo editorial con `images-data.json` mediante el ID estable de cada fotografía.

## 5. Componentes

- `HomeNarrative`: composición y estados de previsualización en desarrollo.
- `HomeManifesto`: intención del archivo y autoría.
- `FeaturedStory`: fotografía, texto real y enlace a la ficha.
- `ExpansivePhoto`: única escena con scrub de esta fase.
- `VisualChapters`: categorías, recuentos y acceso al filtro existente.
- `SelectedWork`: selección fija de seis obras en una retícula editorial.
- `ArchiveIndex`: recuentos derivados del catálogo.
- `ClosingStatement`: cierre y enlaces al archivo y contacto.
- `NarrativeImage`: ratio conocido, placeholder, fallback y refresh de layout.
- `SectionMarker`: numeración accesible y consistente de `01 / 08` a `08 / 08`.

## 6. Datos

La fuente de verdad sigue siendo `lib/gallery-data.ts`. Las dimensiones, variantes y placeholders proceden de `lib/images-data.json`. No se han creado registros fotográficos alternativos ni datos EXIF ficticios.

## 7. Configuración curada

`lib/home/curation.ts` contiene `homeCuration`: ID de historia destacada, ID de fotografía expansiva, portada por categoría y seis IDs de trabajo seleccionado. `alternateHomeCuration` solo sirve para revisión interna en desarrollo.

- Historia destacada: 46, `El acordeón y el abismo`.
- Fotografía expansiva: 3, `El ruido del cielo`.
- Capítulos: 1, 6, 17, 44 y 41.
- Selected work: 5, 13, 21, 35, 49 y 51.

## 8. Manifiesto

El manifiesto sustituye la antigua sección visual `About`, conserva la presentación real de Alex Vicente y añade una declaración breve traducida. El ancla pública `#about` se mantiene.

## 9. Historia destacada

La sección usa la fotografía 46 y su título, descripción, categoría y año del catálogo. El enlace conduce a `/{locale}/photo/46`; no abre un modal ni inventa información adicional.

## 10. Fotografía expansiva

La fotografía 3 ocupa una escena de 145 svh en escritorio. Un contenedor sticky de CSS mantiene la imagen durante un tramo corto y GSAP interpola únicamente `transform: scale()` de 0.82 a 1. En touch y reduced motion la escena es estática y recupera el flujo normal.

## 11. Capítulos

Los capítulos corresponden a las cinco categorías reales: Fauna, Arquitectura, Paisaje, Retrato y Meteorología. Cada recuento se deriva del catálogo. En escritorio se actualiza una imagen contextual al pasar el puntero o enfocar; en móvil cada capítulo incluye su imagen. El enlace mantiene `#gallery` y emite una petición interna al filtro ya existente.

## 12. Selected work

Se muestran seis fotografías sin repetir la historia destacada ni la imagen expansiva. La retícula de 12 columnas alterna anchos y desplazamientos en escritorio; en móvil pasa a una sola columna. Cada marco usa las dimensiones reales, por lo que no depende de Masonry ni cambia de tamaño al cargar.

## 13. Índice

El índice calcula total, categorías, años activos y rango temporal mediante `getArchiveSummary()`. El CTA conduce a `#gallery`; la galería completa continúa siendo la experiencia de archivo de esta fase.

## 14. Cierre

El cierre aparece después de contacto y antes del footer. Resume el carácter abierto del archivo y ofrece enlaces semánticos al archivo y al contacto.

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

Todos los textos nuevos están bajo `home` en `dictionaries/es.json` y `dictionaries/en.json`. Los nombres de categoría reutilizan `gallery.categories`. Los títulos y descripciones fotográficas siguen el idioma único del catálogo, una limitación previa que no se duplica dentro del sistema narrativo.

## 23. Imágenes

`NarrativeImage` usa `next/image`, `fill`, `sizes`, placeholder blur cuando está disponible, ratio calculado con dimensiones reales y lazy loading por defecto. Al cargar solicita un refresh controlado de ScrollTrigger. Un error cambia a una fotografía local válida sin bloquear el contenido.

## 24. Rendimiento

No se han añadido dependencias, fuentes ni assets. Solo la imagen del hero mantiene prioridad; la narrativa carga de forma diferida. La animación nueva se limita a transform y a un trigger scrub. La selección de seis obras reduce el número de imágenes iniciales frente a una segunda galería completa.

## 25. Pruebas

`tests/home/home-narrative.test.ts` comprueba IDs reales, ausencia de duplicados, categorías, fallbacks, recuentos derivados y paridad de traducciones. La validación en navegador cubre filtros, reduced motion, menú, rutas, consola y overflow. No se añade una suite E2E nueva.

## 26. Cómo cambiar la selección

Editar exclusivamente `homeCuration` en `lib/home/curation.ts`. Usar IDs existentes en `lib/gallery-data.ts`, evitar repetir `featuredPhotoId` y `expansivePhotoId` dentro de `selectedPhotoIds`, y ejecutar `pnpm test`.

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

- ID curado ausente: primera fotografía válida, o primera de su categoría.
- Variante optimizada ausente: ruta original declarada en el catálogo.
- Imagen que falla en red: `/photos/optimized/800/1.webp`.
- Selección parcial: se completa con fotografías reales no reservadas.
- Categorías o selección vacías en preview: estado textual visible.

## 30. Riesgos

- El contenido editorial de las fotografías solo existe en español.
- La home completa es larga porque convive con las 30 imágenes del archivo.
- La galería sigue cargando su lightbox y Masonry en la ruta principal.
- Una categoría nueva exige actualizar el contrato curado de forma explícita.
- El watermark forma parte de algunas fotografías originales y no se modifica.

## 31. Preparación para la Fase 6

La Fase 6 puede evolucionar `#gallery` por separado: el índice, los capítulos y el evento de filtro ya ofrecen puntos de entrada estables. No debe duplicar la curación de home ni convertir `SelectedWork` en un segundo archivo completo.
