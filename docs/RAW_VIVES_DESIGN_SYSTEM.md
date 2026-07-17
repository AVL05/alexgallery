# Sistema visual de RAW.VIVES

Documento de referencia visual de la Fase 1. La infraestructura de movimiento
añadida en Fase 2 se documenta por separado en `RAW_VIVES_MOTION_SYSTEM.md`; no
habilita todavía la home narrativa ni el motion de fases posteriores.

## 1. Identidad de marca

- Marca creativa: `raw.vives`.
- Descriptor: `Visual Archive`.
- Autor: Alex Vicente.
- Identidad de desarrollo relacionada: `aleviclop.dev`.
- Firma recomendada: `Visual Archive by Alex Vicente`.
- Localización pública: Valencia, España.

La marca se escribe en minúsculas y con punto. No se sustituye por `ALEX ARCHIVE`,
`AVL` o `RAW.VIVES` de forma permanente. Las mayúsculas se reservan para labels y
metadatos pequeños.

La ficha de Fase 7 aplica la misma dirección como cartela de sala: imagen sin
recorte, título Prata, metadata mono, bordes finos y acciones tipográficas. No
introduce una paleta, sombra, radio o lenguaje de producto paralelo.

## 2. Personalidad visual

La dirección se resume como **The Projected Archive**: un archivo fotográfico
proyectado en una sala oscura con cartelas precisas. Es nocturna, táctil, exacta,
cinematográfica y editorial. Evita la estética gamer, la galería comercial, la
imitación de revista de lujo y el lenguaje visual de producto SaaS.

## 3. Uso correcto de `raw.vives`

- Usar `raw.vives` como marca visible en hero, navegación, loader y footer.
- Acompañar con `Visual Archive` cuando hace falta contexto.
- Usar Alex Vicente como crédito autoral, no como logotipo alternativo.
- Vincular `aleviclop.dev` como identidad externa de desarrollo.
- No añadir claims comerciales ni descripciones ficticias.

## 4. Paleta de colores

La fuente de verdad está en `:root` de `app/globals.css`.

| Token | Valor | Uso |
| --- | --- | --- |
| `--color-background` | `#080808` | Fondo principal |
| `--color-background-secondary` | `#0d0d0c` | Secciones alternas y footer |
| `--color-surface` | `#121211` | Campos, carga y superficies |
| `--color-surface-elevated` | `#181817` | Superficie elevada puntual |
| `--color-text` | `#f1f0eb` | Texto principal |
| `--color-text-secondary` | `#b7b5ae` | Texto de lectura secundario |
| `--color-text-muted` | `#85827b` | Metadatos; mantiene AA sobre fondo |
| `--color-border` | blanco al 14 % | Divisores y bordes en reposo |
| `--color-border-strong` | blanco al 28 % | Hover y separación reforzada |
| `--color-accent` | `#cfc6b5` | Acción, activo y énfasis escaso |
| `--color-focus` | `#efe9dd` | Outline de teclado |
| `--color-error` | `#e58b84` | Error de formulario |
| `--color-success` | `#92b69a` | Confirmación |
| `--color-warning` | `#d6b36a` | Aviso futuro |

El acento no debe ocupar grandes áreas salvo el fondo de un botón primario.

## 5. Tipografías

Las fuentes se cargan con `next/font/google` en `app/layout.tsx`, se alojan en el
artefacto generado y usan `display: swap`.

- Display: Prata 400, subset latino. Se usa en marca y títulos editoriales.
- Lectura/interfaz: Manrope 400 y 600, subset latino.
- Técnica: pila local `SFMono-Regular`, Consolas y Liberation Mono.

Prata ofrece un gesto cinematográfico con un único peso. Manrope mantiene buena
legibilidad móvil, caracteres españoles y precisión técnica sin parecer una sans
corporativa genérica. La pila mono no añade una tercera descarga.

## 6. Escala tipográfica

| Clase | Token principal | Uso |
| --- | --- | --- |
| `.rv-display-xl` | `--type-display-xl` | Hero y marca principal |
| `.rv-display-lg` | `--type-display-lg` | Display secundario |
| `.rv-page-title` | `--type-heading-1` | Título de página/fotografía |
| `.rv-section-title` | `--type-heading-2` | Título de sección |
| `.rv-card-title` | `--type-heading-3` | Bloque o tarjeta editorial |
| `.rv-intro` | `--type-body-lg` | Introducción hasta 42rem |
| `.rv-body` | `--type-body-md` | Lectura hasta 68ch |
| `.rv-body-sm` | `--type-body-sm` | Ayuda o texto secundario |
| `.rv-kicker` | `--type-label` | Eyebrow de sección |
| `.rv-label` | `--type-label` | Control y campo |
| `.rv-meta` | `--type-meta` | Categoría, año y ayuda |
| `.rv-index` | `--type-meta` | Numeración tabular |

