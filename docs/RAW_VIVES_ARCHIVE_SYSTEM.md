# Sistema de archivo fotográfico de RAW.VIVES

Documento de referencia de la Fase 6. El archivo continúa en `/{locale}#gallery`
porque esa es la URL pública y el punto de integración preparado por la Fase 5.
No se crea una ruta duplicada ni se rediseña la ficha individual.

## 1. Objetivo

Convertir la antigua galería en un índice fotográfico editorial, rápido,
filtrable, compartible y accesible. La home conserva su narrativa; el archivo
reduce el movimiento y prioriza búsqueda, orientación y navegación real.

## 2. Auditoría del sistema reemplazado

- Ruta: `/{locale}#gallery`, dentro de la home localizada.
- Componente: `components/gallery.tsx`, antes monolítico.
- Datos: 30 fotografías de `lib/gallery-data.ts`; la imagen 14 queda reservada al hero.
- Categorías: Fauna 6, Arquitectura 14, Paisaje 6, Retrato 2 y Meteorología 2.
- Años: 2022 (1), 2023 (1), 2024 (11) y 2025 (17).
- Ratios: 14 horizontales, 9 verticales y 7 cuadrados.
- Idiomas: interfaz ES/EN; títulos y descripciones fotográficas siguen en español.
- Filtro anterior: solo categoría, estado local y no compartible.
- Orden anterior: orden editorial del catálogo.
- Carga anterior: las 30 tarjetas en un Masonry cliente.
- Apertura anterior: lightbox interceptando el enlace a ficha.
- Persistencia anterior: ninguna; filtros y posición se perdían.
- Estados anteriores: sin búsqueda, vacío, error global ni carga progresiva.
- Imágenes: `next/image`, loader local, dimensiones y blur existentes.
- Motion: un batch de ScrollTrigger reiniciado al filtrar.
- SEO: la home era indexable, pero la metadata localizada heredaba canonical raíz.

Se conservan catálogo, IDs, rutas, alt, loader, blur, navegación a ficha,
internacionalización manual, home narrativa y design/motion system. Se reemplazan
Masonry, lightbox, estado disperso y carga completa por una experiencia de índice.

## 3. Arquitectura

```text
components/archive/
  archive-page.tsx              orquestación y fuente de verdad visual
  archive-header.tsx            cabecera y cifras reales
  archive-toolbar.tsx           búsqueda, orden y entrada móvil
  archive-filters.tsx           categorías, años y recuentos compartidos
  archive-results-summary.tsx   resumen accesible
  archive-grid.tsx              grid CSS editorial
  archive-item.tsx              figura, imagen, metadata y contexto
  archive-empty-state.tsx       estado sin coincidencias
  archive-pagination.tsx        carga progresiva por botón
  archive-mobile-filters.tsx    diálogo accesible
  archive-return-link.tsx       retorno contextual desde ficha
hooks/
  use-archive-state.ts          estado, historial y URL
  use-archive-return-href.ts    contexto opcional de regreso
  use-location-snapshot.ts      locale y URL reactivos
lib/archive/
  types.ts                      contratos y valores por defecto
  selectors.ts                  datos, filtros, recuentos y variantes
  url.ts                        lectura, validación y serialización
  context.ts                    contexto temporal en sessionStorage
```

`components/gallery.tsx` permanece como punto compatible y delega en
`ArchivePage`. Los datos y la presentación no se filtran dentro de las tarjetas.

## 4. Fuente de datos

`buildArchivePhotos()` cruza una vez `gallery-data.ts` con
`images-data.json` mediante el ID. Añade dimensiones, fuente optimizada, blur y
el índice curado. No crea títulos, categorías, años, ubicaciones ni EXIF.

## 5. Modelo de estado

```ts
{
  category: "Todo",
  year: "all",
  query: "",
  sort: "curated",
  page: 1
}
```

El panel móvil es estado de interfaz y no modifica resultados al abrir o cerrar.
Categoría, año, búsqueda y orden reinician `page` a 1. Limpiar vuelve al estado
por defecto. Cargar más solo incrementa la página visible.

## 6. URL y parámetros

El estado usa query params sobre la home y conserva `#gallery`:

```text
/es?category=fauna&year=2025&q=cisne&sort=newest&page=2#gallery
```

Parámetros soportados:

- `category`: `fauna`, `arquitectura`, `paisaje`, `retrato`, `meteorologia`.
- `year`: uno de los cuatro años reales.
- `q`: búsqueda de hasta 120 caracteres.
- `sort`: `curated`, `newest`, `oldest`, `title-asc`, `title-desc`.
- `page`: entero positivo.

