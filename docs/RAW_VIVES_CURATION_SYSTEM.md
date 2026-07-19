# Sistema de curación fotográfica de RAW.VIVES

Referencia de la Fase 13.1. Esta fase reorganiza las fotografías de la home sin
añadir secciones, motion, WebGL, rutas ni fotografías al catálogo. El archivo
completo conserva las 30 obras y sigue siendo el lugar donde aparece la colección
íntegra.

## 1. Problema detectado

La configuración anterior ya evitaba duplicados directos entre historia,
fotografía expansiva, capítulos y Selected Work. El problema real era más sutil:

- seis protagonistas reaparecían inmediatamente en las primeras 12 tarjetas del
  archivo;
- paisaje repetía dos vistas de acantilados cercanas al hero;
- las dos escenas de rayos ocupaban papeles grandes próximos;
- Arquitectura aportaba tres de las seis obras de Selected Work;
- el inglés localizaba la interfaz, pero no título, descripción ni alt de la
  narrativa curada;
- `Retrato` era clave interna mientras la interfaz mostraba `Personas`;
- el índice no tenía una decisión fotográfica propia;
- la configuración no rechazaba IDs inexistentes, conflictos o categorías
  incorrectas durante build.

No había una fotografía visible tres veces antes del archivo: el máximo anterior
era dos al contar la reaparición permitida dentro del archivo completo. La mejora
no maquilla una cifra inexistente; resuelve jerarquía, similitud y distribución.

## 2. Auditoría de repeticiones anterior

Convenciones: `H` horizontal, `V` vertical, `C` cuadrada. `Inicio` cuenta las
secciones anteriores al archivo. `Total` añade la aparición de cada obra en el
archivo completo; la imagen 14 está reservada al hero y no pertenece al catálogo.
`Rel.` indica en cuántas de las 30 fichas aparecía como relacionada con el
algoritmo previo. La fuerza y compatibilidad se evaluaron sobre los derivados
reales, no por nombre de archivo.

