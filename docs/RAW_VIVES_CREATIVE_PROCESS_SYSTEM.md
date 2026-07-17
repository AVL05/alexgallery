# Sistema de proceso creativo de RAW.VIVES

Referencia de la Fase 8. El sistema está preparado para comparaciones auténticas,
pero la producción no activa ninguna porque el repositorio actual solo contiene
exportaciones finales. No se ha reconstruido, generado ni simulado ningún RAW.

## 1. Objetivo

Explicar con precisión la evolución de una captura documentada hasta la obra
publicada mediante un comparador ligero, accesible y opcional. La interacción es
una mejora progresiva; la procedencia fotográfica gobierna la elegibilidad.

## 2. Inventario de recursos

Se auditaron repositorio, datos, nombres actuales e historial. `public/photos/raw`
contiene 31 WebP que sirven como fuentes del pipeline, pero visual y
pixelométricamente corresponden a las mismas ediciones finales de
`public/photos/optimized/original`: dimensiones idénticas y diferencia media de
0,055–1,935 niveles por canal causada por recompresión. No hay RAW de cámara,
JPEG originales, XMP, sidecars, presets, capturas de Lightroom, notas ni etapas.

| ID | Uso | Fuente versionada | Dimensiones | Ratio | Orientación | Original auténtico | Intermedia | Final | EXIF | Elegible |
| ---: | --- | --- | ---: | ---: | --- | --- | --- | --- | --- | --- |
| 1 | Catálogo | `raw/1.webp` | 1024×766 | 1,337 | Horizontal | No | No | Sí | No | No |
| 3 | Catálogo | `raw/3.webp` | 3831×1766 | 2,169 | Horizontal | No | No | Sí | No | No |
| 4 | Catálogo | `raw/4.webp` | 649×649 | 1,000 | Cuadrada | No | No | Sí | No | No |
| 5 | Catálogo | `raw/5.webp` | 997×997 | 1,000 | Cuadrada | No | No | Sí | No | No |
| 6 | Catálogo | `raw/6.webp` | 3139×2158 | 1,455 | Horizontal | No | No | Sí | No | No |
| 7 | Catálogo | `raw/7.webp` | 1000×1500 | 0,667 | Vertical | No | No | Sí | No | No |
| 11 | Catálogo | `raw/11.webp` | 564×564 | 1,000 | Cuadrada | No | No | Sí | No | No |
| 12 | Catálogo | `raw/12.webp` | 844×844 | 1,000 | Cuadrada | No | No | Sí | No | No |
| 13 | Catálogo | `raw/13.webp` | 1000×1500 | 0,667 | Vertical | No | No | Sí | No | No |
| 14 | Hero | `raw/14.webp` | 1500×1000 | 1,500 | Horizontal | No | No | Sí | No | No |
| 16 | Catálogo | `raw/16.webp` | 1000×1500 | 0,667 | Vertical | No | No | Sí | No | No |
| 17 | Catálogo | `raw/17.webp` | 1134×704 | 1,611 | Horizontal | No | No | Sí | No | No |
| 19 | Catálogo | `raw/19.webp` | 1024×683 | 1,499 | Horizontal | No | No | Sí | No | No |
| 21 | Catálogo | `raw/21.webp` | 1024×683 | 1,499 | Horizontal | No | No | Sí | No | No |
| 23 | Catálogo | `raw/23.webp` | 512×768 | 0,667 | Vertical | No | No | Sí | No | No |
| 24 | Catálogo | `raw/24.webp` | 1024×739 | 1,386 | Horizontal | No | No | Sí | No | No |
| 26 | Catálogo | `raw/26.webp` | 1024×576 | 1,778 | Horizontal | No | No | Sí | No | No |
| 27 | Catálogo | `raw/27.webp` | 1024×617 | 1,660 | Horizontal | No | No | Sí | No | No |
| 29 | Catálogo | `raw/29.webp` | 544×768 | 0,708 | Vertical | No | No | Sí | No | No |
| 30 | Catálogo | `raw/30.webp` | 1320×1980 | 0,667 | Vertical | No | No | Sí | No | No |
| 31 | Catálogo | `raw/31.webp` | 1024×683 | 1,499 | Horizontal | No | No | Sí | No | No |
| 35 | Catálogo | `raw/35.webp` | 512×768 | 0,667 | Vertical | No | No | Sí | No | No |
| 37 | Catálogo | `raw/37.webp` | 1559×1559 | 1,000 | Cuadrada | No | No | Sí | No | No |
| 41 | Catálogo | `raw/41.webp` | 1980×1320 | 1,500 | Horizontal | No | No | Sí | No | No |
| 43 | Catálogo | `raw/43.webp` | 885×885 | 1,000 | Cuadrada | No | No | Sí | No | No |
| 44 | Catálogo | `raw/44.webp` | 918×516 | 1,779 | Horizontal | No | No | Sí | No | No |
| 46 | Catálogo | `raw/46.webp` | 831×1024 | 0,812 | Vertical | No | No | Sí | No | No |
| 48 | Catálogo | `raw/48.webp` | 1350×844 | 1,600 | Horizontal | No | No | Sí | No | No |
| 49 | Catálogo | `raw/49.webp` | 1453×916 | 1,586 | Horizontal | No | No | Sí | No | No |
| 50 | Catálogo | `raw/50.webp` | 924×924 | 1,000 | Cuadrada | No | No | Sí | No | No |
| 51 | Catálogo | `raw/51.webp` | 1000×1500 | 0,667 | Vertical | No | No | Sí | No | No |