Los valores por defecto se omiten. Los inválidos se eliminan mediante
`replaceState`; otros parámetros de desarrollo se conservan. `pushState` mantiene
el historial de filtros y `replaceState` evita una entrada por pulsación durante
la búsqueda. `popstate` restaura el estado. Los enlaces de categoría funcionan
sin JavaScript y el selector de idioma conserva query/hash.

## 7. Filtros y recuentos

Se implementan categoría y año porque ambos campos están completos en las 30
entradas. No se añaden cámara, ubicación, orientación ni colección como filtros:
no existe contenido editorial consistente para todos ellos.

Los recuentos son condicionados: categorías respetan año y búsqueda; años
respetan categoría y búsqueda. Así cada número anticipa el resultado de activar
esa faceta sin esconder opciones globales.

## 8. Búsqueda

Busca únicamente título, descripción, categoría y año, los campos reales
disponibles. Normaliza mayúsculas y diacríticos con NFD, no usa fuzzy search ni
dependencias. La interfaz aplica un debounce de 220 ms y sincroniza `q` por
reemplazo de historial.

## 9. Ordenación

- Orden editorial: índice original del catálogo; opción por defecto.
- Más recientes y más antiguas: año con desempate editorial.
- Título A—Z y Z—A: comparación española sin distinguir acentos/mayúsculas.

No existen popularidad, vistas ni tendencias porque no hay datos para ello.

## 10. Grid y variantes editoriales

Se usa CSS Grid, sin Masonry JavaScript. Desde 480 px hay dos columnas; desde
1024 px una retícula de 12 columnas. El patrón de seis posiciones produce
`featured`, `standard`, `sequence` y `panorama`; una panorámica solo ocupa la
fila completa si la imagen es horizontal. La función es determinista y el DOM
mantiene el mismo orden de lectura.

Cada figura conserva el ratio real, reserva dimensiones y muestra título,
categoría localizada y año fuera de la fotografía. No existe `grid-auto-flow:
dense`, por lo que el orden visual no adelanta obras posteriores.

## 11. Imágenes y errores

Cada tarjeta usa `next/image` y el loader del proyecto: `srcset`, `sizes`, WebP,
dimensiones, lazy loading, decoding asíncrono y blur. El archivo está debajo de
la narrativa, por lo que ninguna miniatura recibe prioridad y no compite con el
hero LCP. Un fallo cambia una vez a la imagen local 1; si también falla, mantiene
título/enlace y muestra un fallback textual sin icono roto.

Los datos están embebidos en la build, así que no se simula un loading remoto ni
un error global imposible en este modelo. La build/HTML son el fallback de datos.

## 12. Carga progresiva y virtualización

La primera vista renderiza 12 fotografías. Cada botón añade 8 y guarda `page` en
URL; para 30 obras el máximo es 12 → 20 → 28 → 30. El botón es teclado-accesible
y no mueve foco ni borra resultados anteriores.

No se introduce virtualización: 30 nodos no justifican su coste y perjudicaría
SEO, accesibilidad y restauración de scroll.

## 13. Apertura, detalle y restauración

La tarjeta es un enlace real a `/{locale}/photo/{id}` y ya no se intercepta para
abrir un lightbox. La ficha completa existente es la alternativa equivalente y
permite nueva pestaña, historial, SEO y teclado.

Antes de navegar se guarda durante seis horas como máximo: locale, ID, URL del
archivo, estado, `scrollY` y timestamp. Los enlaces de retorno y Escape en la
ficha usan ese contexto solo si coincide con locale e ID; una entrada directa
usa `/{locale}#gallery`.

Al volver, la URL reconstruye filtros/página. En el siguiente frame el provider
restaura el scroll mediante Lenis o scroll nativo, enfoca el enlace de la obra con
`preventScroll` y elimina el contexto. No hay timeout fijo. `view-transition-name`
queda preparado por ID como mejora progresiva; sin API la navegación es normal.

La Fase 7 consume estos parámetros para reconstruir anterior/siguiente sin
serializar listas de IDs. Una URL directa continúa usando el orden global.

## 14. Mobile y responsive

- 320–479 px: una columna y metadata siempre visible.
- 480–1023 px: dos columnas; piezas destacadas ocupan ambas.
- 1024 px o más: retícula editorial de 12 columnas y filtros laterales.
- La barra móvil conserva búsqueda, recuento y botón de filtros.
- El diálogo bloquea/restaura scroll con `MotionProvider`, gestiona foco, Tab,
  Shift+Tab, Escape, retorno al trigger y safe areas.

