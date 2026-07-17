# Sistema de interacción RAW.VIVES

## 1. Objetivo

La Fase 9 añade significado y respuesta inmediata a las acciones sin competir con
la fotografía. El cursor es un complemento progresivo; HTML, foco, etiquetas y
controles visibles siguen siendo la interfaz principal.

## 2. Auditoría anterior

La base ya tenía foco global correcto, enlaces editoriales, escalas fotográficas
de 1.01–1.018 y desplazamientos de icono de 2–4 px. Faltaban una fuente de verdad
para estados contextuales, feedback `active` común y magnetismo reutilizable. El
único seguimiento de puntero estaba aislado en el comparador. No había cursor
personalizado ni `will-change` global permanente.

Clasificación: se mantienen el foco, los hovers fotográficos y los locks de
overlay; se normalizan enlaces, botones, iconos y press; se integra cursor en
acciones con significado; se refactoriza el arrastre para su override contextual.
No se eliminan interacciones correctas.

## 3. Principios

1. La fotografía manda.
2. El movimiento confirma; no ambienta.
3. La respuesta es inmediata y breve.
4. Cada estado comunica una acción real.
5. El cursor nativo es el fallback.
6. Teclado recibe foco y feedback equivalentes.
7. Touch funciona sin cursor ni magnetismo.
8. Reduced motion simplifica a cursor nativo.
9. Los contratos son compartidos y declarativos.
10. No existen loops ambientales.

## 4. Arquitectura

- `InteractionBootstrap`: decisión cliente y carga diferida.
- `CursorLayer`: único DOM, listener delegado y estado contextual.
- `cursor-target.ts`: API declarativa y resolución por prioridad.
- `Magnetic`: primitive local para pocos controles destacados.
- `cursorConfig`: valores, estrategia y opt-out centralizados.
- `development.ts`: telemetría y controles solo de desarrollo.

No existe contexto duplicado ni cursor por ruta. `MotionProvider` continúa siendo
la autoridad de capacidades, reduced motion, Lenis y overlays.

## 5. Cursor Provider

El rol de provider lo cumple `InteractionBootstrap`, montado una vez en el layout
localizado. Espera a la hidratación, consulta capacidades y solo entonces importa
`CursorLayer` con `ssr: false`. No bloquea contenido crítico ni oculta el cursor
nativo durante la decisión.

## 6. Cursor Target

`getCursorTargetAttributes()` produce `data-cursor`, etiqueta, contraste,
prioridad, preview y disabled. La delegación recorre ancestros y elige primero la
mayor prioridad y después el target más cercano. `disabled` y `loading` se
descartan.

## 7. Estados

Disponibles: `default`, `view`, `open`, `drag`, `next`, `previous`, `close`,
`fullscreen`, `compare` y `explore`. Default usa punto y anillo de 18 px; estados
direccionales/cierre usan 58 px; estados con etiqueta, 76 px.

## 8. Etiquetas

ES: Ver, Abrir, Arrastrar, Siguiente, Anterior, Cerrar, Ampliar, Comparar y
Explorar. EN: View, Open, Drag, Next, Previous, Close, Fullscreen, Compare y
Explore. También existen Copiado/Copied y No disponible/Unavailable para feedback
futuro. Todo procede del diccionario del layout.

## 9. Contraste

`default`, `light` y `dark` son variantes explícitas del target. Mantienen borde y
fondo sólidos/translúcidos sobre texto, fondos, fotografías y overlays; no se
analiza píxel ni color mediante canvas.

## 10. Movimiento

El punto sigue directamente con `gsap.quickSetter`; la superficie usa
`gsap.quickTo` a 0.12 s y `power2.out`. Solo se transforman nodos fijos y no se
animan `left`/`top`.

## 11. Seguimiento

Hay un único `pointermove` global pasivo. Posición y presentación viven en refs;
React solo cambia cuando cambia estado, etiqueta o contraste, nunca por frame. Un
RAF bajo demanda tras scroll vuelve a resolver el elemento bajo el puntero.

## 12. Detección de capacidades

Se requieren simultáneamente `pointer: fine`, `hover: hover`, configuración
activa, ausencia de reduced motion, ausencia de opt-out y una inicialización GSAP
correcta. No se usa el ancho de viewport.

## 13. Touch

Un `pointerType=touch` restaura el cursor nativo. La capa no se monta cuando touch
es el puntero principal sin hover fino. Press, controles de 44 px, fullscreen,
filtros y comparador siguen disponibles.

## 14. Teclado