Los 31 tienen formato WebP, tres canales y cero bytes EXIF. Los 30 IDs de
catálogo generan final WebP/AVIF en 400, 800, 1200 y tamaño fuente; el ID 14 es
solo hero. Las antiguas imágenes retiradas visibles en historial no tienen pareja
ni procedencia documentada y no se reutilizan.

## 3. Terminología

`RAW original` solo corresponde a una representación fiel exportada desde un RAW
real y documentado. `Captura original` corresponde a JPEG de cámara. `Sin editar`
exige ausencia confirmada de edición. La carpeta histórica `photos/raw` significa
fuente del pipeline, no archivo RAW. La obra publicada se etiqueta `Resultado
final`; una etapa auténtica intermedia, `Corrección técnica`.

## 4. Fotografías elegibles

Total: **0**. IDs elegibles: **ninguno**. `photoProcessEntries` y
`featuredPhotoId` permanecen vacíos. Todas las fichas degradan a la Fase 7 sin
sección, home no añade preview y archivo no añade etiqueta ni filtro.

## 5. Modelo de datos

`types/photo-process.ts` define texto localizado, activo web, tipo técnico,
configuración, paso, proceso resuelto y pareja. La configuración solo almacena
original/corrección; el final se resuelve por ID desde el archivo, evitando
duplicar la fotografía completa.

## 6. Validaciones

Se detectan ID repetido/desconocido, ruta fuera de `/photos/process`, formatos no
WebP/AVIF, archivo ausente, dimensiones inválidas o falsas, original igual al
final, etapa duplicada, ratio incompatible, traducción incompleta, paso repetido
y paso asociado a una etapa inexistente.

## 7. Configuración curada

`lib/photo-process/config.ts` es la única lista habilitadora. No descubre
automáticamente archivos ni activa todas las fotos. Admite orden por array y una
futura pieza de home mediante `featuredPhotoId`, actualmente `null`.

## 8. Comparador

`PhotoProcessComparison` superpone dos imágenes perfectamente alineadas, recorta
la capa posterior mediante `clip-path` y controla el divisor con una propiedad
CSS. No instala librerías ni actualiza React durante el arrastre.

## 9. Arquitectura

```text
types/photo-process.ts
lib/photo-process/{config,interaction,selectors,validation}.ts
components/photo-process/{comparison,section,development-tools}.tsx
scripts/{prepare-photo-process,validate-photo-process}.ts
```

