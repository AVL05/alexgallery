---
name: RAW.VIVES
description: "Cinematic personal photographic archive — visual direction and production design contract"
version: "cinematic-redesign-brief-2026-11"
status: "Design brief approved for exploration; final direction subject to browser review and evidence"
colors:
  archive-black: "#080808"
  darkroom-black: "#0d0d0c"
  contact-sheet: "#121211"
  raised-surface: "#181817"
  paper-white: "#f1f0eb"
  caption-grey: "#b7b5ae"
  metadata-grey: "#85827b"
  archival-accent: "#cfc6b5"
  focus-ivory: "#efe9dd"
  error: "#e58b84"
  success: "#92b69a"
  warning: "#d6b36a"
typography:
  display:
    fontFamily: "Prata, Georgia, serif"
    fontSize: "clamp(3.35rem, 11vw, 10.5rem)"
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Prata, Georgia, serif"
    fontSize: "clamp(2rem, 3.6vw, 3.75rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.2em"
rounded:
  sm: "2px"
  md: "6px"
  lg: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "clamp(5rem, 10vw, 9rem)"
components:
  button-primary:
    backgroundColor: "{colors.archival-accent}"
    textColor: "{colors.archive-black}"
    rounded: "{rounded.sm}"
    padding: "12px 28px"
    height: "48px"
  button-secondary:
    backgroundColor: "{colors.archive-black}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.sm}"
    padding: "12px 28px"
    height: "48px"
---

# RAW.VIVES — Cinematic Art Direction & Design System

> **Estado:** documento de intención, límites y aceptación para el rediseño cinematográfico. Los tokens indicados describen el **estado base existente**; no son una afirmación de que la nueva dirección ya esté implementada. La dirección definitiva, sus cambios y las métricas reales se documentarán después de inspeccionar la web. La calidad de «10.000 €» es un objetivo de oficio, no una valoración ni garantía económica.

## 01 — Qué es y qué no es

**RAW.VIVES** es el archivo fotográfico personal de Alex Vicente, publicado en español e inglés. La fotografía es una práctica creativa y una mirada autoral, **no** una oferta de sesiones profesionales ni una agencia. El objetivo principal es **explorar las fotografías**; después comprender series, visitar fichas, descubrir al autor y contactar para colaboración o permisos de uso.

- Marca exacta: `raw.vives`, escrita en minúsculas y con punto. Descriptor: `Visual Archive`. Autor: Alex Vicente. `aleviclop.dev` es identidad de desarrollo relacionada, no una sustitución de marca.
- Material principal: fotografías reales del archivo, con sus metadatos, encuadres, autoría y licencias. No reemplazarlas por imágenes generadas, stock, renders ni fotografías ajenas sin aprobación.
- Estilo: **cine de autor + archivo proyectado + exposición contemporánea**, oscuro, táctil, silencioso, inmersivo y humano. Evitar imitación directa de otros estudios y el falso lujo a base de efectos.
- La interfaz acompaña y enmarca, como la luz de un proyector y las cartelas de una exposición; **la obra manda**.

## 02 — Tesis: «The Projected Archive / El archivo proyectado»

**Una sala oscura donde la luz de cada fotografía construye el recorrido.** El visitante siente escala, textura, profundidad y pausa; no es un carrusel de marketing. El desplazamiento revela capítulos fotográficos; el audio **no** se reproduce automáticamente; el movimiento añade continuidad solo cuando no perjudica la lectura ni el control.

Objetivos observables:
1. La primera pantalla reconoce inmediatamente al autor y presenta **una fotografía real memorable**. Se entiende cómo explorarla sin esperar a una intro.
2. Cada sección tiene un propósito y un ritmo propios: **silencio → inmersión → descubrimiento → contexto → cierre**.
3. Una fotografía importante tiene espacio para respirar y conserva su encuadre; su título, fecha, serie y texto están fuera del área visual siempre que sea viable.
4. La experiencia móvil parece dirigida artísticamente, no reducida desde escritorio.
5. Sin animación, sin WebGL o sin JavaScript de mejora, contenido, navegación y enlaces **siguen disponibles**.
6. La calidad viene de edición, composición, tipografía, recursos fotográficos, interacción y ejecución; no del número de efectos.

## 03 — Libertad creativa: tres direcciones antes de elegir

Premium Frontend Director debe **inspeccionar el estado real** y proponer tres conceptos deliberadamente distintos **usando las fotografías existentes**. Estas opciones orientan la exploración, no son una elección cerrada:

