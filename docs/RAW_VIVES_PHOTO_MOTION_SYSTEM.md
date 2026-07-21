# RAW.VIVES — Sistema de motion fotográfico

## 1. Problema anterior

La interfaz tenía buenas piezas aisladas, pero demasiadas fotografías compartían
la misma entrada `opacity + translateY`. Featured Story creaba dos triggers, los
capítulos sustituían la imagen sin transición editorial y el archivo no distinguía
entre el bloque inicial y las nuevas cargas. El inventario medido en la home era de
23 ScrollTriggers activos en la carga inicial, 27 puntos de registro de listeners
y 13 usos de `requestAnimationFrame` en el código fuente.

## 2. Objetivo

Dar identidad a hero, reportaje, expansiva, capítulos, selección, archivo y ficha
con un vocabulario pequeño, determinista y progresivo. El contenido debe seguir
visible y navegable si falla JavaScript, GSAP, ScrollTrigger o View Transitions.

## 3. Gramática de motion

La gramática admite tres entradas (`mask-up`, `mask-side`, `soft-scale`), dos
hovers (editorial y funcional), dos transiciones de navegación (View Transition y
fade nativo), una expansiva y una secuencia exclusiva del hero. No se crean
efectos por fotografía ni se usa azar.

## 4. Tokens

`lib/motion/photo-motion.ts` centraliza duración, easing, distancia, escala,
stagger, umbral, intensidad móvil y reduced motion. Hero consume esos mismos
tokens mediante `lib/hero/config.ts`; fullscreen y capítulos también evitan
números locales de animación.

## 5. Variantes

- `mask-up`: verticales y Selected Work vertical.
- `mask-side`: horizontales, Featured Story y capítulos.
- `soft-scale`: cuadrados, archivo, índice, relacionadas y detalle.

La orientación se obtiene del ratio real. Los roles editoriales pueden fijar una
variante cuando su composición lo exige.

## 6. Hero

Conserva su máscara, escala sutil, texto posterior, scrub moderado y WebGL como
mejora progresiva. CSS y canvas no duplican el revelado. LCP permanece visible,
el CTA no se retrasa y reduced motion entrega el estado final sin canvas.

## 7. Featured Story

Una sola `PhotoMotionGroup` y una timeline editorial ordenan contenedor, máscara
lateral, título, metadata y CTA. Dura menos de 1,2 s, no fija el scroll y reduce
distancia e intensidad en móvil.

## 8. Imagen expansiva

Amplía el ScrollTrigger existente: el marco pasa de escala 0,84 a 1, reduce
`clip-path` y radio, ajusta overlay y presenta metadata dentro de la misma
timeline. No anima `width` ni `height`, mantiene ratio y focal point, y limita el
recorrido sticky. Touch usa versión corta; reduced motion muestra el estado grande.

## 9. Capítulos

Desktop utiliza un escenario de dos capas: activa y saliente. Un cambio mata los
tweens anteriores, cruza opacidad, desplaza pocos píxeles y evita flashes negros.
No existe timeline por hover. Móvil mantiene una fotografía por capítulo con
`mask-side`, sin hover ni canvas.

## 10. Selected Work

La variante se elige por ratio: vertical `mask-up`, horizontal `mask-side` y
cuadrada `soft-scale`. Una timeline por grupo limita el stagger y evita triggers
por tarjeta. Hover editorial escala el interior como máximo a 1,025 y mantiene
metadata, flecha, foco y cursor `VIEW`.

## 11. Archivo

El archivo conserva cero ScrollTriggers propios. Un único IntersectionObserver
observa anclas de bloques de seis. La carga inicial usa `soft-scale`; filtrar
aplica una opacidad breve sin vaciar el grid y «Cargar más» solo anima IDs nuevos.
El registro visto evita reanimar resultados antiguos al volver.

## 12. Transición a detalle

`PhotoTransitionLink` asigna `view-transition-name: archive-photo-{id}` solo al
enlace activado y navega de forma nativa cuando la API está disponible. Ctrl/Cmd,
Shift, Alt, clic central, `target` y descargas conservan el comportamiento web.
Sin API o con reduced motion se usa `next/link` sin retraso.

## 13. Detalle

Una timeline de montaje breve presenta fotografía, título, metadata, acciones y
contenido. Si existe una transición compartida pendiente, la foto no vuelve a
animarse. La duración total queda por debajo de un segundo y no hay scroll lock.

## 14. Anterior/siguiente

Los enlaces visibles conservan miniatura, título y flecha. Desktop desplaza texto
4 px y escala mínimamente la foto; móvil apila controles y usa feedback de presión.
No existen zonas invisibles de navegación.

## 15. Related photos

Reutiliza `soft-scale`, reveal por grupo, hover editorial y `PhotoTransitionLink`.
No añade gramática, carga ni triggers individuales.

## 16. Fullscreen

Apertura y cierre usan opacidad y escala mínima durante 280 ms; reduced motion
reduce la salida a 1 ms. La imagen grande sigue cargándose al abrir. Escape,
botón de cierre, focus trap, scroll lock y restauración del foco se conservan.

## 17. Comparador

El inventario continúa con cero procesos fotográficos auténticos publicados. La
primitiva de proceso solo recibe una entrada breve cuando existan datos reales.
El slider seguirá siendo nativo y controlado por el usuario: sin autoplay, scrub,
pinning ni demostración automática.

## 18. ScrollTrigger

