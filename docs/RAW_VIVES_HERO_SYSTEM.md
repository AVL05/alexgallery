# Sistema de hero cinematográfico de RAW.VIVES

Este documento describe la implementación de Fase 4. El alcance termina en el
hero fotográfico de la home: no incorpora la narrativa, secciones fijadas ni
storytelling de Fase 5.

## 1. Concepto y objetivo

El hero funciona como portada editorial del archivo: una fotografía real ocupa
el viewport, la frase `Historias entre la luz y el silencio.` establece el tono
y un bloque técnico mínimo aporta autoría y escala. La composición busca
presencia cinematográfica sin convertir la fotografía en fondo decorativo.

Objetivos funcionales:

- conectar de forma explícita con la finalización u omisión de la intro;
- ofrecer acceso directo al archivo mediante `#gallery`;
- conservar contenido visible sin JavaScript o con movimiento reducido;
- mantener una imagen LCP local, responsive, estable y con fallback;
- validar la infraestructura GSAP con una entrada y un solo ScrollTrigger.

## 2. Fotografía seleccionada

La imagen principal es la entrada `14` de `images-data.json`:

```text
public/photos/optimized/original/14.webp
1500 x 1000 px
65 444 bytes
```

Se eligió porque su encuadre horizontal, profundidad atmosférica, contraste
mineral y espacio negativo permiten superponer texto sin ocultar el sujeto. La
entrada 14 ya estaba reservada editorialmente para hero/Open Graph y no forma
parte de las 30 fotografías navegables, por lo que no se altera el catálogo.

La imagen de respaldo es la entrada `46`, también local y optimizada. Si fallan
ambas, queda visible la superficie oscura del sistema visual. La configuración
vive en `lib/hero/config.ts`; nunca se depende de una URL remota.

## 3. Composición y jerarquía

El hero usa `100dvh` con fallback mínimo `100svh`, `overflow: hidden` y el
`Container` compartido. En escritorio la composición es asimétrica:

1. kicker `Archivo visual personal`;
2. un único `h1` display, dividido visualmente en dos máscaras;
3. descripción y CTA editorial;
4. indicación de scroll hacia `#about`;
5. metadatos reales: 30 fotografías, 2022–2025 y Valencia.

En móvil disminuye la densidad, el título puede ocupar más líneas y los
metadatos se reorganizan sin perder el CTA dentro del primer viewport. No hay
contenido que dependa de hover.

## 4. Texto e internacionalización

Todos los textos están en `dictionaries/es.json` y `dictionaries/en.json` bajo
`hero`. Las claves reales son:

```text
title, titleLineOne, titleLineTwo, eyebrow, description, cta, scroll,
photographs, location, imageAlt, featured_tag
```

ES usa `Historias entre la luz y el silencio.`; EN usa
`Stories between light and silence.`. Los datos numéricos y el rango temporal
se derivan de `lib/gallery-data.ts`, no de las traducciones.

## 5. Contraste y tratamiento de imagen

`HeroMedia` superpone dos degradados estáticos: uno vertical para separar la
navegación y los metadatos, y otro lateral para la zona del título. No usa blur,
filtros permanentes, canvas ni textura animada. La fotografía mantiene
`object-fit: cover` y `object-position: 50% 50%`.

## 6. Arquitectura de componentes

```text
components/hero/
  hero-section.tsx       orquestación, datos y estado de desarrollo
  hero-media.tsx         imagen LCP, fallback y estado de carga
  hero-content.tsx       semántica, título, CTA y metadatos
  use-hero-motion.ts     timeline y ScrollTrigger con scope local
lib/hero/
  config.ts              selección de imagen, facts y perfiles motion
  development.ts         eventos de preview solo en desarrollo
tests/hero/
  hero-system.test.ts    invariantes de contenido, imagen y motion
```

`components/hero.tsx` se conserva como punto de exportación compatible. El
layout no conoce detalles de GSAP ni de la imagen elegida.

## 7. Timeline de entrada

`useHeroMotion` crea una sola timeline scoped con `useGSAP`:

1. la capa de imagen pasa de escala `1.035` a `1` y de opacidad 0 a 1;
2. las dos líneas del título entran desde una distancia de 24 px;
3. kicker, descripción, CTA, scroll y metadatos aparecen con stagger corto;
4. se retira `will-change` y se informa el estado `settled`.

Duración nominal: 1,28 s en escritorio y 0,82 s en touch. El perfil reducido o
el modo `finalState` resuelve inmediatamente, sin timeline visible. Solo se
animan `transform` y `opacity`.

## 8. Integración con la intro

`IntroOverlay` publica una única resolución inicial mediante
`onInitialSettled(result)`, donde `result` es `completed`, `skipped` u
`omitted`. `HomeClient` mantiene `heroEntryReady=false` hasta recibir ese evento
y lo entrega al hero. No hay timeout arbitrario ni consulta duplicada a
sessionStorage.

- finalización normal: el hero comienza tras desmontar la intro;
- salto: la salida corta de intro termina y después habilita el hero;
- intro omitida: el callback `omitted` habilita el hero tras montar;
- cambio de idioma/navegación: la intro sigue omitida por sesión y el hero se
  inicializa una sola vez para la nueva página;
- reduced motion: la intro se omite y el hero queda en estado final.

El contenido se renderiza visible por defecto. Antes del handoff no queda
oculto por CSS, evitando un bloqueo si JavaScript falla.

## 9. Efecto de scroll

En escritorio con hover y sin reduced motion se crea exactamente un
ScrollTrigger del hero. Durante la salida del primer viewport:

