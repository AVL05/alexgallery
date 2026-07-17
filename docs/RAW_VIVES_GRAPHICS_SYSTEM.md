# Sistema gráfico RAW.VIVES

## 1. Objetivo

La Fase 10 añade profundidad perceptiva al hero sin sustituir fotografía, HTML ni navegación. El efecto es decorativo y reversible: obra, contenido y LCP existen antes y después del renderer.

## 2. Opción elegida

Una única experiencia: distorsión UV sutil sobre la fotografía principal del hero. Responde al puntero y al primer scroll; no hay partículas, transición entre obras ni ruido temporal.

## 3. Justificación artística

El desplazamiento evoca la bruma y el borde del acantilado de la fotografía 14. Su amplitud es pequeña para percibirse como profundidad, no como filtro técnico.

## 4. WebGL o WebGPU

Se usa Three.js sobre WebGL. WebGPU se detecta y telemetra, pero no mejora un plano, una textura y un shader breve; exigirlo reduciría compatibilidad.

## 5. Dependencias

Runtime: `three@0.185.1`. Desarrollo: `@types/three@0.185.1`. Sin React Three Fiber, Drei, postprocesado, mapas de desplazamiento, vídeo ni recursos remotos.

## 6. Arquitectura

`HeroMedia` mantiene la imagen y monta un bootstrap pequeño. Este decide capacidades y solo entonces importa el runtime. `lib/graphics/` contiene configuración, capacidades, señales, cover, shaders, telemetría y contextos.

## 7. Componentes

- `HeroGraphicsBootstrap`: espera imagen, intro y decisión cliente.
- `HeroWebglEffect`: posee canvas, escena, observers, textura y cleanup.
- `MotionDebugPanel`: telemetría y controles solo de desarrollo.

## 8. Renderer

`THREE.WebGLRenderer` usa alpha, sin antialias, preferencia de alto rendimiento y sRGB. La escena contiene cámara ortográfica y un único mesh.

## 9. Canvas

Es absoluto, decorativo, `aria-hidden`, no enfocable y `pointer-events:none`. Empieza transparente y solo aparece después del primer frame. No existe en SSR, reduced motion, Save-Data ni touch primario.

## 10. Shader

El vertex shader transmite UV. El fragment shader desplaza la muestra alrededor del puntero con falloff y añade una curvatura vertical mínima por scroll. Sin reloj, glitch, RGB split, bloom o postprocesado.

## 11. Uniforms

`uTexture`, `uPointer`, `uCover`, `uPointerIntensity`, `uScroll`, `uScrollIntensity` y `uRadius`. Solo cambian con puntero, scroll, tamaño, calidad o debug.

## 12. Textura

Reutiliza `OptimizedImageData.src` de la imagen HTML activa: `/photos/optimized/original/14.webp` o el fallback real. Aprovecha caché HTTP y no duplica assets.

## 13. Aspect cover

`getCoverTransform()` calcula escala y offset UV con dimensiones reales. Reproduce `object-fit: cover` para ratios horizontales, verticales y cuadrados, con identidad ante entradas inválidas.

## 14. Interacción de puntero

El runtime no registra `pointermove`. `CursorLayer`, dueño del único listener global, publica coordenadas; el hero las normaliza a UV y recentra el objetivo al salir.

## 15. Interacción de scroll

El `ScrollTrigger` existente del hero publica progreso normalizado. El efecto no crea otro trigger, listener de scroll ni instancia de Lenis.

## 16. Render loop

No hay loop ambiental. Un RAF nace con una señal, interpola mediante damping y se detiene al cruzar epsilons. La telemetría se limita a cuatro publicaciones por segundo.

## 17. Visibilidad

`IntersectionObserver` pausa fuera del hero y `visibilitychange` en pestaña oculta. Un overlay bloqueante pausa el render; al liberarse pide un frame.

## 18. DPR

Se limita a 1,5 en full y 1 en reduced. `ResizeObserver` actualiza tamaño físico y cover sin listener global de resize.

## 19. Calidad

Full usa malla 24×16 e intensidad 0,012. Reduced usa 12×8, DPR 1 e intensidad 0,007. Disabled conserva HTML/CSS.

## 20. Detección de capacidades

Considera WebGL/2, contexto real, WebGPU informativo, punteros, hover, touch, reduced motion, Save-Data, memoria, concurrencia, viewport y DPR. Reduced y Save-Data se resuelven antes del canvas de prueba.

## 21. Touch

Puntero primario coarse sin fine ni hover queda disabled. Un híbrido capaz puede recibir reduced. El ancho no decide por sí solo.

## 22. Reduced motion

`prefers-reduced-motion: reduce` evita canvas final y prueba WebGL. Imagen, copy, CTA, foco y scroll permanecen completos.

## 23. Save-Data

`navigator.connection.saveData` desactiva antes de sondear GPU o cargar Three. No solicita textura ni chunk gráfico.

## 24. Progressive enhancement

Orden: HTML e imagen prioritaria; intro asentada; imagen cargada; decisión cliente; import dinámico; textura; primer frame; fade. Cualquier fallo detiene la cadena sin retirar contenido.

## 25. Fallback

La imagen HTML permanece debajo con WebGL activo. Error de capacidad, shader, textura, timeout o contexto mantiene canvas transparente y fotografía visible.