| Exploración | Imagen / composición | Tipografía | Movimiento / riesgo |
| --- | --- | --- | --- |
| **Darkroom Sequence** | Fotografía panorámica como proyección; gran escala, silencios, fotogramas, metadatos mínimos | Serif editorial + sans racional | Cortes/fundidos breves; riesgo de parecer demasiado minimalista |
| **Cinematic Contact Sheet** | Secuencia de fotogramas y contactos, cambios de escala, capítulos con selección curada | Índice técnico muy contenido + títulos de gran carácter | Progresión narrativa sin forzar scroll; riesgo de densidad |
| **Light & Silence** | Contraste entre exposiciones a pantalla amplia y pausas de espacio negativo; ritmo casi de cine experimental | Títulos deliberadamente escasos, cartelas legibles | Transiciones ópticas sutiles; riesgo de hero dependiente de efectos |

**Criterio de decisión:** encaje con las fotografías reales, diferenciación, claridad de navegación, calidad en móvil, accesibilidad, peso y complejidad. El agente debe elegir la mejor con justificación si la delegación lo permite; documentará qué conserva y qué cambia. **No copiar AETHER**, ni inventar un falso estudio creativo comercial.

## 04 — Sistema visual base, a refinar con evidencia

El estado actual utiliza los siguientes tokens; **`app/globals.css` y el código real son la autoridad técnica** de implementación. Cualquier cambio debe reflejarse en este documento y en los tokens, evitando divergencias.

| Función | Token / base | Dirección |
| --- | --- | --- |
| Fondo principal | `#080808` | Negro de archivo, no negro uniforme en todas las superficies |
| Fondo secundario | `#0d0d0c` | Pausas discretas y cierre |
| Superficie | `#121211` | Estados de carga y controles, nunca cajas por hábito |
| Superficie elevada | `#181817` | Excepcional, no diseño SaaS |
| Texto principal | `#f1f0eb` | Papel cálido |
| Secundario | `#b7b5ae` | Cartelas y lectura |
| Metadatos | `#85827b` | Contraste a verificar en el contexto concreto |
| Énfasis | `#cfc6b5` | Marfil escaso para acciones y estados |
| Foco | `#efe9dd` | 2 px claramente visibles |
| Error / éxito / advertencia | `#e58b84` / `#92b69a` / `#d6b36a` | Feedback funcional, nunca estética decorativa |

El **color cinematográfico procede de las fotografías**. No imponer una gradación única sobre todas las imágenes; no modificar balances, tonos, contraste, piel, sombras o autoría del archivo para hacer encajar la UI. Evitar glow, neón, glassmorphism permanente, gradientes arbitrarios y textura cinematográfica falsa.

### Tipografía y microtipografía

Base: **Prata 400** para marca y titulares; **Manrope 400/600** para lectura e interfaz; pila mono local para índices. Fuentes autoalojadas en el build actual, salvo constatación diferente en código.

- Pantalla y titulares: jerarquía expresiva vinculada a la imagen, no una palabra gigante que compita con la fotografía. Base display `clamp(3.35rem, 11vw, 10.5rem)`, interlineado 0.9; adaptar con screenshots.
- Titulares de sección: `clamp(2rem, 3.6vw, 3.75rem)`, interlineado cercano a 1.
- Lectura: **16 px o superior en párrafos corrientes**, interlineado cómodo y medida aproximada de 55–68 caracteres en escritorio.
- Metadatos: pueden ser menores, pero nunca ilegibles. Objetivo práctico 12–14 px según función y vista; **verificar contraste, zoom al 200 % y tamaño real**, no basarse solo en una captura reducida.
- Máximo **dos familias de descarga** salvo justificación clara y presupuesto medido. No introducir fuentes externas sin confirmar derechos, funcionamiento offline/CDN y coste.
- Cursivas, numeración y créditos: gestos precisos, no clichés de revista de lujo.

### Retícula, espacio y profundidad

- Mantener `--layout-gutter` y tokens reales del proyecto; superficies planas, bordes finos, radios 0–2 px en fotografía.
- Alternar **imagen dominante, imagen contenida y pausa** en lugar de repetir bloques idénticos. Retícula editorial de 12 columnas en pantallas grandes cuando aporte ritmo; una columna cuidadosa en móvil.
- Conservación de ratio como norma. Evitar `object-fit: cover` si sacrifica el sujeto; se admite un recorte **curatorialmente justificado y reversible** para un hero concreto, nunca alterar los archivos fuente.
- No fabricar profundidad con blur o sombras permanentes. Profundidad visual mediante luz, capas contenidas, escala y espacio.
- Mantener enlaces y controles nativos, objetivos táctiles de **44 × 44 px** y foco visible.

