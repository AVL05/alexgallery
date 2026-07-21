# Sistema de detalle fotográfico de RAW.VIVES

Referencia de la Fase 7 para `/{locale}/photo/{id}`. La ficha convierte cada
fotografía en una pieza editorial autónoma sin romper el archivo, la exportación
estática ni las rutas públicas. Comparador RAW/final, cursor y WebGL quedan fuera.

## 1. Objetivo

Publicar 30 obras en ES/EN con imagen protagonista, lectura editorial,
navegación contextual, SEO y fallbacks deterministas.

## 2. Auditoría del detalle anterior

Era un Server Component monolítico con texto fotográfico solo en español,
navegación global circular y retorno fijo a `#gallery`. No tenía fullscreen,
relacionadas ni canonical/alternates específicos. Las 30 imágenes tenían
dimensiones; ninguna contiene EXIF público útil actualmente.

## 3. Arquitectura

La ruta genera SSG, metadata y JSON-LD. `components/photo-detail/` compone la
experiencia y `lib/photo-detail/` concentra contenido, selectores, interacción y
SEO. Galería, metadata de imágenes y estado de Fase 6 siguen siendo las fuentes.

## 4. Componentes

`photo-detail-page` orquesta; `context` reconstruye estado; `media`, `header`,
`story`, `actions`, `navigation`, `related`, `keyboard` y `back-link` separan
responsabilidades. Ninguno vuelve a filtrar datos por su cuenta.

## 5. Datos

`gallery-data.ts` conserva ID, categoría, año, orden y español.
`images-data.json` aporta fuente, dimensiones y blur. El cruce siempre es por ID;
no se inventan cámara, ubicación, colección o popularidad.

## 6. Traducciones

`lib/photo-detail/content.ts` contiene título, descripción y alt ingleses para
los 30 IDs. Español usa el catálogo canónico. Un fallback explícito vuelve a
español, y la suite exige cobertura inglesa completa.

## 7. Layout

La ficha reutiliza el sistema oscuro de cartela editorial. Escritorio dispone
imagen y datos en retícula; por debajo de 1024 px usa flujo vertical con imagen
antes del título. No depende de posicionamiento absoluto para leer el contenido.

## 8. Tratamiento de imagen

La principal usa `next/image`, loader local, dimensiones, blur, `priority` y
`sizes`. `object-contain` evita recorte. El recurso fullscreen se monta al abrir;
un fallo mantiene página, texto, acciones y navegación operativos.

## 9. Variantes por orientación

Horizontal, vertical y cuadrada se derivan de ancho/alto y comparten estructura.
Solo cambia el espacio reservado; nunca el orden semántico ni el recorte.

## 10. Contenido editorial

Se muestran título, categoría localizada, año, índice y descripción real. No se
publican localizaciones, técnicas, series o fechas exactas ausentes de la fuente.

## 11. Metadata

`generateMetadata()` produce título, descripción, canonical limpio, alternates
ES/EN, Open Graph y Twitter con la imagen real. El contexto del archivo no entra
en canonical.

## 12. EXIF

`getAvailableExif()` acepta solo valores reales de cámara, objetivo, apertura,
obturación, ISO y focal. Con cero registros útiles actuales, la sección se omite.
Para añadirlos se ejecuta `pnpm optimize-images`; nunca se escriben a mano.

## 13. Navegación contextual

Categoría, año, búsqueda, orden y página se leen con el contrato de Fase 6. La
posición se calcula sobre el resultado reconstruido; si el ID no pertenece a él,
se activa el orden editorial global.

## 14. Reconstrucción del contexto

Se reutilizan parser, serializador y selector del archivo. No se serializan listas
de IDs, por lo que una URL abierta en nueva pestaña funciona sin memoria de sesión.

## 15. Anterior y siguiente

Son enlaces reales con miniatura, título y metadata, y propagan parámetros
válidos. No hay wrap: los extremos anuncian inicio o fin de secuencia.

## 16. Retorno al archivo

Vuelve a `/{locale}` con parámetros y `#gallery`; una entrada directa vuelve a
`/{locale}#gallery`. El cambio de idioma conserva ruta y contexto.

## 17. Restauración de scroll

Fase 6 guarda URL, scroll, ID y foco antes de salir. Al volver reconstruye estado,
restaura scroll mediante el provider y enfoca la tarjeta. La ficha funciona sin
ese almacenamiento.

## 18. Fullscreen

Un `<dialog>` nativo carga el derivado al abrir, reutiliza el lock central y
atiende botón/Escape. Al cerrar libera scroll y devuelve foco al disparador.

## 19. Compartir

Web Share recibe título, descripción y URL limpia. Sin soporte se copia mediante
Clipboard API y fallback de selección temporal. `aria-live` anuncia el resultado.

## 20. Related photos

Se eligen cuatro obras distintas priorizando misma categoría, mismo año y cercanía
editorial. Ante relevancia equivalente se posponen las grandes protagonistas de
la home; ID y orden resuelven el resto de empates. No hay aleatoriedad.

## 21. Transición desde archivo

Tarjeta y media principal comparten `view-transition-name` por ID. Es mejora
progresiva: el enlace normal es siempre el comportamiento base.

## 22. View Transitions

No se fuerzan APIs experimentales ni snapshots manuales. Reduced motion anula la
transición; sin soporte, contenido y navegación permanecen idénticos.

## 23. Reduced motion