Tab y teclas de navegación cambian modalidad a teclado, ocultan el cursor y
neutralizan magnetismo. `:focus-visible` conserva outline global y replica los
cambios visuales relevantes de tarjetas, imágenes, títulos e iconos.

## 15. Reduced motion

La estrategia central es `native`: no se monta cursor contextual, se desactiva
magnetismo, se eliminan escalas de press y los hovers quedan reducidos por la
regla global de duración. La función de todos los controles permanece.

## 16. Cursor nativo

Solo se oculta tras inicialización correcta con el atributo
`html[data-custom-cursor=ready]` y dentro de la media query fina. Se restaura en
inputs de texto, select, textarea, editable, iframe, regiones opt-out, disabled,
touch, teclado, blur, pestaña oculta, error y unmount. El range mantiene
`ew-resize`/comportamiento nativo antes del arrastre contextual.

## 17. Magnetismo

`Magnetic` mide una vez al entrar, mueve una capa interior un máximo de 8 px con
fuerza 0.12 y escala 1.02. Usa `quickTo`, no cambia el hit area y limpia tweens y
`will-change`. Solo se aplica a CTA, menú/cierre, fullscreen, volver y compartir.

## 18. Hovers

El vocabulario se limita a subrayado/color editorial, flecha 2–4 px, imagen
1.01–1.018 y brillo moderado. Archivo, Selected Work, historia, capítulos,
relacionadas y navegación anterior/siguiente comparten ese lenguaje.

## 19. Press feedback

`data-press-feedback` aplica escala 0.985 durante `:active` sin alterar layout. Se
usa en CTA, enlaces, filtros, carga progresiva, menú, fullscreen, compartir y
controles. Reduced motion elimina la transformación.

## 20. Iconos

Los iconos permanecen etiquetados por texto o `aria-label`. Flechas desplazan
2–4 px, fullscreen crece mínimamente y cierre mantiene respuesta breve, sin giro
completo, rebote ni animación continua.

## 21. Previews

No se implementan. La propia retícula ya muestra la imagen y una miniatura junto
al cursor duplicaría contenido, aumentaría decodificación y podría tapar títulos.
La API y configuración conservan `preview` desactivado para una futura decisión
editorial basada en datos.

## 22. Overlays

El cursor está en z 400, por encima de overlays, con `pointer-events:none`.
Menú, filtros, fullscreen y comparador reutilizan el mismo layer; solo los botones
válidos anuncian OPEN/CLOSE. Los locks de `MotionProvider` siguen controlando
Lenis y foco.

## 23. Intro

La raíz de intro opta por cursor nativo. No aparecen estados de la página bajo el
overlay, Saltar mantiene su control semántico y el cursor se inicializa de forma
independiente al terminar u omitirse la secuencia.

## 24. Hero

El CTA principal es magnético y `EXPLORE`; el indicador de scroll recibe feedback
ligero. La fotografía no sigue el puntero ni anuncia VIEW si no navega.

## 25. Home

Capítulos e índice usan EXPLORE; Selected Work, expansiva e historia enlazada usan
VIEW. El cierre distingue explorar archivo y abrir contacto. No se añade
magnetismo por sección ni carga de previews.

## 26. Archivo

Tarjetas usan VIEW, escala 1.012 y foco equivalente. Filtros, limpiar y carga
progresiva reciben press; el panel móvil usa OPEN/CLOSE. No se añade listener por
tarjeta, preview, observer ni ScrollTrigger propio.

## 27. Detalle

Volver, acciones y cierre son magnéticos. Media interactiva usa FULLSCREEN;
anterior/siguiente usan estados direccionales y relacionadas usan VIEW. Copiar y
compartir conservan texto visible, `aria-live`, timer único de 1.8 s y cleanup.

## 28. Comparador

El range anuncia DRAG solo cuando está listo. Tras confirmar gesto horizontal,
oculta la etiqueta durante pointer capture y restaura al finalizar/cancelar.
COMPARE identifica apertura; reset y fullscreen conservan instrucciones, handle,
teclado y `touch-action: pan-y`.

## 29. View Transitions

No se amplían. El cursor resetea presentación al cambio de ruta y no crea nombres
ni timelines que compitan con la transición de imagen existente.

## 30. Cambios de ruta

`usePathname` dispara el reset síncrono: limpia override, estado, etiqueta,
contraste y visibilidad. La reinstalación del efecto revierte GSAP y elimina todos
los listeners antes de registrar el único conjunto nuevo.