## 26. Integración con intro

`entryReady` procede de `IntroOverlay`. No hay renderer con intro pendiente y no se modifica timeline, persistencia, skip, safety timeout o cursor nativo.

## 27. Integración con hero

El canvas vive en `data-hero-scroll-media` y comparte su transformación. El gradiente sigue encima (`z:2`) y el contenido en `z:10`.

## 28. Integración con cursor

El cursor conserva listener, targets, modalidad y presentación. La señal usa refs sin estado React por frame y limpia suscriptores.

## 29. Integración con Lenis

Lenis sigue bajo `MotionProvider`; el efecto no usa su ticker. Consume el progreso ya calculado por ScrollTrigger.

## 30. Integración con overlays

`isScrollLocked` pausa RAF durante menú, filtros o fullscreen. No cambia z-index, focus trap, Escape, lock o retorno de foco.

## 31. Cambio de ruta

Solo se monta en el hero de home. Al salir cancela RAF, señales, observers, eventos y GPU; fichas y política no contienen este canvas.

## 32. Cambio de idioma

ES y EN reutilizan renderer y fotografía, sin copy nuevo. La carga directa crea un contexto único y mantiene exportación estática.

## 33. Context loss

`webglcontextlost` cancela RAF, oculta canvas y conserva fallback. `webglcontextrestored` recalcula tamaño y pide un frame. Desarrollo permite simularlo.

## 34. Error de textura

`TextureLoader` tiene error explícito y timeout de 8 s. Activa fallback sin reintentos infinitos y nunca oculta HTML.

## 35. Limpieza

Desconecta señales, observers, eventos y RAF. Retira mesh y libera geometría, material, textura, listas y renderer.

## 36. Gestión de GPU

El renderer siempre se dispone. La pérdida irreversible se difiere un macrotask: Strict Mode puede cancelarla al remontar; un unmount real la ejecuta. El registro es idempotente.

## 37. Rendimiento

Build: 70 páginas; home ES 194.340 B HTML, 18 scripts y 1.030.867 B JS inicial. Frente a Fase 9: +242 B HTML, +1 script y +4.943 B JS. Chunk diferido: 531.291 B raw, 132.520 B gzip y 108.370 B Brotli. Estable: una draw call, una textura, un contexto y cero RAF continuo.

## 38. Accesibilidad

Canvas decorativo, fuera del árbol accesible y no interactivo. No reemplaza alt, enlaces, headings, foco o teclado. Reduced y Save-Data reciben la experiencia completa sin efecto.

## 39. Responsive

El cover usa dimensiones reales y no genera overflow. Matriz revisada: 320, 375, 390/430, 768, 1024, 1280, 1440 y 1920 px; touch a 390×844 mantuvo una imagen, cero canvas y cero overflow.

## 40. Debug

`?motion-debug=1` muestra estado, renderer, calidad, razón, APIs, DPR, FPS bajo demanda, frames, draw calls, triángulos, textura, visibilidad, overlay, contexto, capacidades, memoria, cores, viewport y fuente. Controles: toggle, calidad, intensidad y context loss.

## 41. Configuración

`lib/graphics/config.ts` centraliza timeout, DPR, segmentos, intensidades, damping, radio, epsilons, fade y margen del observer.

## 42. Pruebas

La suite cubre calidad, fallbacks, cover, señales, cleanup, Strict Mode, carga dinámica, rutas, listeners/triggers únicos, observers, context loss/restored, disposición GPU y configuración. Total: 60/60.

## 43. Cómo sustituir la fotografía

Cambiar `heroImageConfig.primaryId` por un ID real y ejecutar el pipeline si el recurso cambió. `HeroMedia` entrega src y dimensiones; no duplicar rutas.

## 44. Cómo ajustar intensidad

Editar solo intensidades full/reduced en `graphicsConfig`. Mantener full ≤0,015 y revisar bordes del cover y zoom 100/200 %.

## 45. Cómo desactivar el efecto

Establecer `graphicsConfig.enabled=false`. En desarrollo, Toggle valida fallback. No retirar la imagen HTML.

## 46. Cómo añadir un nuevo renderer

Crear un bootstrap independiente con los mismos contratos de decisión, carga, fallback, signals, observers y cleanup. No compartir contexto mutable entre rutas.

## 47. Riesgos

Three añade un chunk diferido relevante; drivers pueden perder contexto; la subida GPU depende de la imagen; memoria y Save-Data no existen en todos los navegadores; híbridos reportan capacidades desiguales.

## 48. Limitaciones

No se mide GPU time de forma portable, WebGPU solo se informa, no hay transición entre fotos y la captura automatizada de canvas depende de visibilidad de pestaña.

## 49. Preparación para Fase 11

Capacidades, señales, calidad y cleanup quedan aislados para una decisión futura, pero esta entrega no implementa, activa ni define alcance de Fase 11.

## 50. Integración completada por la Fase 11

Forced Colors forma parte de la decisión previa al runtime: no se sondea ni monta
el canvas. Three continúa diferido y fuera del JS inicial; el chunk final mide
531.315 B raw. Reduced motion y Forced Colors se verificaron con 0 canvas y la
imagen HTML intacta.