Se hereda el contrato global: estado final visible, transiciones mínimas y scroll
nativo cuando corresponde. Enlaces, diálogo, foco y teclado no dependen de motion.

## 24. Mobile

Validado desde 320 px: una columna, imagen primero, targets de 44 px y sin overflow
horizontal. Las imágenes verticales no introducen sticky ni ocultan acciones.

## 25. Tablet

De 768 a 1023 px continúa el flujo vertical a ancho completo. A 1024 px entra la
retícula, conservando el mismo orden DOM y controles accesibles.

## 26. Desktop

La imagen domina y la cartela ocupa la columna derecha. El contenedor limita el
crecimiento ultrawide para conservar escala y aire editorial.

## 27. Accesibilidad

Hay un solo `h1`, landmarks, `figure`, alt localizado, focus-visible, enlaces
reales, estados de borde, `aria-live` y diálogo nativo. Flechas se ignoran dentro
de controles, contenido editable, modificadores y overlays.

## 28. SEO

Las 60 fichas SSG siguen indexables. Cada una tiene canonical y alternates limpios;
las variantes con query canonicalizan a la ruta base para evitar duplicados.

## 29. Structured data

Cada ficha emite `ImageObject` con URL, `contentUrl`, nombre, descripción, autor,
copyright, dimensiones y año reales. No añade datos técnicos ausentes.

## 30. Generación estática

`generateStaticParams()` produce 30 IDs por dos locales. `notFound()` cubre el ID
inválido cuando el runtime lo resuelve; con `output: "export"`, la 404 dinámica se
valida también en `out/` o hosting, no únicamente con `next dev`.

## 31. Rendimiento

No se añadieron dependencias, observers, loops ni ScrollTriggers. Solo la imagen
principal tiene prioridad; relacionadas son lazy y fullscreen se monta al abrir.
La build de referencia genera 70 páginas, 43,38 MiB totales y una sola precarga
de imagen en la ficha. `/es/photo/21` pesa 86.255 bytes de HTML y referencia
851,3 KiB de JavaScript sin comprimir compartido; son métricas de artefacto, no
transferencia Brotli.

## 32. Fallbacks

Contexto inválido: orden global. Sin historial: `#gallery`. Sin Web Share:
portapapeles. Sin EXIF: omitir sección. Sin View Transitions o JavaScript: enlaces
normales. Imagen fallida: mensaje localizado sin inutilizar la ficha.

## 33. Pruebas

`tests/photo-detail/photo-detail-system.test.ts` cubre 30 traducciones, ratios,
contexto válido/inválido, extremos, fallback, relacionadas, URL limpia, teclado y
JSON-LD. La revisión de navegador cubre ES/EN, diálogo, foco y 320–1920 px.

## 34. Cómo añadir traducciones

Añadir el ID a `englishPhotoContent` con `title`, `description` y `alt`, conservar
el ID del catálogo y ejecutar `pnpm test`. Categorías pertenecen al diccionario.

## 35. Cómo añadir EXIF

Actualizar el raw y ejecutar `pnpm optimize-images`. Una nueva clave visible exige
whitelist, diccionarios, tipo y prueba. Nunca inferir valores de la fotografía.

## 36. Cómo cambiar el algoritmo de relacionadas

Modificar solo `selectRelatedPhotos()`, documentar la nueva señal real y actualizar
pruebas deterministas. No usar azar ni telemetría ficticia.

## 37. Cómo mantener navegación contextual

Todo filtro nuevo entra primero en `ArchiveState`, parser, serializador y selector.
Después puede viajar en `getPhotoDetailHref()`. No duplicar parsers ni guardar listas.

## 38. Riesgos

El inglés es manual; no hay EXIF público; `execCommand` es un fallback heredado;
la 404 dev está limitada por export estático y View Transitions depende del navegador.

## 39. Preparación para Fase 8

Las fronteras de media, contenido y acciones permiten evaluar en el futuro un
enhancement aislado con fallback a `PhotoDetailMedia`. Esta fase no carga RAW,
shaders, canvas, cursor personalizado, WebGL ni WebGPU.

## 40. Integración resuelta por la Fase 8

La ficha resuelve opcionalmente `PhotoProcessSection` después de la nota y antes
de navegación. Con cero entradas válidas el condicional servidor devuelve cero
HTML y conserva íntegramente la Fase 7. El fullscreen principal y el futuro
comparador comparten `PhotoFullscreenDialog`, Escape, scroll lock, safe areas y
retorno de foco. Canonical, metadata e `ImageObject` no cambian sin datos reales.

## 41. Interacción del detalle en la Fase 9

Volver, compartir/copiar, fullscreen y cerrar usan magnetismo moderado con capa
interior. La media interactiva declara FULLSCREEN; navegación declara
PREVIOUS/NEXT y relacionadas VIEW. Copiar/compartir mantiene feedback visible,
`aria-live`, un único timer de 1.8 s y cleanup. El cursor se resetea al abrir/cerrar
dialog y nunca sustituye controles, Escape, foco o navegación contextual.

## 42. Motion fotográfica de la Fase 13.2

La ficha entra en menos de un segundo mediante un grupo editorial. Una transición
compartida pendiente evita reanimar la fotografía. Anterior, siguiente y
relacionadas reutilizan `PhotoTransitionLink`; fullscreen abre y cierra en 280 ms
con escala mínima, restaura foco y respeta reduced motion. No se crean triggers de
detalle ni una intro nueva. Véase `RAW_VIVES_PHOTO_MOTION_SYSTEM.md`.