Las escalas de display usan `clamp()` y no cambian bruscamente por breakpoint.

## 7. Espaciado

Tokens: `--space-0-5`, `--space-1`, `--space-2`, `--space-3`, `--space-4`,
`--space-6`, `--space-8`, `--space-12`, `--space-16`, `--space-24` y
`--space-32`. Corresponden a 2, 4, 8, 12, 16, 24, 32, 48, 64, 96 y 128 px.

Las secciones usan `--layout-section-space: clamp(5rem, 10vw, 9rem)`.

## 8. Layout y contenedores

`components/ui/layout.tsx` expone:

- `PageShell`: fondo, color y altura mínima comunes.
- `Container`: ancho máximo `90rem` y gutter responsive.
- `EditorialContainer`: lectura centrada hasta `48rem`.
- `Section`: separación vertical común.
- `Stack`: flujo vertical con gap configurable.
- `Cluster`: fila flexible con wrap.
- `Grid`: primitive de grid sin reglas visuales.
- `Divider`: separador de un píxel.
- `ScreenReaderOnly`: texto únicamente accesible.

Los valores de `gap` en `Stack` y `Cluster` son dinámicos y constituyen el único
estilo inline de estas primitivas.

## 9. Breakpoints

Se conservan los breakpoints de Tailwind 4:

- `sm`: 640 px.
- `md`: 768 px.
- `lg`: 1024 px.
- `xl`: 1280 px.
- `2xl`: 1536 px.

El sistema debe funcionar desde 320 px. No se crean media queries ligadas a un
modelo de dispositivo.

## 10. Bordes y radios

- `--radius-control`: 2 px, control y superficie fotográfica.
- `--radius-surface`: 6 px, uso puntual.
- `--radius-panel`: 12 px, reservado; no es el valor por defecto.
- `--color-border`: divisor normal de un píxel.
- `--color-border-strong`: hover o jerarquía reforzada.

No se usan sombras globales. La profundidad se expresa con tono, borde y espacio.

## 11. Botones

`components/ui/button.tsx` usa CVA y mantiene `asChild`. Variantes reales:

- `default`: acción primaria marfil.
- `secondary`: superficie tonal.
- `outline`: acción secundaria de borde.
- `ghost`: control silencioso.
- `link`: enlace textual subrayado.
- `destructive`: acción de error; solo cuando sea semántica.

Tamaños: `sm`, `default`, `lg`, `icon`, `icon-sm` e `icon-lg`. Todos mantienen un
target mínimo de 44 px. Disabled usa cursor y opacidad; submit expone `aria-busy`.

## 12. Enlaces

`.rv-editorial-link` sirve para acciones como “Entrar al archivo”, “Volver” o
“Abrir formulario”. Tiene target de 44 px, subrayado fino y un cambio moderado de
color. Las flechas pueden desplazarse hasta 2 px mediante transición básica.

Los enlaces externos usan `target="_blank"`, `rel="noreferrer"` y un indicador
`ArrowUpRight`. Los enlaces que contienen solo icono necesitan `aria-label`.

## 13. Metadatos

`components/ui/metadata.tsx` implementa:

- `Metadata`: texto técnico común.
- `Tag`: etiqueta con estado normal o activo.
- `PhotoIndex`: número tabular estable de tres cifras.

Categoría y año se presentan con `.rv-meta`; el título fotográfico permanece fuera
de la imagen siempre que el layout lo permita.

## 14. Navegación

`components/navigation.tsx` contiene marca, anchors existentes, política,
`aleviclop.dev` y selector de idioma. En rutas internas transforma los anchors en
`/{locale}#seccion`. El selector reemplaza el primer segmento de locale y conserva
la ficha o política equivalente.

En móvil el panel:

- Ocupa `100svh`.
- Bloquea scroll mediante `data-menu-open` en `<html>`.
- Mueve el foco al primer control interno.
- Atrapa Tab y Shift+Tab.
- Cierra con Escape y devuelve foco al trigger.
- Mantiene targets mínimos de 44 px.

## 15. Footer

`components/footer.tsx` incluye marca, descriptor, navegación secundaria,
Instagram, `aleviclop.dev`, email existente, copyright, año dinámico y selector de
idioma. Usa una sola banda editorial y no repite el antiguo bloque de copyright de
contacto.

## 16. Uso de fotografías

- Mantener los assets y el loader existentes.
- Usar el ratio real de cada fotografía en la galería.
- Usar `object-cover` en cards y `object-contain` en ficha individual.
- No recortar una ficha para forzar una orientación.
- Mantener `alt`, blur placeholder, `sizes` y lazy loading.
- No convertir la fotografía en fondo de una tarjeta con texto permanente encima.

Las fotografías de galería dejaron de marcarse como `priority`; están por debajo
del hero y se cargan de forma diferida.

## 17. Estados interactivos