| ID | Título | Categoría | Año | Ratio | Lectura visual | Uso anterior | Inicio | Total | Rel. |
| ---: | --- | --- | ---: | --- | --- | --- | ---: | ---: | ---: |
| 1 | Trío en la niebla | Fauna | 2023 | 1,34 H | Alta; cálida, grupo central; móvil/desktop buena | Capítulo Fauna | 1 | 2 | 0 |
| 3 | El ruido del cielo | Meteorología | 2024 | 2,17 H | Alta; mucho vacío y tensión; recorte móvil sensible | Expansiva | 1 | 2 | 1 |
| 4 | Silencio sobre la roca | Fauna | 2025 | 1,00 C | Media-alta; detalle y vacío; ambas buenas | Solo archivo | 0 | 1 | 5 |
| 5 | Banquete en el bosque | Fauna | 2025 | 1,00 C | Alta en detalle; textura; ambas buenas | Selected Work | 1 | 2 | 5 |
| 6 | Sevilla entre reflejos y alturas | Arquitectura | 2025 | 1,45 H | Alta; escala urbana; móvil exige recorte | Capítulo Arquitectura | 1 | 2 | 0 |
| 7 | Reflejo sereno | Fauna | 2025 | 0,67 V | Alta; sujeto aislado y sombra; móvil excelente | Solo archivo | 0 | 1 | 5 |
| 11 | Alas sobre púrpura | Fauna | 2025 | 1,00 C | Media-alta; color y detalle; ambas buenas | Solo archivo | 0 | 1 | 5 |
| 12 | Alas de otoño | Fauna | 2025 | 1,00 C | Media; textura cálida; ambas buenas | Solo archivo | 0 | 1 | 4 |
| 13 | Donde el lago abraza la tierra | Paisaje | 2025 | 0,67 V | Alta; profundidad y color; móvil excelente | Selected Work | 1 | 2 | 3 |
| 14 | Hero sin entrada de catálogo | Reservada | — | 1,50 H | Alta; vacío, niebla y texto; hero móvil/desktop | Hero | 1 | 1 | — |
| 16 | El centinela del océano | Paisaje | 2025 | 0,67 V | Alta; sujeto aislado; móvil excelente | Solo archivo | 0 | 1 | 5 |
| 17 | Guardianes del acantilado | Paisaje | 2025 | 1,61 H | Alta, pero demasiado próxima al hero 14 | Capítulo Paisaje | 1 | 2 | 5 |
| 19 | Puente hacia el alma de Oporto | Arquitectura | 2024 | 1,50 H | Alta; luminosa y panorámica; móvil sensible | Solo archivo | 0 | 1 | 3 |
| 21 | Última parada: la noche | Arquitectura | 2024 | 1,50 H | Alta; noche, figura y profundidad; ambas buenas | Selected Work | 1 | 2 | 4 |
| 23 | Luz, historia y espíritu navideño | Arquitectura | 2024 | 0,67 V | Media; luces densas; móvil buena | Solo archivo | 0 | 1 | 6 |
| 24 | Entre espirales y campanadas | Arquitectura | 2024 | 1,39 H | Media; gráfica nocturna; móvil buena | Solo archivo | 0 | 1 | 7 |
| 26 | La torre que vigila los sueños | Arquitectura | 2024 | 1,78 H | Alta; cielo negativo y silueta; móvil sensible | Solo archivo | 0 | 1 | 7 |
| 27 | Donde el cielo se encuentra con la ciudad | Arquitectura | 2024 | 1,66 H | Media-alta; figura y horizonte; móvil sensible | Solo archivo | 0 | 1 | 4 |
| 29 | La flecha dorada entre pasos urbanos | Arquitectura | 2024 | 0,71 V | Media; detalle gráfico; móvil buena | Solo archivo | 0 | 1 | 4 |
| 30 | Refugio entre montañas | Paisaje | 2024 | 0,67 V | Alta; capas, luz y escala; móvil excelente | Solo archivo | 0 | 1 | 5 |
| 31 | Aveiro, la Venecia portuguesa | Arquitectura | 2024 | 1,50 H | Alta; luminosa y cromática; móvil sensible | Solo archivo | 0 | 1 | 2 |
| 35 | El murmullo de Ordesa | Paisaje | 2022 | 0,67 V | Alta; detalle orgánico y contraste; móvil excelente | Selected Work | 1 | 2 | 2 |
| 37 | Donde termina el paso | Paisaje | 2025 | 1,00 C | Alta editorial; monocroma y táctil; ambas buenas | Solo archivo | 0 | 1 | 6 |
| 41 | Corte eléctrico sobre la ciudad | Meteorología | 2024 | 1,50 H | Alta atmosférica; muy oscura; móvil sensible | Capítulo Meteorología | 1 | 2 | 1 |
| 43 | La estación del silencio | Arquitectura | 2025 | 1,00 C | Media-alta; geometría y fuga; ambas buenas | Solo archivo | 0 | 1 | 7 |
| 44 | Rojo sobre asfalto | Personas | 2025 | 1,78 H | Alta; rojo, acción y figura; ambas buenas | Capítulo Personas | 1 | 2 | 1 |
| 46 | El acordeón y el abismo | Personas | 2025 | 0,81 V | Alta narrativa; figura y entorno; móvil excelente | Featured Story | 1 | 2 | 1 |
| 48 | Entrada imaginaria | Arquitectura | 2025 | 1,60 H | Alta gráfica; mucho vacío; ambas buenas | Solo archivo | 0 | 1 | 7 |
| 49 | Flores, sol y motor clásico | Arquitectura | 2025 | 1,59 H | Alta; luminosa, color y sujeto; ambas buenas | Selected Work | 1 | 2 | 6 |
| 50 | Entre ladrillos y cambio | Arquitectura | 2025 | 1,00 C | Alta documental; profundidad; ambas buenas | Solo archivo | 0 | 1 | 5 |
| 51 | Susurros del monasterio | Arquitectura | 2025 | 0,67 V | Alta; silueta, cielo y textura; móvil excelente | Selected Work | 1 | 2 | 4 |

Resumen anterior:

- 14 fotografías únicas antes del archivo, incluido el hero.
- Máximo narrativo: 1.
- Máximo contando archivo completo: 2.
- Repetidas dos veces: 1, 3, 5, 6, 13, 17, 21, 35, 41, 44, 46, 49 y 51.
- Repetidas tres o más veces: ninguna.
- Nunca usadas antes del archivo: 17 fotografías del catálogo.
- Arquitectura ocupaba 3/6 posiciones de Selected Work.
- Relacionadas: máximo global 7; IDs 1 y 6 nunca eran sugeridos, aunque el
  algoritmo excluía correctamente la fotografía actual.

## 3. Reglas de curación

1. Hero, Featured Story, expansiva, capítulos y Selected Work son mutuamente
   exclusivos.
2. Cada capítulo usa una obra de su categoría oficial.
3. Selected Work contiene cinco o seis IDs únicos y no reutiliza roles previos.
4. El índice usa solo obra inédita en la narrativa; es una miniatura funcional.
5. Una obra tiene una aparición preferente antes del archivo.
6. El archivo completo puede repetirla una vez; nunca se ocultan obras del
   catálogo.
