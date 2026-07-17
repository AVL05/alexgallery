# Sistema de motion de RAW.VIVES

Documento de referencia de la Fase 2. Describe la infraestructura implementada
sobre `alexgallery`; no autoriza la home narrativa, el hero final, secciones
pinneadas, scroll horizontal, WebGL ni motion cinematográfico de fases posteriores.

## 1. Objetivos

El sistema convierte el movimiento en una mejora progresiva: centraliza GSAP,
ScrollTrigger, Lenis, capacidades de dispositivo, reducción de movimiento,
bloqueo de scroll y cleanup. Las fotografías y el contenido siguen visibles si
una animación no se inicializa.

## 2. Principios de motion de raw.vives

- El movimiento orienta y establece jerarquía; nunca compite con una fotografía.
- Se anima principalmente `transform` y `opacity`.
- El contenido parte visible en HTML; GSAP prepara el estado inicial al montar.
- Touch utiliza distancias, staggers y duraciones menores.
- Reduced motion elimina desplazamiento, scroll suave y reveals ligados al scroll.
- Cada animación pertenece a un scope y se revierte al desmontar.

## 3. Dependencias

- `gsap` y ScrollTrigger: ya existían; no se reinstalaron ni actualizaron.
- `@gsap/react`: ya existía y ahora es el ciclo de vida estándar.
- `lenis`: ya existía y ahora tiene una única instancia global condicional.
- `framer-motion`: eliminado tras confirmar cero consumidores después del refactor.

No se instalaron plugins premium, SplitText, Framer Motion, Three.js ni una suite
de testing adicional.

## 4. Arquitectura de GSAP

`lib/motion/gsap.ts` es el único punto que importa y registra `useGSAP` y
`ScrollTrigger`. `registerMotionPlugins()` está protegido por un flag de módulo y
por `typeof window`, por lo que importar el archivo durante SSR no accede al DOM.

Los componentes importan siempre:

```tsx
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";
```

No se permite `gsap.registerPlugin()` dentro de componentes.

## 5. Registro de ScrollTrigger

ScrollTrigger se registra una vez. `MotionProvider` agrupa los refresh mediante
un único `requestAnimationFrame`, redimensiona Lenis y después ejecuta
`ScrollTrigger.refresh()`. Se refresca tras ruta/locale, cambio de preferencia,
orientación, fuentes e imágenes que usan `MotionImage` o la galería.

No existe ningún `ScrollTrigger.getAll().forEach(kill)`. La limpieza es local:
`useGSAP` revierte su contexto y `useBatchReveal` mata solo los triggers devueltos
por su propio `ScrollTrigger.batch()`.

## 6. Configuración de Lenis

La instancia vive únicamente en `MotionProvider`. Se habilita cuando coinciden:

- reduced motion desactivado;
- dispositivo no táctil;
- puntero fino;
- hover disponible.

Touch, coarse pointer y reduced motion conservan scroll nativo. La configuración
editorial es moderada: duración `1`, rueda `0.9`, `syncTouch: false`, anchors con
offset de navegación y `autoRaf: false`.

## 7. Integración GSAP-Lenis

Lenis utiliza el ticker existente de GSAP; no crea un segundo RAF. Su evento
`scroll` llama a `ScrollTrigger.update`. Al desmontar se eliminan el callback del
ticker y el listener, se destruye Lenis y se borra la referencia. No se modifica
globalmente `gsap.ticker.lagSmoothing()`.

## 8. Motion Provider

`components/motion/motion-provider.tsx` envuelve la aplicación desde
`app/layout.tsx` y expone:

```tsx
const {
  prefersReducedMotion,
  isTouchDevice,
  hasFinePointer,
  hasHover,
  isSmoothScrollEnabled,
  isScrollLocked,
  lockScroll,
  pauseScroll,
  resumeScroll,
  refreshScrollTriggers,
  scrollTo,
  getActiveTriggerCount,
} = useMotion();
```

## 9. Hooks disponibles

- `useMediaQuery(query)`: `useSyncExternalStore`, snapshot SSR `false` y un solo
  listener compartido por query.
- `useReducedMotion()`: consulta reactiva de la preferencia del sistema.
- `useDeviceCapabilities()`: coarse/fine pointer, hover y touch points; no deduce
  capacidad solo por ancho.
- `useBatchReveal(ref, selector, dependency)`: reveal agrupado y cleanup local.
- `useGSAP`: se reexporta centralmente y siempre recibe `scope`.

## 10. Utilidades

- `lib/motion/config.ts`: duraciones, easings, distancias, staggers, queries y Lenis.
- `media-query-store.ts`: suscripción compartida y cleanup al último consumidor.
- `scroll-lock.ts`: coordinación con múltiples overlays mediante sources.
- `will-change.ts`: aplica y restaura `will-change` solo durante el tween.

## 11. Primitivas

- `Reveal`: entrada por viewport semántica y configurable.
- `StaggerGroup`: un trigger para pequeños grupos marcados con `data-motion-item`.
- `MaskReveal`: reveal contenido mediante wrapper con overflow.
- `AnimatedDivider`: `scaleX` desde el borde izquierdo.
- `MotionText`: división limitada por palabra o línea con `aria-label` completo.
- `MotionImage`: frame estable, evento de carga, refresh y capa animable.

