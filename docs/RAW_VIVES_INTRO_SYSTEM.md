# Sistema de intro cinematográfica de RAW.VIVES

Documento de referencia de la Fase 3. La intro reemplaza completamente el antiguo
`System Initializing` sin construir la home narrativa, el hero final, scroll
storytelling, pinning, vídeo, canvas ni WebGL.

## 1. Concepto

`RAW.VIVES SYSTEM` presenta el archivo como un sistema editorial que indexa
memoria visual. Combina `raw.vives`, el descriptor localizado, la autoría, cuatro
campos técnicos discretos y una línea de progreso. La estética es la de una
cartela de archivo en una sala oscura, no una terminal hacker ni un loader gamer.

## 2. Objetivo

La secuencia ofrece una apertura reconocible solo en la primera entrada a la home
durante una sesión. Es breve, saltable, no espera todas las fotografías y nunca
es requisito para acceder al HTML principal.

## 3. Auditoría de la implementación reemplazada

La intro anterior vivía en `components/loading-screen.tsx` y era montada desde
`app/[locale]/home-client.tsx`. `HomeClient` controlaba `isLoading` y
`showContent`; `use-image-preloader.ts` cargaba cuatro WebP originales y actualizaba
React por cada imagen.

- Duración: dependía de esas cuatro imágenes, un delay de 350 ms y una salida de
  1,05 s; un timer exterior forzaba la home tras 5 s.
- Progreso: real por número de imágenes terminadas o fallidas, no por bytes.
- Scroll: `lockScroll("loading-screen")` lo bloqueaba mientras el componente vivía.
- Navegación: no bloqueaba los datos, ya renderizados debajo, pero cubría la UI.
- Frecuencia: aparecía en cada montaje de `/{locale}`; se confirmó que reaparecía
  al volver desde una foto y al cambiar `/es` por `/en`.
- Persistencia y skip: no usaba storage y no ofrecía botón de salto.
- Motion: tres efectos GSAP, un tween separado para width y progreso React.
- SEO/resiliencia: la Fase 2 ya mantenía la home en HTML, pero la intro no tenía
  criterio de ruta/sesión ni expiración anterior a hidratación.

Los dos archivos antiguos se eliminaron al quedar sin consumidores. No existen
dos loaders simultáneos.

## 4. Estructura visual

- Marca dominante: `raw.vives` en Prata.
- Descriptor: `Archivo visual` o `Visual Archive`.
- Autor: `por/by Alex Vicente`.
- Estado: `Sistema/System 001`, Valencia, índice y memoria activa.
- Progreso: línea de un píxel, estado localizado y contador `000–100`.
- Acción: botón semántico `Saltar introducción` / `Skip intro`.
- Fondo: `--color-background` y grano SVG estático de opacidad 0,018.

En móvil se muestran dos campos técnicos; tablet añade índice y escritorio añade
memoria activa. La marca y el progreso conservan espacio propio sin depender de
imágenes.

## 5. Secuencia de animación

La timeline normal dura **2,64 s**:

| Tiempo | Acción |
| ---: | --- |
| 0,05 s | Entran metadatos con 8 px de desplazamiento |
| 0,12 s | Aparece el sistema de progreso |
| 0,16–1,31 s | Progreso coreografiado `000 → 072` |
| 0,38–1,06 s | Entra `raw.vives` con 24 px de desplazamiento |
| 0,68–1,10 s | Aparecen descriptor y autor |
| 1,31–1,75 s | Progreso `072 → 100` |
| 1,48–1,80 s | Cambia a `Sistema/System ready` |
| 1,92–2,18 s | Sale el contenido técnico |
| 2,02–2,64 s | Los paneles superior e inferior revelan la home |

No hay rebotes, rotaciones, blur, flashes, aleatoriedad ni animación continua.

## 6. Duraciones

- Secuencia normal: `introTiming.normal`, 2,64 s.
- Salto: `introTiming.skip`, 0,32 s.
- Vista reducida de desarrollo: `introTiming.reduced`, 0,20 s.
- Timeout de seguridad: `introTiming.safetyTimeout`, 3,40 s.
- Simulación lenta de desarrollo: 5,50 s con timeout ampliado a 7,20 s.