7. El orden es editorial y explícito; ningún selector depende del orden accidental
   de objetos o de una traducción.
8. Una sustitución inválida rompe tests y build con un error accionable.

## 4. Configuración seleccionada

Fuente única: `lib/home/curation.ts`.

| Función | ID | Obra | Motivo |
| --- | ---: | --- | --- |
| Hero | 14 | Imagen reservada de Moher | Vacío para texto, escala y compatibilidad ya probada |
| Featured Story | 46 | El acordeón y el abismo | Presencia humana y relato autónomo |
| Expansiva | 3 | El ruido del cielo | Ratio panorámico y tensión a gran escala |
| Capítulo Fauna | 7 | Reflejo sereno | Vertical, pausa y contraste tras la expansiva |
| Capítulo Arquitectura | 48 | Entrada imaginaria | Gráfica, mínima y distinta de panoramas urbanos |
| Capítulo Paisaje | 30 | Refugio entre montañas | Vertical luminosa, sin repetir acantilados |
| Capítulo Personas | 44 | Rojo sobre asfalto | Acción y color frente al tono contemplativo de 46 |
| Capítulo Meteorología | 41 | Corte eléctrico sobre la ciudad | Segunda categoría real; uso separado de la expansiva |
| Selected 01 | 1 | Trío en la niebla | Año 2023, calor y escena animal horizontal |
| Selected 02 | 35 | El murmullo de Ordesa | Año 2022, vertical y textura orgánica |
| Selected 03 | 21 | Última parada: la noche | Año 2024, oscuridad urbana y presencia humana |
| Selected 04 | 37 | Donde termina el paso | Cuadrada, monocroma y cercana |
| Selected 05 | 49 | Flores, sol y motor clásico | Horizontal luminosa y cierre cromático |
| Índice | 11 | Alas sobre púrpura | Miniatura cuadrada, detalle y color inéditos |

## 5. Cambios por sección

- Hero: conserva 14.
- Featured Story: conserva 46.
- Expansiva: conserva 3.
- Capítulos: salen 1, 6 y 17; entran 7, 48 y 30. Se mantienen 44 y 41.
- Selected Work: salen 5, 13 y 51; entra 1, 37; se mantienen 35, 21 y 49.
  La sección baja de seis a cinco obras.
- Índice: incorpora 11 como única miniatura funcional.
- Archivo: conserva las 30 obras y el orden editorial previo.

## 6. Apariciones finales

Antes del archivo, los IDs `14, 46, 3, 7, 48, 30, 44, 41, 1, 35, 21, 37,
49, 11` aparecen una sola vez. Son 14 fotografías únicas, la misma cantidad que
antes de la fase. Al cargar el archivo completo, cada ID de catálogo puede aparecer
una segunda vez; el máximo final sigue siendo 2 y ninguna obra llega a 3.

## 7. Balance por categorías

La imagen 14 es editorial y no tiene categoría de catálogo. Entre las otras 13:

| Categoría | Apariciones | IDs |
| --- | ---: | --- |
| Fauna | 3 | 7, 1, 11 |
| Arquitectura | 3 | 48, 21, 49 |
| Paisaje | 3 | 30, 35, 37 |
| Personas | 2 | 46, 44 |
| Meteorología | 2 | 3, 41 |

Arquitectura deja de dominar Selected Work. Los cuatro años reales aparecen en
el recorrido: 2022, 2023, 2024 y 2025.

## 8. Ritmo visual

La secuencia principal alterna horizontal atmosférica, vertical humana,
panorámica oscura, vertical natural, arquitectura gráfica, paisaje vertical,
acción horizontal y noche. Selected Work sigue `H → V → H → C → H` y alterna
calidez, naturaleza, noche, monocromo y color. El índice cierra con detalle
cuadrado antes de abrir el archivo.

Los recortes sensibles se reservan para layouts amplios con sujeto central. Las
verticales 7, 30, 35 y 46 conservan información suficiente en móvil; 3 y 41
mantienen el foco eléctrico con `object-cover` y ratios conocidos.

## 9. Taxonomía

`Personas` es la única categoría oficial en tipos, catálogo, home, archivo,
fichas y diccionarios. `Retrato` deja de mostrarse y de existir como categoría.
El slug público `category=retrato` se conserva para no romper URLs. No se crea
una etiqueta editorial nueva.

## 10. Internacionalización

La curación guarda solo IDs. `getNarrativePhotos()` aplica
`getLocalizedPhotoContent()` para ES/EN antes de entregar datos a componentes.
Featured Story, expansiva, capítulos, Selected Work e índice reciben título,
descripción y alt localizados. Las categorías se muestran siempre mediante
`gallery.categories`; no se imprime el literal interno.