## 12. Duraciones

| Token | Segundos | Uso |
| --- | ---: | --- |
| `instant` | 0.01 | fallback funcional |
| `fast` | 0.18 | cierre y feedback breve |
| `normal` | 0.42 | UI y touch |
| `slow` | 0.72 | reveals editoriales |
| `cinematic` | 1.05 | loader actual; no storytelling |

## 13. Easings

- `standard`: `power2.out`.
- `enter`: `power3.out`.
- `exit`: `power2.in`.
- `cinematic`: `power4.inOut`, reservado.
- `linear`: `none`, solo para progreso ligado a scroll.

## 14. Distancias

`label` 8 px, `compact` 16 px, `section` 28 px e `image` 36 px. Touch limita
normalmente los desplazamientos a 6–14 px. No se crean desplazamientos de viewport.

## 15. Staggers

`tight` 0.035 s, `normal` 0.07 s y `relaxed` 0.1 s. En grupos touch se usa 0.025 s.
No se aplican staggers largos a colecciones grandes.

## 16. Reglas para texto

`MotionText` conserva el texto completo en `aria-label` y marca los spans visuales
como `aria-hidden`. La segmentación por palabras conserva espacios y puntuación;
la segmentación por línea solo usa saltos explícitos. No se utiliza SplitText y no
se aplica a cuerpos largos, traducciones completas ni contenido SEO crítico.

## 17. Reglas para imágenes

`MotionImage` reserva el frame antes de cargar, mantiene `object-fit` decidido por
el consumidor, conserva blur/alt/sizes y llama al refresh tras `onLoad`. La escala
máxima de entrada es 1.025 y se elimina el estilo inline al terminar. La galería
actual no se ha migrado completamente: conserva `next/image` y solo añade refresh.

## 18. Reglas para scroll

- Una instancia Lenis, un ticker y scroll nativo en touch/reduced.
- Anchors conservan offset de 80 px.
- El historial y back/forward no se interceptan ni fuerzan a scroll 0.
- Los cambios de ruta refrescan medidas; los contextos anteriores se desmontan.
- No hay pinning, scrub narrativo, scroll horizontal ni proxy de scroller.

## 19. Overlays

`ScrollLockManager` identifica cada bloqueo por source. Menú, lightbox, intro y
debug pueden coexistir: Lenis solo se reanuda cuando desaparece el último lock.
El atributo `data-scroll-locked` bloquea el scroll nativo y sustituye la antigua
lógica exclusiva `data-menu-open`.

```tsx
useEffect(() => {
  if (!open) return;
  return lockScroll("gallery-lightbox");
}, [lockScroll, open]);
```

El menú conserva focus trap, Escape y retorno de foco; su apertura/cierre usa una
transición breve. El lightbox mantiene su gestión de foco propia.

## 20. Mobile y touch

Lenis queda desactivado, los batch se limitan a dos elementos y las distancias se
reducen. El hero usa una entrada de 0,82 s pero no crea su efecto de scroll en
touch. No existe lógica dependiente de hover ni media queries por modelo de
dispositivo.

## 21. Reduced motion

La preferencia se observa en JavaScript y CSS. Cuando está activa:

- Lenis no se crea;
- Reveal/Stagger/Mask/Divider/MotionImage muestran el estado final;
- el hero resuelve inmediatamente y no crea su ScrollTrigger;
- la intro se omite y los cambios de ruta se resuelven inmediatamente o casi;
- `scrollTo` usa comportamiento `auto`;
- las transiciones CSS se reducen a 0.01 ms.

Cambiar la preferencia destruye o crea Lenis, revierte contextos dependientes y
refresca ScrollTrigger.

## 22. Limpieza y ciclo de vida

Usar `useGSAP({ scope, dependencies, revertOnUpdate: true })`. Nunca seleccionar
fuera del scope. Los listeners de media query se eliminan al último consumidor;
orientation, ticker, Lenis, frames pendientes y locks se limpian al desmontar.

## 23. Rendimiento

- Transform/opacity como propiedades animadas principales.
- `will-change` temporal; no hay reglas globales permanentes.
- Galería utiliza `ScrollTrigger.batch` y como máximo cuatro entradas por lote.
- No se añade un framework UI ni otro motor motion.
- Framer Motion se elimina para evitar dos runtimes compitiendo por transforms.
- Debug no renderiza en producción.

## 24. Debug

En desarrollo, `?motion-debug=1` muestra un panel no indexable porque no crea una
ruta: reduced motion, touch, hover, Lenis, lock, contador de triggers y refresh.
También contiene la referencia visual de primitivas solicitada. Añadir
`&motion-markers=1` activa markers únicamente en primitivas individuales; nunca
en producción ni en el batch de galería.

## 25. Ejemplos

```tsx
<Reveal as="header">
  <h1 className="rv-page-title">Archivo</h1>
</Reveal>
```

```tsx
<StaggerGroup as="dl">
  <div data-motion-item>...</div>
  <div data-motion-item>...</div>
</StaggerGroup>
```