No se añade selector de densidad: con 30 obras una única vista editorial es más
clara y evita estado sin valor real.

## 15. Motion y reduced motion

El archivo no crea ScrollTriggers. Filtros y carga solicitan un refresh agrupado
al provider; las transiciones se limitan a color, transform y brillo de hover.
Así no hay triggers por tarjeta, reanimación al filtrar ni cleanup huérfano.

Reduced motion utiliza la regla global, desactiva transiciones visibles y View
Transitions, mantiene contenido y diálogo funcionales y conserva scroll nativo.

## 16. Accesibilidad

- El hero mantiene el único `h1`; al ser una sección de la misma home, el archivo
  usa un `h2` con `aria-labelledby` en lugar de introducir un segundo `h1`.
- Fieldsets/legends, labels, select nativo, botones y enlaces reales.
- `aria-pressed` para categorías/años y `aria-live="polite"` solo en el total.
- Skip link al grid, focus-visible global, targets de 44 px y orden DOM estable.
- `figure`/`figcaption`, alt real, singular/plural y estado vacío accionable.

## 17. SEO

`/{locale}` tiene canonical y alternates localizados. Las combinaciones de filtros
heredan canonical a la home base y no entran en sitemap, evitando URLs duplicadas.
Los enlaces de las 30 obras permanecen en el HTML inicial o en la progresión
cliente; las fichas y el sitemap no cambian.

## 18. Rendimiento

Se eliminan del archivo los imports cliente de `react-masonry-css`,
`yet-another-react-lightbox`, captions y sus CSS. Las dependencias permanecen en
`package.json` por prudencia, pero ya no entran en este componente. El estado usa
selectores memoizados a nivel de página y mapas para cruzar datos.

Presupuesto actual: 12 tarjetas iniciales, 0 ScrollTriggers propios, 0 observers
propios, sin nuevas dependencias y lazy loading para todas las miniaturas.

## 19. Pruebas y validación

`tests/archive/archive-system.test.ts` cubre catálogo/IDs, URL válida e inválida,
serialización, enlaces localizados, acentos, búsqueda, filtros combinados,
ordenación, recuentos condicionados, carga progresiva y variantes estables.

No se instala Playwright/Cypress. La validación E2E se realiza con el navegador
local: ES/EN, URL, búsqueda, detalle, retorno, foco, scroll, panel móvil y
normalización de parámetros. Las combinaciones también pueden reproducirse con
query params; `motion-debug=1` sigue mostrando infraestructura y triggers sin
publicar una ruta interna.

## 20. Mantenimiento

### Añadir un filtro

Añadir el campo real a `ArchiveState`, validarlo/serializarlo en `url.ts`,
incorporarlo a `selectArchivePhotos`, decidir la regla de recuentos, añadir el
control compartido y cubrir valores vacíos/inválidos en tests.

### Añadir una categoría

Seguir `RAW_VIVES_ARCHITECTURE.md`; después añadir su slug en `url.ts` y una
prueba de enlace. No activar una categoría sin fotografías.

### Cambiar el orden por defecto

Cambiar `defaultArchiveState.sort`, la omisión en URL y el texto/documentación.
Nunca reordenar `gallery-data.ts` solo para cambiar una opción visual: ese array
también gobierna anterior/siguiente global.

### Cambiar la carga progresiva

Modificar `ARCHIVE_DEFAULT_PAGE_SIZE`, `ARCHIVE_PAGE_SIZE` y
`getVisibleArchiveCount()` de forma conjunta, actualizar el cálculo de máximo y
los tests. Mantener botón real y `page` compartible.

## 21. Integración con el detalle de Fase 7

- El contenido fotográfico se localiza en ficha y archivo mediante
  `lib/photo-detail/content.ts`; español conserva el catálogo como fuente base.
- El archivo comparte documento y bundle con una home larga.
- El fallback de imagen 1 también podría fallar ante un problema global de assets.
- View Transitions queda preparado, no forzado por configuración experimental.
- La ficha reconstruye anterior/siguiente desde parámetros y conserva el contexto
  en retorno, cambio de idioma y navegación visual.
- Comparador RAW/final, cursor y WebGL siguen fuera del alcance.

## 22. Decisión de integración de la Fase 8

El inventario contiene cero procesos auténticos. Por ello el archivo no añade
filtro `Con proceso`, etiqueta ni icono: cualquier indicador sería vacío o
engañoso. La futura elegibilidad se deriva de `photoProcessEntries`; con pocos
casos se priorizará una etiqueta discreta antes que una faceta sin utilidad.