- Hover: cambio de tono/borde, escala fotográfica máxima 1.018 y brillo 0.88.
- Focus-visible: outline `--color-focus` de 2 px con offset de 3 px.
- Active: desplazamiento máximo de 1 px en botón primario.
- Disabled: opacidad 45 %, sin eventos y con cursor deshabilitado.
- Error/success: color semántico y `role="status"` o `role="alert"`.

La interfaz no depende del hover para revelar una acción esencial.

## 18. Accesibilidad

- Contraste de texto principal/secundario y muted compatible con AA sobre fondo.
- Headings `h1`, `h2` y `h3` conservados.
- Labels visibles y autocomplete en contacto/licencias.
- Mensajes de validación localizados en ambos idiomas.
- Navegación móvil con foco, Escape, `inert` y bloqueo de scroll.
- Cambio de `document.documentElement.lang` en rutas localizadas.
- Iconos decorativos con `aria-hidden` y controles con nombre accesible.
- Targets mínimos de 44 px y soporte global de `prefers-reduced-motion`.

El atributo `lang` inicial del HTML exportado sigue siendo español por limitación
del layout raíz compartido; `DocumentLanguage` lo corrige al hidratar. Resolverlo
en HTML estático requerirá una decisión de arquitectura/SEO posterior.

## 19. Motion básico y ampliación de Fase 2

Tokens: `--duration-fast` 140 ms, `--duration-normal` 240 ms,
`--duration-slow` 420 ms, `--ease-standard`, `--ease-enter` y `--ease-exit`.

Los tokens CSS se mantienen para hover, foco y transiciones simples. Fase 2 añade
GSAP, ScrollTrigger y Lenis mediante el sistema centralizado documentado en
`RAW_VIVES_MOTION_SYSTEM.md`; Framer Motion se elimina tras sustituir sus dos usos.

## 20. Ejemplos de uso

```tsx
<Section>
  <Container>
    <p className="rv-kicker">Visual Archive</p>
    <h2 className="rv-section-title">Archivo completo</h2>
    <p className="rv-intro">Texto introductorio con longitud controlada.</p>
  </Container>
</Section>
```

```tsx
<Button asChild variant="outline">
  <Link href="/es#gallery">Explorar archivo</Link>
</Button>
```

## 21. Errores visuales que deben evitarse

- Cambiar `raw.vives` a mayúsculas en el logotipo permanente.
- Usar Playfair/Inter como fallback visual deliberado del sistema anterior.
- Introducir gradientes decorativos, neon, glitch o glassmorphism.
- Crear una caja con fondo, borde y radio para cada bloque de contenido.
- Añadir acentos saturados, sombras genéricas o radios inconsistentes.
- Reducir texto secundario mediante opacidad por debajo del contraste AA.
- Aplicar hover esencial o filtros costosos de forma permanente.
- Forzar ratios fotográficos o cargar todas las imágenes con prioridad.

## 22. Indicaciones para las siguientes fases

- Mantener estos tokens como contrato; ampliar antes de hardcodear.
- Crear el registro de motion propuesto en `RAW_VIVES_AUDIT.md` antes de sumar
  nuevas secuencias.
- Centralizar `prefers-reduced-motion` y separar animación por sección.
- Añadir GSAP/ScrollTrigger/Lenis únicamente en la fase autorizada; ya existen como
  dependencias, pero no se amplían aquí.
- Usar transforms y opacity, scopes con cleanup y fallbacks móviles.
- Probar el loader y el contenido sin JavaScript antes de una home narrativa.
- No se crea `/dev/design-system`: `output: "export"` la publicaría. `DESIGN.md`,
  `.impeccable/design.json` y este catálogo documentan la referencia sin exponer
  una ruta interna en producción.

## Composición narrativa de la Fase 5

La home aplica el sistema a una secuencia de fondo oscuro, fotografía grande,
divisores finos y tipografía display. Las secciones usan `rv-container`, los
tokens de texto y borde existentes y una retícula de 12 columnas únicamente
cuando la composición lo requiere.

`SectionMarker` formaliza la numeración `01 / 08` a `08 / 08`; `NarrativeImage` conserva
ratios reales y evita superficies de tarjeta. No se añaden colores, radios,
sombras ni fuentes fuera del sistema definido en esta guía.

## Aplicación al archivo de la Fase 6

El archivo usa una cabecera de índice, cartelas fuera de la imagen, filtros de
línea y una retícula CSS de 12 columnas. No añade chips redondeados, superficies
de dashboard, sombras, gradientes ni otra paleta. En móvil mantiene una columna
y traslada filtros secundarios a un diálogo de pantalla completa con safe areas.

La fotografía conserva su ratio, el hover máximo baja a 1.012 y los metadatos
esenciales permanecen visibles sin hover. El contrato detallado está en
`RAW_VIVES_ARCHIVE_SYSTEM.md`.