## 05 — Mapa cinematográfico por superficie

### A. Portada / home (primera impresión)

**Intención:** abrir una exposición personal. La primera imagen debe ser identificable y atractiva antes de cualquier interacción.

- Revisar el hero vigente y la curación real; **no elegir imágenes desde componentes**. Las selecciones se gestionan por `lib/home/` y el catálogo por `lib/gallery-data.ts`.
- Probar composición con fotografía panorámica **sin texto invasivo sobre la imagen**; marca, autor, cartela, CTA «Explorar el archivo» y número de obra pueden vivir fuera del marco.
- No imponer una intro bloqueante ni loader cinematográfico que retrase LCP. Si hay transición inicial, debe ser corta, omitible, compatible con reduced motion y no esconder contenido del árbol accesible.
- Comprobar altura pequeña, móvil de 320–375 px, pantalla ultrawide y orientación horizontal. Mantener CTA visible y acceso directo al contenido.
- Establecer una narrativa deliberada entre hero → selección editorial → series → archivo → autor/contacto; no apilar secciones porque ya existían.

### B. Selección y capítulos

**Intención:** montar fotografías como secuencia, no como catálogo de productos.

- Conservar orden curado y fotografías reales salvo autorización para re-curar.
- Alternar escalas y pausas; transiciones de salida/entrada ligeras; índices y metadatos de archivo.
- Cada fotografía enlaza a su ficha real y conserva navegación de retorno y foco.
- No convertir galerías enteras en canvases ni añadir desplazamiento horizontal obligatorio.
- Priorizar imágenes reales, variantes responsive y `sizes` correctos.

### C. Series

**Intención:** cada serie es un relato y un universo propio.

- Mantener rutas `/es/series/[slug]` y `/en/series/[slug]`, membresía y portada curada.
- La narrativa puede cambiar por proyecto sin inventar historias, ubicaciones ni procesos fotográficos.
- Portadas con proporciones/espaciado estudiados; no repetir la misma tarjeta de home.
- Salida a serie y vuelta al archivo claras; navegación accesible en móvil.

### D. Archivo

**Intención:** descubrir sin fricción. El archivo es un instrumento, no una animación interminable.

- Conservar búsqueda, filtro por categoría/año, ordenación, paginación/carga progresiva y URL compartible.
- Mantener scroll y filtros operativos sin movimiento, WebGL o JS decorativo.
- Estados vacío/cargando/error y contadores honestos.
- No cambiar IDs ni comportamiento de los filtros; pruebas con ida/vuelta desde fichas.
- Imágenes optimizadas y carga diferida; cero desplazamiento de layout inesperado.

### E. Ficha de fotografía

**Intención:** entrar en una sala reservada a una sola imagen.

- Imagen con proporción correcta, gran escala controlada, metadatos legibles, texto contextual, anterior/siguiente, relacionadas y fullscreen.
- En imágenes verticales, respetar altura útil sin recortar; en panorámicas aprovechar anchura sin recorte injustificado.
- Fullscreen con Escape, focus trap/restoration, scroll lock correcto y controles accesibles.
- Mantener URL directa e independiente de `sessionStorage`, canonical e `ImageObject`.

### F. Autor, contacto, legal y cierre

**Intención:** concluir el recorrido sin convertirlo en un embudo comercial.

- Voz personal, curiosa y honesta. Fotografía como afición artística; no anunciar servicios profesionales ficticios.
- Contacto/licencias **solo con borradores `mailto:`** según contrato actual: nunca afirmar que se ha enviado un correo.
- Preservar textos legales, atribución, licencias, políticas, ES/EN, nombres e identidad original.
- Cierre memorable y sencillo, con CTA real al archivo o contacto.

## 06 — Interacción, movimiento y WebGL

**Motion thesis: «una cámara que respira, no una interfaz que hace piruetas».** Propón como máximo 2–3 motivos reconocibles (p. ej. fundido corto entre capítulos, transición de cartela y aparición editorial). Cada uno debe justificar percepción o orientación.

| Uso | Orientación | Lo que se debe comprobar |
| --- | --- | --- |
| Hover / foco | 120–220 ms, transform/opacity | También útil con teclado y touch |
| Entrada breve de sección | 250–600 ms cuando aporte valor | Sin ocultar HTML permanentemente |
| Cambio de capítulo | Solo si aporta continuidad | No introduce scroll-jacking ni LCP tardío |
| Transición entre rutas | Mantener acceso y foco | Atrás/adelante, navegación directa, reduced motion |
| WebGL / Three | Solo progresivo y justificado | Fallback sin canvas, memoria limpia, LCP intacto |

