---
name: RAW.VIVES
description: A nocturnal, tactile, and exact visual archive by Alex Vicente
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

# Design System: RAW.VIVES

## Overview

**Creative North Star: "The Projected Archive"**

RAW.VIVES se comporta como un archivo fotográfico proyectado en una sala oscura:
las imágenes concentran la expresividad y la interfaz actúa como una cartela de
museo precisa. El sistema es nocturno, táctil y exacto, con grandes pausas,
contraste controlado y jerarquías editoriales sin ornamentalismo.

Rechaza las plantillas fotográficas genéricas, las cajas SaaS, el neón gamer, el
glassmorphism permanente, la imitación de revista de lujo y cualquier efecto que
compita con las fotografías.

**Key Characteristics:**

- Fondos negros cálidos, no negro digital absoluto en todas las superficies.
- Tipografía display de un solo peso y sans legible para el trabajo funcional.
- Metadatos pequeños pero con contraste WCAG AA.
- Profundidad mediante tono, borde y espacio; no mediante sombras decorativas.

## Colors

La paleta mezcla negro de cuarto oscuro, blanco papel y un acento marfil escaso.

### Primary

- **Archival Accent** (`#cfc6b5`): estados activos, foco editorial y acciones primarias.

### Neutral

- **Archive Black** (`#080808`): fondo principal.
- **Darkroom Black** (`#0d0d0c`): footer y secciones alternas.
- **Contact Sheet** (`#121211`): campos e imágenes mientras cargan.
- **Paper White** (`#f1f0eb`): texto principal.
- **Caption Grey** (`#b7b5ae`): lectura secundaria.
- **Metadata Grey** (`#85827b`): metadatos y ayudas.

**The Rare Accent Rule.** El acento no colorea grandes superficies salvo acciones
primarias; su escasez mantiene la autoridad de las fotografías.

## Typography

**Display Font:** Prata (Georgia fallback)  
**Body Font:** Manrope (Arial fallback)  
**Label/Mono Font:** pila monoespaciada del sistema

**Character:** Prata aporta un gesto cinematográfico reconocible con un solo peso;
Manrope conserva claridad en navegación, formularios y texto largo sin introducir
otra voz ornamental.

### Hierarchy

- **Display** (400, `clamp(3.35rem, 11vw, 10.5rem)`, 0.9): marca y hero.
- **Headline** (400, `clamp(2rem, 3.6vw, 3.75rem)`, 1): títulos de sección.
- **Title** (400, `clamp(1.25rem, 2vw, 1.75rem)`, 1.08): fotografías y bloques.
- **Body** (400, 1rem, 1.75): lectura hasta 68 caracteres.
- **Label** (600, 0.6875rem, 0.2em): navegación, kicker y acciones.

**The One Display Voice Rule.** Prata solo se utiliza para marca y jerarquía
editorial; no se aplica a botones, formularios ni metadatos.

## Elevation

El sistema es plano por defecto. La profundidad procede de fondos tonales, bordes
de un píxel y superposición fotográfica. No existen sombras globales; los overlays
pueden usar negro translúcido únicamente para garantizar legibilidad.

**The Flat-by-Default Rule.** Una superficie no recibe sombra, blur o elevación si
un borde o un cambio tonal comunica correctamente su jerarquía.

## Components

### Buttons

- **Shape:** rectangular preciso con radio de 2 px y altura mínima de 44 px.
- **Primary:** fondo Archival Accent, texto Archive Black.
- **Hover / Focus:** cambio tonal breve y outline Focus Ivory de 2 px.
- **Secondary / Ghost:** fondo transparente, borde fino y texto secundario.

### Chips

- **Style:** filtros sin píldora; texto técnico y subrayado activo de 1 px.
- **State:** `aria-pressed` conserva el estado accesible.

### Cards / Containers

- **Corner Style:** 0–2 px en fotografía y controles.
- **Background:** Archive Black, Darkroom Black o Contact Sheet.
- **Shadow Strategy:** ninguna sombra permanente.
- **Border:** 1 px con `--color-border`.
- **Internal Padding:** escala de 16, 24 o 32 px.

### Inputs / Fields

- **Style:** fondo Darkroom Black, borde de un píxel y radio de 2 px.
- **Focus:** borde y outline Focus Ivory.
- **Error / Disabled:** Error Muted y opacidad 45 %, respectivamente.

### Navigation

Marca Prata a la izquierda, enlaces Manrope de alto contraste y selector de idioma
integrado. El panel móvil ocupa el viewport, bloquea scroll, atrapa foco y cierra
con Escape.

### Photograph Entry

La fotografía define su propio ratio. En escritorio recibe escala máxima 1.018 y
una reducción sutil de brillo; título y metadatos permanecen fuera de la imagen.

## Do's and Don'ts

### Do:

- **Do** utilizar `--layout-gutter` para alinear todas las páginas.
- **Do** reservar `#cfc6b5` para acciones, estados activos y metadatos clave.
- **Do** conservar cada ratio fotográfico y usar `object-fit` explícito.
- **Do** mantener foco visible, targets de 44 px y reducción de movimiento.

### Don't:

- **Don't** recrear una plantilla fotográfica genérica o una galería comercial.
- **Don't** introducir cajas SaaS, dashboards o composiciones de tarjetas repetidas.
- **Don't** usar neón gamer, glitch, glow decorativo o glassmorphism permanente.
- **Don't** imitar una revista de lujo solo con serif sobredimensionada.
- **Don't** añadir gradientes arbitrarios, cursores o efectos que compitan con fotos.