## 7. Timeline

`components/intro/use-intro-sequence.ts` crea una sola timeline scoped mediante
el `useGSAP` central de `lib/motion/gsap.ts`. El progreso anima un objeto GSAP y
escribe contador/escala directamente en refs; no produce renders React a 60 fps.

El salto mata la timeline principal y crea una salida de 320 ms. Ambas timelines
se matan al desmontar. `will-change` solo se aplica a marca y paneles mientras la
secuencia existe y se restaura en cleanup.

## 8. Componentes

```text
components/intro/
  intro-bootstrap-script.tsx  # decisión visual anterior a hidratación
  intro-overlay.tsx           # gate, ciclo de vida y coordinación global
  intro-brand.tsx             # marca, descriptor y autor
  intro-metadata.tsx          # campos técnicos responsive
  intro-progress.tsx          # línea, estado y contador
  intro-skip-button.tsx       # acción accesible
  use-intro-sequence.ts       # timeline y salida abreviada
lib/intro/
  bootstrap.ts                # script inline seguro
  constants.ts                # clave, estados y tiempos
  development.ts              # eventos solo de desarrollo
  lifecycle.ts                # timer de seguridad limpiable
  persistence.ts              # sesión y decisión pura
```

## 9. Estados

`IntroPhase` admite `checking`, `playing`, `exiting`, `completed` y `skipped`.
Un guard con ref impide finalizar dos veces. El overlay se elimina del DOM tras
`completed` o `skipped`; el progreso y las timelines no sobreviven al desmontaje.

## 10. Persistencia

La clave es `raw-vives:intro-seen` en `sessionStorage`, con valor `1`. Se marca al
iniciar, no al terminar, para impedir que un cambio de idioma o ruta durante la
secuencia la reactive. Una nueva sesión puede volver a mostrarla.

Si `sessionStorage` no está disponible o lanza una excepción, la decisión segura
es omitir la intro. No se usan cookies ni `localStorage`.

## 11. Criterios para mostrarla

Se muestra cuando coinciden todos estos criterios:

1. Ruta exacta `/es`, `/es/`, `/en` o `/en/`.
2. Sesión accesible y todavía no marcada.
3. `prefers-reduced-motion` desactivado.
4. Navegación no automatizada.
5. Bootstrap no expirado.

## 12. Criterios para omitirla

- Rutas de fotografía, política, 404 o landing raíz.
- Navegación interna, atrás/adelante o cambio de idioma en la misma sesión.
- Entrada ya vista, reduced motion o `navigator.webdriver`.
- Storage bloqueado, bootstrap expirado o fallo controlado de inicialización.
- JavaScript desactivado: no existe overlay y la home permanece en HTML.

## 13. Botón de salto

`IntroSkipButton` es un `<button>` de 44 px mínimos, visible desde el primer frame,
traducido y con foco global visible. Click o Escape interrumpen la timeline, llevan
el progreso a 100 y ejecutan la salida por paneles en 320 ms. Pulsaciones repetidas
no duplican callbacks. Si el foco estaba dentro del overlay, se restaura en
`#main-content` sin cambiar el scroll.

## 14. Integración con Motion Provider

La intro consume `useMotion`; no crea provider, store ni loop. Usa
`lockScroll`, `refreshScrollTriggers` y la preferencia central. Al terminar solicita
un único refresh agrupado por el provider.

## 15. Integración con Lenis

El lock `raw-vives-intro` entra en `ScrollLockManager`. Si Lenis está activo, se
detiene; en touch o reduced se bloquea el scroll nativo mediante
`data-scroll-locked`. El release es idempotente y Lenis solo vuelve a arrancar
cuando no queda otro overlay activo.

## 16. Integración con ScrollTrigger

La intro no crea ScrollTriggers. Al desaparecer solicita refresh para que hero,
galería y footer midan la página ya interactiva. No mata triggers globales.

## 17. Reduced motion

