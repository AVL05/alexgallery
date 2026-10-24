# raw.vives — Recorrido de inicio

## Intención

Un archivo fotográfico personal de Alex Vicente. La fotografía es una afición:
la presentación invita a mirar y compartir, sin ofrecer encargos profesionales
ni prometer tiempos de respuesta. `PRODUCT.md` y `DESIGN.md` son la autoridad.

## Recorrido público

El orden se define en `lib/home/experience.ts`:

1. Hero (`#hero`): proyección panorámica, autor, cartela y acceso al archivo.
2. Selección (`#selected-work`): exposición vertical de cuatro fotografías a diferentes escalas.
3. Series (`#series`): una portada principal con contexto y dos entradas escalonadas.
4. Archivo (`#gallery`): categorías con recuentos y una muestra del catálogo.
5. Sobre mí (`#about`): afición, curiosidad y aprendizaje.
6. Contacto (`#contact`), preguntas frecuentes y footer.

No hay introducción bloqueante, texto decorativo desplazándose ni WebGL en la
portada pública. La entrada del hero utiliza el GSAP compartido, sin parallax
ni cambios de escala que recorten la imagen. La fotografía ocupa la apertura;
la selección continúa con un ritmo de imágenes grandes y pequeñas.

## Datos y componentes

`HomeClient` compone navegación, contenido principal y footer. `HomeNarrative`
resuelve los datos mediante `lib/home/selectors.ts` y el orden configurado.
Los componentes consumen `homeCuration`; no eligen fotografías por su cuenta.

El catálogo sigue en `lib/gallery-data.ts`; las variantes, dimensiones y blur
proceden de `lib/images-data.json`. El rediseño no cambia IDs, orden de catálogo,
fuentes fotográficas ni pertenencia a series.

- Hero: ID 3, «El ruido del cielo», por su ratio panorámico y tensión visual.
  Si falla, el fallback local 46 actualiza también título, alt y enlace.
  El ID 52 queda como expansiva reservada y permanece accesible en el archivo.
- Selección: IDs 1, 35, 37 y 49, fuera de las series publicadas.
- Series: las tres publicadas, con `porto-river-night` primero.
- Muestra de archivo: selector determinista existente, excluyendo hero, selección
  y portadas de serie.

`FeaturedStory`, `ExpansivePhoto`, `VisualChapters` y `ClosingStatement` siguen
como componentes disponibles, fuera del recorrido público actual.

## Interacción

La selección enlaza a las fichas estáticas y guarda el origen con el mecanismo
existente. El regreso identifica la selección en ES/EN. Una visita directa a
una ficha conserva el archivo como destino de regreso, sin depender del storage.
Al volver a la exposición se recuperan la fotografía y su foco mediante el
contexto existente de sesión. Los enlaces se recorren con Tab y se abren con
Enter. El scroll vertical es nativo; no hay controles de carrusel, autoplay ni
secuestro de scroll. Sin JavaScript, las fotografías y enlaces siguen disponibles.
La aparición al entrar en pantalla reutiliza PhotoMotionGroup y respeta reducción
de movimiento, sin depender de ella para mostrar el contenido estático.
El documento conserva el desplazamiento nativo inmediato al recibir foco. Lenis
gestiona la suavidad en dispositivos compatibles; no se superpone otro scroll
suave global en CSS, que podía cancelar el desplazamiento del teclado al refrescar
las medidas de las imágenes.

Las categorías de inicio usan `serializeArchiveState()` y abren `/archive` con
un filtro compartible. No existe un segundo sistema de filtrado. El menú ofrece
acceso a contacto, cierre con Escape y restauración del foco; su contenido puede
desplazarse en pantallas bajas.

La ficha ajusta el ancho a la altura disponible manteniendo el ratio real. El
visor a pantalla completa y sus controles de teclado se conservan.

Contacto prepara borradores `mailto:` con las validaciones y referencias
existentes. Las preguntas frecuentes permanecen en `details` nativos y su
JSON-LD reproduce el mismo contenido.

## Responsive y accesibilidad

En móvil la selección y las series se leen en una columna. En escritorio, una
retícula de doce columnas establece escalas y pausas sin cambiar el orden de
lectura. La muestra del archivo pasa de una a cuatro columnas según el ancho.
Las fotografías conservan sus proporciones y los pies quedan fuera del marco.
La apertura ajusta su tamaño a la altura disponible sin recortar el original.
Autor y cartela comparten ese ancho para mantener la alineación en pantallas
bajas. Las cabeceras de selección, series y archivo comparten escala y ritmo.
Los pies de foto usan sans legible y conservan categoría, año y orden; la
numeración de la selección muestra una sola posición. Contacto usa dos columnas
de cabecera en escritorio; las notas y el footer cierran el recorrido con menor
escala tipográfica.

El inicio tiene un único `h1`, un `main` semántico y secciones con `h2`; navegación
y footer están fuera de `main`. Los controles mantienen foco visible y áreas
táctiles de al menos 44 px. El movimiento reutiliza la infraestructura y respeta
la preferencia de reducción de movimiento.

## Validación

Los contratos se comprueban en `tests/home/`, `tests/hero/` y las suites de
archivo, series, imágenes y rutas. `tests/e2e/home-hierarchy.spec.ts` cubre acceso
al archivo, selección y regreso, categorías, menú móvil, marco de ficha y
fallback del hero en navegador. La suite E2E general comprueba el resto de rutas,
formularios y continuidad sobre la exportación estática.

Ejecutar `pnpm check` y `pnpm e2e` antes de publicar. Los screenshots locales y
las pruebas headless no equivalen a validación en dispositivos físicos ni a
mediciones de Core Web Vitals en producción.

## Referencias visuales

Se inspeccionaron en navegador las portadas de Benjamin Hardman
(https://benjaminhardman.com/), Tom Hegen (https://www.tomhegen.com/) y
Romain Laprade (https://www.romainlaprade.com/). Se adaptan el predominio de la
imagen, la escala editorial de las series y la discreción del índice, sin copiar
fotografías, textos ni identidad. Las capturas de estudio son locales y no se
incluyen como recursos públicos.