Quedan cubiertos explícitamente `El acordeón y el abismo` / `The accordion and
the abyss`, `El ruido del cielo` / `The sound of the sky`, títulos de Selected
Work, descripciones, alt y `Personas` / `People`.

## 11. Validaciones

`lib/home/validation.ts` comprueba:

- hero presente en `images-data.json`;
- IDs narrativos presentes en el catálogo;
- duplicados dentro de una sección;
- cualquier ID usado en más de una sección curada;
- capítulo ausente o categoría incorrecta;
- claves de categoría desconocidas;
- Selected Work con menos de cinco o más de seis obras.

`getHomeNarrativeData()` ejecuta la aserción durante desarrollo y generación
estática. Un conflicto produce, por ejemplo:

```text
photo-12 aparece en:
- hero
- featuredStory
- selectedWork

Máximo permitido en home: 1
```

La suite cubre existencia, exclusividad, orden, balance, taxonomía, ES/EN, alt,
fallback de metadata optimizada y mensajes de error sin snapshots grandes.

## 12. Relacionadas

El algoritmo continúa siendo contextual, determinista y excluye la obra actual.
Categoría, año y cercanía editorial mantienen prioridad. Ante dos alternativas
equivalentes, una penalización de desempate de `0.25` coloca después las grandes
protagonistas de la home. No hay azar, telemetría ni una lista duplicada.

## 13. Rendimiento

- 14 fotografías únicas antes del archivo: no aumenta la cifra anterior.
- Cinco elementos en Selected Work sustituyen a seis.
- Una miniatura de índice compensa esa reducción; el número de nodos narrativos
  de imagen no aumenta.
- Solo hero mantiene `priority`, `eager` y preload.
- Toda narrativa e índice siguen lazy, con `sizes`, ratio, blur y loader local.
- No hay dependencias, nuevos preloads, rutas, observers, timelines ni JS de
  selección en runtime.
- El archivo continúa con 12 tarjetas iniciales y carga progresiva 12→20→28→30.

## 14. Accesibilidad

Se conservan headings, enlaces reales, foco, teclado, orden DOM, reduced motion y
semántica principal. Cada imagen informativa tiene un alt localizado diferente
por idioma; categorías y títulos ya no se contradicen. La miniatura del índice es
un enlace con título visible y no se anuncia como decorativa.

## 15. Cómo sustituir una fotografía

1. Elegir un ID existente en `lib/gallery-data.ts`.
2. Confirmar ratio, recorte, año, categoría, luz y relación con imágenes vecinas.
3. Editar solo el ID correspondiente en `homeCuration`.
4. Si es capítulo, usar una obra de esa misma categoría.
5. No reutilizar ningún ID de hero, historia, expansiva, capítulos, Selected Work
   o índice.
6. Ejecutar `pnpm test`, `pnpm typecheck` y `pnpm build`.
7. Revisar ES/EN y 320–1920 px.

## 16. Cómo evitar duplicados

No copiar objetos fotográficos ni textos a componentes. La configuración contiene
IDs; catálogo, metadata y traducciones se cruzan en selectores. Si una obra ya
figura en otra clave, la validación bloquea el cambio. El archivo completo y la
navegación de ficha son excepciones explícitas, no otra fuente de curación.

## 17. Fallbacks

- Metadata optimizada ausente: datos editoriales del catálogo y ruta declarada.
- Recurso fallido en navegador: `/photos/optimized/800/1.webp`.
- Hero: fallback existente 46 si falla 14.
- Ficha o archivo: mantienen sus fallbacks previos.
- ID de curación inexistente: error de build; no se sustituye silenciosamente una
  decisión editorial rota.

## 18. Riesgos

- Meteorología solo tiene dos obras; ambas deben aparecer para representar la
  categoría, aunque compartan el motivo del rayo.
- Personas solo tiene dos obras; historia y capítulo consumen ambas.
- `object-cover` puede variar ligeramente entre ratios extremos; requiere revisión
  visual tras sustituir IDs.
- El fallback de hero 46 coincide con Featured Story solo durante un fallo real,
  no durante la experiencia normal.
- Relacionadas sigue favoreciendo categorías grandes; el desempate evita
  protagonistas cuando la relevancia es equivalente, no falsea contexto.

## 19. Preparación para Fase 13.2

La Fase 13.1 deja roles, IDs, orden y ratios estables para dirigir motion después.
La siguiente fase puede evaluar transiciones entre orientaciones y luminancias,
pero no debe reabrir curación, duplicar configuración ni convertir el índice en
otra galería. Esta entrega no añade motion, shaders, parallax, carruseles ni
scroll horizontal.