En uso real la intro se omite por completo: no hay smooth scroll nuevo, contador,
máscara ni espera. La simulación de desarrollo permite comprobar el fallback
estático de 200 ms sin alterar la preferencia del sistema.

## 18. Mobile

El overlay usa `100dvh` con mínimo `100svh`, gutters del sistema y safe areas en
top/bottom. A 320–430 px acorta el identificador superior a `RV / 001`, conserva
el botón en una sola línea y limita metadatos a dos columnas. No depende de hover,
orientación ni ancho para decidir touch.

## 19. Internacionalización

Todas las cadenas están en `dictionaries/es.json` y `dictionaries/en.json`, bajo
`intro`. El contrato es `IntroDictionary`. La intro recibe el diccionario ya
cargado por el Server Component; no solicita datos ni cambia la estrategia i18n.

## 20. Accesibilidad

- Propósito accesible estático; el porcentaje visual está oculto al lector.
- Sin `aria-live` continuo y sin convertir el overlay en `dialog`.
- Botón real, Escape, foco visible y target táctil de 44 px.
- El contenido principal sigue presente y semántico debajo.
- No hay focus trap; el skip es el primer control del overlay.
- Contraste basado en los tokens AA de Fase 1.

## 21. Rendimiento

No se añaden dependencias, imágenes, vídeo, canvas ni loops RAF. Se eliminan la precarga
de cuatro originales y los updates React por progreso. La intro anima transform y
opacity, usa un solo objeto GSAP y retira el overlay, timelines y `will-change`.
La imagen principal de la home continúa cargando sin esperar a la intro.

La build de Fase 3 deja `/es` en 167.114 bytes de HTML y 1.012.180 bytes de
JavaScript inicial sin comprimir (18 scripts). Frente a la línea base final de
Fase 2 son +512 bytes de HTML y +6.182 bytes de JavaScript, aproximadamente un
0,6 % de JS, sin nuevas peticiones exclusivas de la intro. El ahorro de cuatro
precargas originales elimina unos 329 KB de imágenes forzadas por la apertura.

## 22. Recuperación ante errores

El bootstrap está envuelto en `try/catch` y retira su pantalla previa si storage o
APIs fallan. Un timeout de 3,4 s borra la cubierta y marca la intro como expirada
para que no aparezca tarde. Si faltan nodos, GSAP falla de forma controlada, cambia
la ruta o el componente se desmonta, se libera el lock y se muestra la página.
Los detalles solo se exponen en herramientas de desarrollo.

## 23. Pruebas

`tests/intro/intro-system.test.ts` cubre primera entrada, segunda entrada, rutas
internas/fotografía, reduced motion, automatización, storage bloqueado, reset y
cleanup del timeout. La suite motion existente cubre locks anidados, cleanup de
contexto GSAP, listeners y `will-change`.

No se instala Playwright/Cypress: el repositorio no tenía suite E2E y añadirla solo
para esta fase sería desproporcionado. La navegación y el skip se validan además
en navegador local.

## 24. Reproducirla en desarrollo

Abrir una home con `?motion-debug=1`, expandir `Reference` y usar `Replay`. El panel
permite replay, reset, reduced, carga lenta, fallo, ES/EN, estado, duración, lock y
triggers. `?intro-preview=1` fuerza una vista en desarrollo aunque WebDriver o la
sesión normalmente la omitan.

## 25. Resetear su estado

Usar `Reset session` en el panel de motion. También puede cerrarse la sesión del
navegador. No se ofrece un control público permanente en esta fase.

## 26. Riesgos y Fase 4

- La cubierta previa depende de un script inline ya compatible con la CSP actual;
  cualquier endurecimiento futuro de `script-src` debe incluir nonce/hash.
- El HTML estático raíz conserva `lang="es"` hasta hidratación, deuda previa.
- La posición final de marca deberá ajustarse al hero definitivo sin convertirla
  en una shared-element transition frágil.
- Fase 4 puede coordinar la salida con la primera imagen, pero no debe volver a
  esperar todo el archivo ni romper persistencia, reduced motion o timeout.

La Fase 3 no implementa el hero cinematográfico definitivo ni la home narrativa.