La medición inicial de home baja de 23 a 21 triggers. Featured Story pasa de dos
triggers genéricos a uno editorial; los grupos usan un trigger por sección; el
archivo permanece en cero y reduced motion crea cero. Todos los contextos se
revierten al desmontar y no se llama `refresh()` durante animaciones.

## 19. Lenis

Sigue existiendo una sola instancia en `MotionProvider`. El sistema fotográfico
no crea listeners de scroll ni RAF propios, respeta locks y usa scroll nativo en
touch, reduced motion y forced colors.

## 20. View Transitions

Se usa la API nativa cross-document con `@view-transition { navigation: auto; }`.
No se activa la integración experimental de Next.js. El nombre es estable por ID,
solo una miniatura lo recibe y el fallback siempre es un enlace real.

## 21. Mobile

`mobileIntensity: 0.6` reduce distancias y escala; touch elimina hover, Lenis,
canvas y scrub no esencial. Capítulos y expansiva usan recorridos cortos, y nunca
se animan varias fotografías grandes de forma simultánea.

## 22. Reduced motion

El modo `static` entrega hero, expansiva, grupos, archivo y detalle en estado
final; desactiva escalas, canvas, ScrollTriggers fotográficos y View Transitions.
Fullscreen cierra casi instantáneamente y la jerarquía permanece en layout y tipo.

## 23. Progressive enhancement

HTML y CSS muestran las fotos por defecto. GSAP aplica el estado inicial solo
después de comprobar capacidades. Si GSAP o ScrollTrigger están desactivados o
fallan, se limpian estilos y se conserva el estado final. No existe `opacity: 0`
global ni overlay que bloquee enlaces.

## 24. Rendimiento

No se añadieron dependencias, imágenes, preloads, listeners por tarjeta ni
animaciones de layout. Los puntos de listener permanecen 27 → 27 y los usos RAF
bajan 13 → 12. La build comparada aumenta 1,64 % de JS bruto en home y 1,29 % en
detalle; el archivo sigue usando carga responsive/lazy y cero triggers propios.

## 25. Accesibilidad

El orden DOM, alt text, zoom, teclado y focus-visible no cambian. Los efectos no
son necesarios para comprender o activar controles. Fullscreen restaura foco y
los enlaces de transición no interceptan gestos de nueva pestaña.

## 26. Configuración

`photoMotionConfig` permite `enabled`, `mobileIntensity`, `revealOnce`,
`archiveBatchSize`, `viewTransitions`, `scrubs`, `debug` y
`reducedMotionMode`. Los parámetros internos de debug pueden desactivar motion,
GSAP, ScrollTrigger o View Transitions sin dispersar flags por componentes.

## 27. Primitivas

- `PhotoReveal`: atributos y máscara sin imponer datos fotográficos.
- `PhotoMotionGroup`: timeline y trigger agrupados con cleanup.
- `PhotoTransitionLink`: navegación progresiva por ID.
- `ChapterPhotoStage`: transición cancelable de dos capas.
- `useArchivePhotoMotion`: observador único y registro de bloques vistos.

No se creó una librería general ni wrappers que rompan `figure`, `img` o enlaces.

## 28. Debug

El panel interno muestra configuración, capacidad, intensidad, reveal once y
conteo de triggers. Los parámetros `photo-motion`, `photo-gsap`,
`photo-scrolltrigger`, `photo-vt`, `photo-reveal-once` y
`photo-mobile-intensity` permiten probar fallbacks. Sigue excluido de producción.

## 29. Tests

`tests/motion/photo-motion-system.test.ts` verifica variante por orientación,
configuración, intensidad móvil, reduced motion, reveal once, plan inicial y
append del archivo, nombres estables, fallback de View Transitions, modificadores,
GSAP/ScrollTrigger desactivados y contratos de cleanup. La suite evita snapshots.

## 30. Cómo elegir una variante

Usar primero el rol: reportaje y capítulo son laterales; archivo, relacionadas y
detalle son suaves. En Selected Work usar el ratio. No elegir por color, título,
locale ni índice, y no introducir azar.

## 31. Cómo añadir una nueva fotografía

Añadirla al catálogo y pipeline existentes, definir ratio/alt localizado y dejar
que `getPhotoRevealVariant()` resuelva la entrada. Solo añadir un rol si representa
una función editorial nueva ya aprobada; no crear un efecto para una obra.

## 32. Errores que deben evitarse

No ocultar contenido antes de inicializar JS; no crear triggers/listeners por
tarjeta; no animar layout o blur; no usar scrub en archivo, relacionadas,
comparador o controles; no interceptar nueva pestaña; no dejar `will-change`,
timelines o nombres de transición al desmontar.

## 33. Riesgos

La API cross-document depende del navegador y cae a navegación normal donde no
existe. El archivo vive al final de una home larga y su restauración depende del
historial del navegador. Las métricas de INP y memoria real requieren observación
de campo; las comprobaciones locales solo descartan regresiones evidentes.

## 34. Preparación para Fase 13.3

La siguiente fase puede consumir tokens, roles y métricas ya centralizados. No
debe ampliar el vocabulario sin eliminar una variante, añadir scrubs al archivo,
reactivar animaciones vistas ni alterar curación, shaders o taxonomía.

## 35. Ajuste de recorrido en la Fase 13.4

No se añaden variantes ni scrubs. Al retirar capítulos y cierre del orden público, la home baja de 20 a 17 ScrollTriggers medidos; archivo conserva cero triggers propios y el listener global delegado permanece en uno. Series y Selected Work reutilizan `PhotoMotionGroup`, reduced motion muestra estado final y el sistema de debug refleja el límite de cuatro obras.