Estos intervalos son **orientativos**, no valores ya implementados. Reutilizar `lib/motion/`, `MotionProvider`, GSAP, ScrollTrigger y Lenis existentes. Nunca crear un segundo motor, registrar GSAP globalmente en componentes, acumular RAF o cargar Three.js en la ruta crítica por un adorno. Respetar `prefers-reduced-motion`, Forced Colors, Save-Data, touch, dispositivos de baja capacidad y teclado. No esconder fotografía editorial con `visibility:hidden` antes de reveals.

**No añadir sonido automático**, reproducción de vídeo innecesaria ni efectos de parpadeo; evitar flashes. Toda interacción significativa tiene equivalente accesible y funcionamiento sin hover.

## 07 — Arquitectura y contenido innegociables

- **Next.js 16 App Router**, React 19, **TypeScript estricto**, Tailwind CSS 4, GSAP/Lenis/Three existentes, Sharp, Playwright, **pnpm 11**, Node 24.18.x. No convertir el proyecto a JavaScript por preferencia externa.
- **`output: "export"`** y Cloudflare Pages; sin API routes de servidor, acciones de servidor runtime ni BD.
- **ES/EN**, misma jerarquía funcional, traducciones estructuralmente equivalentes; `lib/dictionary.ts` y diccionarios existentes.
- URLs públicas y IDs estables; archivo, orden, navegación contextual, series publicadas, SEO, canonicals, `hreflang`, sitemap, Open Graph, JSON-LD e imágenes `ImageObject`.
- Imagen: `public/photos/raw/` contiene **fuentes web**, no originales de cámara; `public/photos/optimized/` y `lib/images-data.json` se generan por pipeline y no se editan a mano. Mantener el loader personalizado.
- No introducir fuentes, fotografía externa, trackers, scripts, APIs ni cambios de CSP sin aprobación.
- No hacer commit, push, PR, cambio de rama ni deploy durante la prueba sin autorización explícita.
- **`PRODUCT.md` y `AGENTS.md` son contratos funcionales**; este documento rige la dirección visual, sin desplazar los contratos técnicos.

## 08 — Fases de implementación para Codex / Premium Frontend Director

### Puerta 0 — Línea base y diagnóstico (ANTES de editar)

1. Verificar `git status`, `main`, dependencias y rutas. **No sobrescribir trabajo local no publicado.**
2. Leer: `AGENTS.md`, `PRODUCT.md`, `DESIGN.md`, `README.md` y **`docs/RAW_VIVES_CINEMATIC_BRIEF.md`**. Después los docs técnicos de las áreas afectadas, distinguiendo referencias de fases históricas de la implementación actual.
3. Inspeccionar web local en **375, 768, 1440, 1920 px**; extraer capturas de home, archivo, serie y ficha en al menos un idioma, y revisar navegación ES/EN. Registrar nombre/fecha de artefactos y resultados reales.
4. Revisar tipografías, ratio y variantes de imágenes, JS crítico, LCP/CLS si pueden medirse, consola, fallbacks, contraste y coste de efectos.
5. Registrar **CONSERVAR / MEJORAR / RETIRAR**, con evidencia visual por componente.

### Puerta 1 — Dirección de arte

1. Premium Frontend Director coordina; **UI UX Pro Max** consulta patrones y sistema si está disponible; **Taste Skill** aporta una dirección artística, no una plantilla obligatoria.
2. Presentar **tres conceptos diferenciados**, referidos a fotos reales, con riesgos, coste técnico y criterio de evaluación.
3. Elegir razonadamente o pedir aprobación cuando cambien identidad, curación, derechos, arquitectura o contenido sensible.
4. Documentar hipótesis, tokens propuestos, narrativa, motion y decisiones en el plan de ejecución. No declarar un diseño aprobado solo por escribirlo.

### Puerta 2 — Ejecución progresiva

- Home / hero y selección primero; luego serie, archivo, ficha y cierre, con revisión en navegador **después de cada tramo significativo**.
- Reutilizar componentes y referencias; no expandir el código porque sí.
- Ajustar `DESIGN.md` cuando cambie el sistema visual **solo después de contrastar el resultado**.
- No tocar imágenes ni curation por accidente.

### Puerta 3 — Crítica y validación