La ficha resuelve datos en servidor. El cliente solo se monta para una entrada
válida; el harness usa `?process-debug=1` exclusivamente en `next dev`.

## 10. Componentes

`PhotoProcessSection` aporta título, notas y pasos. `PhotoProcessComparison`
contiene pares, control, errores, reset y fullscreen. `PhotoFullscreenDialog` es
la única infraestructura de overlay compartida con la imagen principal.

## 11. Slider

La fuente semántica es `input[type=range]`, 0–100, paso 1 e inicio configurable
con fallback 50. El DOM actualiza `--process-position` directamente; React solo
cambia ante carga, error, pareja, reset o fullscreen.

## 12. Pointer Events

Pointer down registra ID/origen. El movimiento espera 6 px para decidir intención;
solo la horizontal captura el puntero y actualiza posición. La vertical conserva
`touch-action: pan-y`. Pointer up y cancel liberan captura y estado.

## 13. Teclado

Flechas ajustan 2 %, Page Up/Down 10 %, Home lleva a 0 y End a 100. Reset remonta
el canvas a 50 o al inicio curado. El valor nativo y `aria-valuetext` se sincronizan.

## 14. Accesibilidad

Nombre, valor, instrucciones, focus-visible y handle de 44 px acompañan al range.
Ambas descripciones quedan disponibles como texto separado para lector. No existe
`aria-live` durante movimiento; errores usan estado discreto.

## 15. Dos etapas

Original y final forman una sola pareja. El tipo del original determina la
etiqueta exacta; nunca se sustituye por `RAW` como claim visual.

## 16. Tres etapas

Con corrección auténtica aparecen dos tabs: original–corrección y
corrección–final. Nunca se superponen tres capas ni se oculta qué etapas compara
el control.

## 17. Notas

Son opcionales y bilingües. Solo pueden describir decisiones confirmadas; no hay
notas de producción actuales.

## 18. Pasos

Cada paso tiene ID, orden, etapa, título/descripcion ES/EN y herramienta opcional.
La validación rechaza asociaciones a etapas ausentes. No existen pasos actuales.

## 19. Integración en detalle

La sección ocupa el capítulo `05 / 08`, después de la nota y antes de navegación.
El condicional se resuelve en servidor; cero elegibles significa cero HTML vacío.

## 20. Integración en home

No se integra todavía: `featuredPhotoId` es `null`. Cuando existan comparativas
reales se podrá cargar una única pieza bajo el fold, nunca varios comparadores.

## 21. Integración en archivo

No se añade etiqueta ni filtro con cero resultados. A partir de varios casos
elegibles puede evaluarse un filtro; con uno o dos se prefiere una marca discreta.

## 22. Fullscreen

Comparador e imagen principal reutilizan `PhotoFullscreenDialog`, focus restore,
Escape, safe areas y `ScrollLockManager`. La segunda pareja visual solo se monta
al abrir y limita ancho según ratio/altura de viewport.

## 23. Imágenes

`prepare-photo-process` acepta una exportación autorizada JPEG/TIFF/PNG/WebP/AVIF,
rota según orientación y genera WebP/AVIF 400/800/1200/full con ancho público
máximo de 2000 px y sin metadata. Los maestros RAW y sidecars se mantienen fuera
del repo. El comparador sirve WebP responsive mediante loader por activo.

## 24. Rendimiento

No hay loop, observer, GSAP, ScrollTrigger ni render React por frame. La final y
original son lazy bajo el fold; fullscreen no se carga antes de abrir. Con cero
elegibles no se descargan imágenes de proceso ni aparece contenido de proceso.

Medición de la ficha estática ES tras la build: 86.260 B de HTML, 16 scripts y
880.371 B de JavaScript inicial, frente a 86.255 B y 871.704 B en la línea base
de Fase 7. El incremento es 8.667 B (aprox. 1,0 %), mantiene un único preload de
imagen y no añade markup, fixture ni solicitudes a `/photos/process/`. La exportación
completa ocupa 45.514.437 B y conserva las 70 páginas estáticas.