```tsx
const { lockScroll } = useMotion();
useEffect(() => open ? lockScroll("overlay-name") : undefined, [open, lockScroll]);
```

## 26. Errores que deben evitarse

- Registrar plugins en componentes.
- Crear Lenis por página o su propio RAF.
- Ejecutar `ScrollTrigger.getAll().forEach(kill)` al navegar.
- Selectores globales o triggers que apunten fuera del scope.
- Ocultar contenido mediante CSS a la espera de JavaScript.
- Dejar `will-change`, markers o filtros costosos permanentemente.
- Usar ancho como única señal de touch.
- Animar width/height/top/left cuando un transform resuelve el efecto.

## 27. Integración de Fases 3 y 4

`RAW.VIVES SYSTEM` consume `useMotion`, reutiliza un lock con source propia y crea
una timeline scoped. La home permanece en HTML, reduced motion omite la secuencia
y el overlay sale del DOM al finalizar. El contrato completo está en
`RAW_VIVES_INTRO_SYSTEM.md`.

El hero de Fase 4 espera el callback inicial `completed | skipped | omitted` de
la intro. Su entrada dura 1,28 s en escritorio y 0,82 s en touch; reduced motion
queda en estado final. Crea un solo ScrollTrigger scoped en escritorio para una
escala y traslación mínimas, sin pinning. Entrada y scroll usan capas distintas
para evitar competir por `transform`; ambas timelines se matan al desmontar.

La referencia completa está en `RAW_VIVES_HERO_SYSTEM.md`. La siguiente fase no
debe duplicar el gate, crear otro loader ni alterar la única instancia Lenis. El
pinning, storytelling y las secuencias de imágenes siguen fuera del alcance.

## 28. Futuro WebGL

WebGL debe llegar como chunk cliente dinámico aislado, tras feature detection,
presupuesto de memoria y fallback `MotionImage`. Debe apagarse en reduced motion,
touch problemático, ahorro de datos y pérdida de contexto. ScrollTrigger/Lenis no
deben depender del canvas para conservar navegación y contenido.

## Validación automatizada de Fase 2

`tests/motion/motion-infrastructure.test.ts` cubre listener único y cleanup de
media queries, reduced-motion snapshot, locks anidados, restauración de
`will-change`, import SSR de GSAP y reversión de contextos. Se ejecuta con
`pnpm test` usando Node Test Runner mediante la dependencia `tsx` ya existente.

## Aplicación en la home narrativa de la Fase 5

`ExpansivePhoto` añade un único scrub propio. El contenedor sticky lo resuelve
CSS y GSAP interpola solo `scale` entre 0.82 y 1. El trigger pertenece al scope
del componente, se revierte mediante `useGSAP` y retira `will-change`. Touch y
reduced motion no crean este trigger.

Las demás secciones reutilizan `Reveal` y `StaggerGroup`; no se añaden loops,
instancias Lenis ni listeners de scroll. La configuración y los límites están
documentados en `RAW_VIVES_HOME_NARRATIVE.md`.

## Aplicación al archivo de la Fase 6

El archivo no crea ScrollTriggers ni observers propios. Cambios de filtro y carga
progresiva solicitan un refresh agrupado al `MotionProvider`; el panel móvil usa
el lock compartido `archive-mobile-filters`. La restauración vuelve a una posición
numérica mediante el `scrollTo` central, que elige Lenis o scroll nativo.

No hay batch reveal al filtrar, pinning, scrub, parallax ni animación de layout.
Reduced motion desactiva transiciones visibles y View Transitions sin alterar la
estructura. Véase `RAW_VIVES_ARCHIVE_SYSTEM.md`.

## Aplicación al detalle de la Fase 7

La ficha no crea Lenis, ScrollTriggers, timelines ni observers. Imagen de archivo
y ficha comparten un `view-transition-name` por ID como mejora progresiva; sin API
la navegación es normal y reduced motion la desactiva. Fullscreen reutiliza el
lock central y restaura foco al cerrar. Véase
`RAW_VIVES_PHOTO_DETAIL_SYSTEM.md`.

## Aplicación al proceso creativo de la Fase 8

El slider no usa GSAP, ScrollTrigger, Lenis ni RAF: un range nativo escribe una
propiedad CSS. No hay autoplay, scrub, pinning, parallax ni loop. Pointer capture
solo ocurre tras gesto horizontal; `touch-action: pan-y` conserva scroll. Reduced
motion elimina cualquier transición sin desactivar range, tabs, teclado, reset o
fullscreen. El overlay reutiliza el lock central y limpia listeners al desmontar.

## Aplicación al sistema de interacción de la Fase 9

El cursor usa un único `pointermove`, `quickSetter` para el punto y `quickTo` para
la superficie. No actualiza posición en React, no usa ScrollTrigger y solo crea un
RAF al desplazar la página para resolver el target estacionario. `Magnetic` mide
al entrar, transforma una capa interior y limpia tweens/`will-change` al salir.
Reduced motion mantiene cursor nativo; teclado neutraliza magnetismo. Los locks
de overlay y Lenis continúan bajo `MotionProvider`.