- **Impeccable**: crítica del render con ejecución independiente cuando sea posible; distinguir uso parcial de PASS completo.
- **Web Design Guidelines**: revisar reglas vigentes cuando esté disponible; complementa, no sustituye pruebas.
- Tests reales: typecheck, unitarios, build estática, Playwright, local preview `pnpm preview` y rutas ES/EN; comandos exactamente documentados, sin inventar resultados.
- Verificar zoom 200 %, foco y teclado, Escape, contraste, movimiento reducido, Forced Colors, alt, ratio, desplazamiento, listeners y fallbacks WebGL.
- Capturas finales equivalentes a la línea base para comparar.

## 09 — Criterios de aceptación

| Gate | Condición para PASS |
| --- | --- |
| **Identidad visual** | Dirección elegida coherente; fotos y marca propias; revisión visual humana pendiente si no se ha hecho |
| **Fotografía** | Misma integridad de IDs/series, encuadres justificados y variantes correctas |
| **Móvil** | 320–375, 768, 1440 y 1920 px revisados; sin overflow ni texto/CTA inaccesible |
| **Funcionalidad** | Navegación, filtros, URLs compartibles, detalle y vuelta, fullscreen y contacto `mailto:` en ES/EN |
| **Accesibilidad** | Pruebas de teclado/foco/reduced-motion/Forced Colors; no afirmar WCAG certificado |
| **Rendimiento** | Comparación reproducible antes/después de bundle, imágenes y métricas observadas; no regresión importante sin justificación |
| **Compatibilidad** | Export estático y preview Cloudflare; rutas/SEO siguen correctos |
| **Calidad** | `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm e2e` cuando proceda |
| **Proveniencia** | Informe de skills **USADA / PARCIAL / NO DISPONIBLE / NO NECESARIA**, con comandos o evidencia |
| **Publicación** | **No desplegar** hasta aprobación separada |

**Nunca falsificar PASS.** Usar `FAIL` para defectos observados y `NOT RUN` cuando la prueba no se ejecutó. Registrar diferencias antes/después y riesgos.

## 10 — Antipatrones y límites

- No copiar AETHER: en raw.vives no hay trabajos ficticios ni proyectos de marca inventados.
- No convertir fotografía en fondo de texto invasivo, ni pintar todas las obras con filtros uniformes.
- No reconstruir archivo/series/fichas como componentes de marketing.
- No hacer animaciones de scroll por todas partes, transiciones largas, parallax compulsivo o intro obligatoria.
- No usar un «cursor artístico» que oculte el puntero nativo, ni sacrificar foco y navegación.
- No instalar diez skills extra ni ejecutar todas simultáneamente: **una responsabilidad por fase**.
- No reemplazar fotografías ni mover el catálogo para acomodar un layout más fácil.
- No considerar el resultado final porque simplemente compiló.

## 11 — Fuentes internas y mantenimiento

**Lectura prioritaria para la prueba**: `AGENTS.md`, `PRODUCT.md`, `DESIGN.md`, `docs/RAW_VIVES_CINEMATIC_BRIEF.md`, `README.md`. Después consultar los sistemas actuales según la tarea:

- `docs/RAW_VIVES_ARCHITECTURE.md` y `docs/RAW_VIVES_PRODUCTION_AUDIT.md` para arquitectura y línea base histórica.
- `docs/RAW_VIVES_HOME_NARRATIVE.md` y `docs/RAW_VIVES_CURATION_SYSTEM.md` para home y fotografías curadas.
- `docs/RAW_VIVES_DESIGN_SYSTEM.md`, `docs/RAW_VIVES_MOTION_SYSTEM.md` y `docs/RAW_VIVES_HERO_SYSTEM.md` como **documentación histórica y técnica por fase**, no autorizaciones para anular este rediseño.
- `docs/RAW_VIVES_PHOTO_DETAIL_SYSTEM.md`, `docs/RAW_VIVES_PHOTO_SERIES_SYSTEM.md`, `docs/RAW_VIVES_ARCHIVE_SYSTEM.md` para contratos de interacción.
- `docs/RAW_VIVES_DEPLOYMENT.md` y `docs/RAW_VIVES_RELEASE_CHECKLIST.md` para gates antes de publicación.

**Un solo sistema autoritativo:** `PRODUCT.md` = misión y usuarios, `DESIGN.md` = dirección visual, `AGENTS.md` = arquitectura/procedimiento, código vigente = comportamiento real. Los documentos antiguos pueden narrar estados previos y no se deben aplicar literalmente si contradicen el código actual. Documentar nuevas decisiones después de verificarlas.