## 25. Reduced motion

No existe autoplay ni movimiento automático. La regla global elimina transición;
range, teclado, tabs, reset y fullscreen permanecen operativos.

## 26. Mobile

El canvas ocupa el ancho disponible, conserva ratio y usa handle de 44 px. El
gesto vertical no se captura, no hay swipe de fotografía y no aparece overflow.

## 27. Progressive enhancement

El HTML contiene etiquetas y recursos. Un `<noscript>` presenta ambas etapas una
debajo de otra; si JavaScript o slider falla, el contenido editorial y la ficha
siguen disponibles.

## 28. Internacionalización

`photoProcess` en ambos diccionarios cubre proceso, terminología, instrucciones,
reset, fullscreen, estados, herramientas, pasos, antes/después y parejas. La
terminología visible se selecciona por tipo, no se muestran sinónimos juntos.

## 29. SEO

No se crean rutas ni query indexables. Canonical y alternates continúan apuntando
a la fotografía. Con cero procesos reales no se añade texto de proceso a metadata.

## 30. Structured data

No se modifica `ImageObject`: la final sigue siendo `contentUrl`. Publicar una
relación con el original sin datos reales no aporta valor y podría confundir la
obra principal.

## 31. Fallbacks

Sin configuración: sección omitida. Ratio inválido: dos figuras estáticas.
Original fallido: final y aviso. Final fallida: original y aviso. JS ausente:
figuras apiladas. Fullscreen no disponible: el comparador principal permanece.

## 32. Pruebas

La suite cubre cero elegibles, dos/tres etapas, configuración válida, todos los
errores principales, ratio, clamp, flechas, Home/End/Page, pointer down/move/up/
cancel, scroll vertical, selección de etiquetas y paridad ES/EN.

## 33. Cómo añadir un original

1. Guardar el maestro fuera del repositorio.
2. Exportar una representación fiel autorizada sin ajustes inventados.
3. Ejecutar `pnpm prepare-photo-process -- --id 21 --stage original --input "C:\\ruta\\export.tif"`.
4. Revisar visualmente los derivados y declarar rutas/dimensiones/alt en config.
5. Ejecutar validación, tests, build y navegador.

## 34. Cómo añadir una etapa intermedia

Preparar `--stage corrected`, declarar `corrected` con tipo
`technical-correction` y comprobar que comparte encuadre/ratio. No inferir una
etapa desde la final.

## 35. Cómo documentar pasos

Añadir solo pasos confirmados, vinculados a `original`, `corrected` o `final`, con
orden y contenido ES/EN. Herramienta es opcional; nunca añadir valores de sliders.

## 36. Cómo activar una fotografía

Añadir una entrada explícita a `photoProcessEntries`. La build valida recursos y
dimensiones; después verificar ficha ES/EN, touch, teclado, errores y fullscreen.

## 37. Cómo desactivar una fotografía

Retirar su entrada y, si aplica, cambiar `featuredPhotoId`. Los derivados web
pueden conservarse hasta una limpieza revisada; nunca borrar maestros desde este repo.

## 38. Riesgos

El nombre histórico `raw` puede inducir a error; los originales futuros necesitan
proveniencia manual; WebP es la variante servida por el loader actual; dos imágenes
aumentan decodificación cuando haya casos; el harness emplea fotos finales distintas
solo como fixture técnica claramente marcada y nunca entra en producción.

## 39. Integración con la Fase 9

La infraestructura sigue inactiva en producción mientras no existan recursos
auténticos. En el harness, el range declara DRAG solo estando listo; pointer
capture comienza tras intención horizontal y el label se oculta durante arrastre.
COMPARE identifica apertura, reset conserva press y fullscreen comparte CLOSE,
lock y retorno de foco. No se añade magnetismo al slider, listener global propio,
canvas, shader, WebGL, WebGPU, vídeo ni IA.