## 31. Accesibilidad

La capa es `aria-hidden`, no enfocable y no intercepta eventos. Ninguna acción o
información depende del cursor. Se conservan controles semánticos, labels, focus,
Escape, traps, anuncios, zoom y tamaños táctiles.

## 32. Rendimiento

Un DOM, un pointer listener, cero setState posicional, transforms, sin filtros
animados, preview ni loop. El magnetismo solo mide al entrar y `will-change` es
temporal. Scroll usa un RAF bajo demanda y la pestaña oculta apaga visibilidad.

## 33. Carga diferida

El layout carga un bootstrap pequeño; el layer GSAP/contextual queda en chunk
dinámico cliente y solo se solicita después de decidir capacidades. SSR y export
estático no renderizan el cursor y no hay hydration mismatch.

## 34. Configuración

`lib/interactions/config.ts` controla habilitación, `?native-cursor=1`, debug,
duración/ease, preview, tamaños, padding, estrategia reduced y parámetros
magnéticos. No hay números de comportamiento dispersos.

## 35. Debug

`?motion-debug=1` muestra elegibilidad, modalidad, estado, etiqueta, contraste,
preview, listener, magnetismo, posición, overlay y ruta. Permite forzar VIEW,
DRAG, NEXT, contraste, disable, touch, reduced, bordes e idioma. No existe en la
build de producción.

## 36. Pruebas

Los contratos cubren capacidades, touch, reduced, opt-out, error, modalidad,
atributos, prioridad, disabled/loading, nativo, clamp, magnetismo, traducciones,
listener/cleanup, fallback, intro y carga dinámica. La validación manual cubre
rutas, overlays, inputs, foco, viewports, zoom y consola.

## 37. Cómo añadir un nuevo target

Importa `getCursorTargetAttributes` y extiende el elemento semántico:

```tsx
<Link {...getCursorTargetAttributes({ type: "view", contrast: "dark" })} />
```

Usa prioridad solo si un target anidado debe ganar de forma explícita.

## 38. Cómo añadir una etiqueta

Añade la clave equivalente en `types/dictionary.ts`, `dictionaries/es.json` y
`dictionaries/en.json`; después enlaza el estado en `CursorLayer`. Nunca hardcodees
copy localizada dentro del componente.

## 39. Cómo aplicar magnetismo

Envuelve el control con `<Magnetic>` y añade `data-magnetic-content` a una capa
interior que no determine el hit area. No lo uses en listas, ranges ni disabled.

## 40. Cómo desactivar una interacción

Cursor global: `cursorConfig.enabled=false`; usuario/dev:
`?native-cursor=1`; target: `disabled`, `aria-disabled` o
`data-cursor-disabled`; región nativa: `data-native-cursor`; Magnetic:
`disabled`. Reduced motion y capacidades operan automáticamente.

## 41. Errores que deben evitarse

No añadir listeners globales, cursores por página, state por frame, selectores
dispersos, medidas continuas, `will-change` permanente, cursor sobre touch,
preview por tarjeta, labels sin traducir ni sustituir botón/foco por cursor.

## 42. Riesgos

Los dispositivos híbridos dependen de que el navegador reporte correctamente el
puntero principal; extensiones de accesibilidad pueden alterar cursores; los
targets futuros pueden abusar de etiquetas; un overlay nuevo necesita contraste
y reset explícitos. El fallback nativo limita el impacto de todos estos casos.

## 43. Preparación para Fase 10

La interfaz declarativa, detección y métricas quedan aisladas para evolucionar
sin tocar rutas ni catálogo. Fase 9 no incluye canvas, WebGL, WebGPU, Three.js,
shaders, partículas, tilt, distorsión, vídeo, audio ni seguimiento de imagen. Una
Fase 10 deberá partir de necesidad editorial medida y preservar estos fallbacks.

## 44. Integración completada por la Fase 10

El único `pointermove` global sigue perteneciendo a `CursorLayer`, que publica
una señal posicional sin render React. El hero WebGL se suscribe sin añadir
listeners propios y conserva cursor nativo, touch, teclado, overlays y reduced
motion. La fotografía no adquiere target ni etiqueta contextual nueva.

## 45. Integración completada por la Fase 11

`forced-colors: active` impide montar el cursor y restaura el cursor nativo por
CSS incluso ante un atributo residual. El skip link localizado precede a la
navegación y los `main` de home, ficha y política son objetivos enfocables. El
listener de scroll de la cabecera agrupa lecturas en un único RAF pendiente.