- la capa de imagen alcanza escala `1.025` y `yPercent: 1.8`;
- el contenido se desplaza 22 px;
- el overlay incrementa ligeramente su densidad.

No hay pinning, scrub narrativo, scroll horizontal ni cambio de layout. En
touch y reduced motion el trigger no se crea. La navegación repetida ES/EN
mantuvo 19 triggers globales totales en cada ruta; el hero aporta uno y no se
duplica.

## 10. Limpieza y ciclo de vida

Las selecciones se limitan al `rootRef`. La timeline de entrada y la timeline de
scroll se matan en cleanup; `useGSAP` revierte su contexto y elimina el trigger
asociado. Los estilos temporales de `will-change` se restauran al completar o
desmontar. No se usa `ScrollTrigger.getAll().forEach()`.

## 11. Reduced motion, mobile y touch

`getHeroMotionProfile` combina `prefersReducedMotion` e `isTouchDevice` del
`MotionProvider`:

- reduced motion: sin desplazamientos, stagger, escala ni ScrollTrigger;
- touch: entrada más corta y menor distancia, sin efecto de scroll;
- escritorio: entrada completa y un efecto de scroll sutil;
- contenido, CTA y metadatos permanecen disponibles en todos los perfiles.

La altura usa unidades dinámicas seguras y los controles mantienen un área
táctil mínima de 44 px. Se validaron 320, 390, 768, 1024 y 1440 px sin
desbordamiento horizontal; la composición también se inspeccionó a 375 y 430 px
durante la iteración visual.

## 12. Imagen, LCP y ausencia de CLS

`HeroMedia` usa `next/image` con metadata local:

```tsx
<Image
  fill
  priority
  loading="eager"
  fetchPriority="high"
  sizes="100vw"
  placeholder="blur"
/>
```

El contenedor tiene dimensiones de viewport antes de cargar, por lo que la
imagen no cambia el layout. Las variantes generadas pesan 4 308 B (400 px),
14 912 B (800 px), 28 116 B (1200 px) y 65 444 B (original). El `onLoad`
solicita `refreshScrollTriggers()` sin medir continuamente el DOM.

La build estática confirma preload de la imagen 14, `fetchPriority="high"`, un
solo `h1`, 18 scripts y 1 018 040 bytes de JavaScript referenciado sin comprimir.
Respecto a la línea base de Fase 3 (1 012 180 B), el incremento es 5 860 B. No
se añadieron dependencias ni recursos remotos.

## 13. Accesibilidad y SEO

- existe un único `h1` con nombre accesible completo en ES y EN;
- las máscaras dividen la presentación, no el texto anunciado;
- la imagen tiene alt localizado y descriptivo;
- CTA e indicador de scroll son anchors reales;
- foco, tamaño táctil y contraste reutilizan el design system;
- reduced motion actúa también en JavaScript;
- la imagen y el contenido están presentes en el HTML estático.

## 14. Debug y referencia interna

Con `?motion-debug=1`, el panel de Fase 2 añade el bloque `Hero system`:

- fase, duración, estado de imagen, tipo de dispositivo y scroll;
- replay, estado final y simulación reduced motion;
- carga lenta y fallo de imagen;
- handoff de intro completada u omitida;
- preview en inglés;
- contador global de triggers.

Los eventos están definidos en `lib/hero/development.ts` y no se muestran en
producción.

## 15. Pruebas y validación

`tests/hero/hero-system.test.ts` comprueba:

- existencia y optimización de imagen principal y fallback;
- metadata y blur placeholder;
- facts derivados del catálogo;
- desactivación del scroll motion en touch/reduced motion;
- equivalencia de claves y contenido ES/EN.

Validación manual realizada: carga y salida de intro, salto, omisión por sesión,
reduced motion, fallback forzado, navegación repetida ES/EN, teclado, anchos
responsive, ausencia de overflow, scroll desbloqueado y consola sin errores
nuevos. La simulación de fallo cambia a `46.webp` sin desmontar el hero.

## 16. Cómo cambiar la fotografía

1. Añadir la fotografía al pipeline existente y regenerar
   `public/photos/optimized/images-data.json`.
2. Verificar que dispone de `src`, `width`, `height`, variantes y
   `blurDataURL`.
3. Cambiar `primaryId` en `lib/hero/config.ts`.
4. Mantener un `fallbackId` diferente y local.
5. Actualizar `imageAlt` en ambos diccionarios.
6. Revisar recorte en móvil/escritorio, contraste, LCP y build estática.

No se debe hardcodear una ruta fuera de la configuración ni reutilizar una
imagen sin metadata optimizada.

## 17. Riesgos y ajustes para Fase 5

- La fotografía elegida contiene la firma visual ya presente en el activo; una
  futura sustitución debe conservar la autorización y actualizar el alt.
- El conteo global de triggers crecerá cuando aparezcan secciones narrativas;
  debe mantenerse la propiedad local y evitar triggers por cada elemento.
- El handoff intro/hero es el contrato que Fase 5 debe reutilizar, no reemplazar
  con timers.
- Si el futuro hero comparte transformaciones con una sección narrativa, debe
  conservar capas separadas para entrada y scroll.
- Fase 5 puede ampliar la continuidad hacia la siguiente sección, pero no debe
  añadir pinning hasta medir contenido, touch, historial y reduced motion.

Esta fase no implementa la nueva home narrativa, WebGL, vídeo, cursor,
storytelling, secciones fijadas ni scroll horizontal.
