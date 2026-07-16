# Auditoría técnica RAW.VIVES — Fase 0

Fecha de la línea base: 16 de julio de 2026. Repositorio auditado:
`alexgallery`. Web publicada: `https://gallery.aleviclop.dev/`.

## 1. Resumen ejecutivo

La aplicación existente es una galería bilingüe estática y funcional construida
con Next.js. La base es válida para evolucionar por fases: las rutas se generan
en build, las fotografías ya tienen variantes responsive, blur placeholders,
EXIF e histograma, y Cloudflare aplica caché larga y cabeceras de seguridad.

La Fase 0 no rediseña la interfaz. Se han corregido fallos seguros: acceso
directo inseguro al diccionario, sitemap obsoleto en `robots.txt`, navegación
móvil cerrada todavía accesible por teclado, targets táctiles insuficientes y
ausencia de una 404 útil. También se ha documentado el entorno.

Los principales riesgos pendientes son la dependencia de JavaScript para mostrar
todo el contenido localizado, un bundle inicial local de aproximadamente 1 MB sin
comprimir, el idioma HTML fijo en español, i18n incompleta en fotografías y
formularios, y la dispersión de lógica de motion entre varios componentes.

## 2. Stack tecnológico confirmado

| Área | Implementación confirmada |
| --- | --- |
| Framework | Next.js 16.2.6, App Router, `output: "export"` |
| UI | React 19.2.6 y React DOM 19.2.6 |
| Lenguaje | TypeScript 6.0.3 estricto; no hay JavaScript de aplicación |
| Estilos | Tailwind CSS 4.3.0, PostCSS y CSS global |
| Motion | GSAP 3.15.0, `@gsap/react` 2.1.2, ScrollTrigger, Lenis 1.3.23 y Framer Motion 12.38.0 |
| Galería | `react-masonry-css` y `yet-another-react-lightbox` |
| Formularios | React Hook Form, Zod, resolvers y Web3Forms |
| Imágenes | `next/image` con loader propio, Sharp, Plaiceholder y Exifr |
| Iconos | Lucide React |
| Package manager | pnpm 10.34.1, fijado por `pnpm-lock.yaml` |
| Runtime validado | Node.js 22.22.2 |
| Despliegue | Export estático `out/` y Wrangler Assets sobre Cloudflare |

No existe base de datos, backend propio, CMS, panel de administración ni estado
global. El contenido es parte del repositorio.

## 3. Estructura actual

- `app/`: layouts, páginas, metadata, sitemap, robots y estilos globales.
- `app/[locale]/`: home localizada, política y fichas de fotografía.
- `components/`: secciones visuales, navegación, loader, galería y motion.
- `components/ui/`: primitivas actualmente sin consumo desde las páginas.
- `dictionaries/`: diccionarios manuales `es.json` y `en.json`.
- `hooks/`: precarga de imágenes del loader.
- `lib/`: catálogo, loader de imágenes, metadatos generados e i18n.
- `public/photos/raw/`: 31 fuentes WebP; 30 pertenecen al catálogo y la 14 se
  utiliza como hero.
- `public/photos/optimized/`: 248 variantes, cuatro tamaños por dos formatos.
- `scripts/`: pipeline de optimización de imágenes.
- `types/`: contratos de fotografía, diccionario y Masonry.
- `out/`: exportación generada; está ignorada por Git.

## 4. Rutas existentes

| Ruta | Función | Estado |
| --- | --- | --- |
| `/` | Landing para elegir español o inglés | 200 local y producción |
| `/es`, `/en` | Home, intro, navegación, about, archivo y contacto | 200 |
| `/{locale}/photo/{id}` | Ficha individual; 30 IDs por idioma | 60 rutas SSG |
| `/{locale}/politica-uso` | Política de uso | 2 rutas SSG |
| `/opengraph-image` | Imagen social generada | Estática |
| `/robots.txt` | Directivas y sitemap | Estática; corregida |
| `/sitemap.xml` | 65 entradas públicas | Estática |
| `/.well-known/security.txt` | Contacto y política de seguridad | Estática |
| Ruta desconocida | 404 estática | Producción responde 404; `next dev` devuelve 500 por la restricción de export estático |

No existe una ruta separada de archivo: la galería es `/{locale}#gallery`. No
existe panel de administración ni carga de contenido desde la web.

## 5. Flujo de datos

1. `lib/gallery-data.ts` define orden, ID, título, categoría, año y descripción.
2. `lib/images-data.json` aporta dimensiones, variantes, blur, EXIF e histograma.
3. `app/[locale]/page.tsx` carga diccionario y metadatos en build.
4. `home-client.tsx` entrega ambos conjuntos a las secciones cliente.
5. `gallery.tsx` cruza ambos arrays por ID, filtra y construye Masonry/lightbox.
6. La ficha individual vuelve a cruzar catálogo y metadatos durante el build.

El estado interactivo es local: loader, categoría, lightbox, menú y formularios
usan `useState`; React Hook Form gestiona los formularios. No hay Context, Redux,
Zustand ni persistencia local.

## 6. Sistema de imágenes

`pnpm optimize-images` procesa `public/photos/raw/` y crea WebP/AVIF a 400,
800, 1200 y resolución original. También produce blur data URLs, EXIF e
histogramas en `lib/images-data.json`.

`next/image` usa `lib/image-loader.ts`, que selecciona el directorio por ancho.
Las tarjetas declaran `sizes`, reservan aspect ratio y cargan diferido salvo las
cuatro primeras. La ficha usa `object-contain`, dimensiones conocidas y blur.

Limitaciones confirmadas: las rutas AVIF se generan pero el loader conserva la
extensión recibida, por lo que la UI sirve WebP; la salida optimizada completa
ocupa 22,93 MB; el mayor original optimizado es `6.webp` con 605,1 KB; el script
no limpia derivados obsoletos ni falla el proceso global cuando una foto falla.

## 7. Sistema de idiomas

Los locales soportados son `es` y `en`. `lib/dictionary.ts` carga JSON de forma
dinámica en servidor. Las páginas home reciben el diccionario como prop.

La interfaz principal sí está traducida. Los títulos, descripciones y categorías
de las fotografías permanecen en español porque viven en un catálogo único. El
formulario de licencias, mensajes de Zod y parte del footer también tienen texto
español embebido. El `<html lang>` raíz está fijo en `es`, incluso en `/en`.

## 8. Fortalezas actuales

- Exportación estática pequeña en superficie operativa y sin backend que mantener.
- Rutas de fotografía deterministas y navegación circular anterior/siguiente.
- Pipeline reproducible de imágenes con dimensiones y placeholders.
- Caché de un año e `immutable` para imágenes en Cloudflare.
- CSP, HSTS, `nosniff`, DENY de frame y Permissions Policy desplegadas.
- Headings coherentes en home: un H1, H2 por sección y H3 por fotografía.
- Alt descriptivo en galería y ficha; hero decorativo con alt vacío.
- Foco global visible y controles principales semánticos.
- Motion actual limpia la mayoría de efectos mediante `useGSAP` y respeta
  `prefers-reduced-motion` en home, hero, loader, galería y Lenis.
- Catálogo, fuentes y derivados consistentes: 30 entradas publicadas y ningún ID
  publicado sin raw o metadatos.

## 9. Problemas encontrados

| Nivel | Descripción | Archivos afectados | Impacto | Recomendación | Corregido en Fase 0 |
| --- | --- | --- | --- | --- | --- |
| Alto | Un segmento desconocido se interpreta como locale; se añadió validación, pero `next dev` con `output: "export"` rechaza parámetros no generados antes de renderizar la 404. | `lib/dictionary.ts`, `app/[locale]/layout.tsx`, configuración de export | Las rutas válidas funcionan y producción responde 404; la comprobación local de una ruta desconocida devuelve 500. | Mantener la validación y probar la 404 sobre `out/`/Cloudflare; reevaluar el modo preview sin cambiar el despliegue. | Parcial |
| Alto | La home localizada renderiza inicialmente solo el loader; el contenido principal depende de hidratación y JavaScript. | `app/[locale]/home-client.tsx`, `components/loading-screen.tsx` | Sin JS o con fallo de hidratación no hay galería; riesgo SEO, a11y y resiliencia. | Mantener el contenido en el HTML y superponer el loader sin desmontarlo; usar `inert` temporal. | No |
| Alto | Carga inicial de `/es`: 14 JS, ~1044,8 KB sin comprimir; CSS ~65,4 KB. | `home-client.tsx` y dependencias de sus secciones | Parse/ejecución elevada, especialmente en móvil. | Separar lightbox, formularios y motion por sección; medir Brotli y Core Web Vitals antes/después. | No |
| Alto | El idioma del documento es `es` también en `/en`. | `app/layout.tsx` | Lectores de pantalla y motores reciben pronunciación/semántica incorrecta. | En Fase 1, mover el layout HTML bajo un segmento de idioma o adoptar una solución i18n compatible con export estático. | No |
| Alto | El contenido fotográfico no está internacionalizado. | `lib/gallery-data.ts`, fichas y galería | `/en` conserva títulos, alt, descripciones y categorías en español. | Separar contenido estable de sus campos localizados sin cambiar IDs ni URLs. | No |
| Medio | `robots.txt` apuntaba al dominio Workers antiguo. | `app/robots.ts` | Descubrimiento SEO del sitemap incorrecto. | Derivar la URL de `NEXT_PUBLIC_BASE_URL`. | Sí |
| Medio | El menú móvil cerrado seguía en el árbol accesible y era enfocable; varios targets medían 15–33 px. | `components/navigation.tsx`, `gallery.tsx`, `hero.tsx`, `contact.tsx` | Tabulación invisible y uso táctil difícil. | Aplicar `inert`, `aria-hidden`, 44 px mínimos y menú móvil en tablet. | Sí |
| Medio | La traducción del formulario de licencias y validaciones es parcial. | `components/contact.tsx`, diccionarios | Experiencia bilingüe inconsistente. | Llevar labels, opciones, errores, estados y footer a diccionarios. | No |
| Medio | La clave pública de Web3Forms está embebida y el componente mezcla integración, schemas y UI. | `components/contact.tsx` | Mayor superficie de abuso y mantenimiento; 475 líneas. | Confirmar restricciones de dominio en Web3Forms, documentar rotación y separar adaptador, schemas y vistas. | No |
| Medio | No hay ESLint real, formatter ni tests; `lint` es alias de `typecheck`. | `package.json` | Regresiones de hooks, a11y, imports o formato no se detectan. | Introducir herramientas de forma separada y gradual en una fase técnica, sin actualizar todo el stack. | No |
| Medio | `start` usa `next start`, incompatible conceptualmente con una exportación estática. | `package.json` | El script sugiere un modo de producción que no representa Cloudflare Assets. | Sustituirlo por un preview estático cuando se apruebe una dependencia/herramienta existente. | No |
| Medio | AVIF se genera pero no se negocia desde el loader. | `scripts/optimize-images.ts`, `lib/image-loader.ts` | Trabajo y almacenamiento duplicados sin beneficio confirmado al cliente. | Evaluar `<picture>` o una estrategia de loader compatible; no borrar variantes todavía. | No |
| Medio | Metadatos canonical/alternates se definen en raíz y no se especializan por foto/localización. | `app/layout.tsx`, metadata de páginas | Riesgo de canonical incorrecta y señales SEO ambiguas. | Auditar HTML final y definir canonical/hreflang por ruta en Fase 1. | No |
| Medio | La política anima siempre y Lenis desactiva globalmente `lagSmoothing` sin restaurarlo. | `politica-client.tsx`, `smooth-scroll.tsx` | Reduced motion incompleto y configuración global persistente. | Centralizar preferencias, media queries y ciclo de vida del ticker. | No |
| Medio | El hosting publicado devolvía 404 sin cuerpo descargado en la comprobación directa. | `app/not-found.tsx`, Cloudflare | Salida sin navegación de recuperación. | Generar una 404 mínima bilingüe y verificarla tras el próximo despliegue. | Sí en artefacto; pendiente de desplegar |
| Medio | El pipeline puede escribir JSON parcial y dejar derivados de raws eliminados. | `scripts/optimize-images.ts` | Catálogo inconsistente tras un fallo o retirada futura. | Generar en staging, validar todos los IDs y reemplazar de forma atómica. | No |
| Bajo | Hay primitivas UI y dependencias sin consumo confirmado. | `components/ui/*`, `next-themes`, `autoprefixer`, `@plaiceholder/next` | Peso de mantenimiento y posible deuda. | Confirmar con historial/uso antes de eliminar. | No |
| Bajo | `globals.css` contiene utilidades sin referencias (`scanline`, `mesh-bg`, `glass`, etc.). | `app/globals.css` | CSS y vocabulario visual obsoletos. | Depurar solo después de confirmar que no son parte de la Fase 1. | No |
| Bajo | README previo no explicaba entorno ni enlazaba documentación técnica. | `.gitignore`, `.env.example`, `README.md` | Onboarding incompleto. | Versionar ejemplo y enlazar auditoría/arquitectura. | Sí |
| Bajo | Hay discrepancia de nomenclatura entre repo/UI (`alexgallery`, `ALEX ARCHIVE`) y objetivo (`raw.vives`). | Metadata, componentes y despliegue | Riesgo de cambios de marca descoordinados. | Definir en Fase 1 qué cambia visualmente sin alterar URLs ni IDs. | No |

## 10. Problemas críticos

No se ha encontrado un fallo crítico en las rutas válidas de producción. La
validación compartida evita acceder a diccionarios inexistentes, pero el servidor
de desarrollo de Next con export estático sigue devolviendo 500 para parámetros
dinámicos que no forman parte de `generateStaticParams`. Producción devuelve 404
y el build genera una página 404 con navegación. Esta diferencia queda pendiente
de un preview estático representativo.

La dependencia de JavaScript para mostrar la home es el riesgo pendiente más
importante: no rompe el escenario normal validado, pero sí elimina todo el
contenido si la hidratación falla.

## 11. Mejoras recomendadas

1. Hacer que home y galería existan en el HTML visible antes del loader.
2. Resolver `lang`, canonical, hreflang e i18n fotográfica como una sola decisión.
3. Medir y dividir el JavaScript por sección antes de añadir más motion.
4. Centralizar motion y reduced motion sin cambiar todavía la dirección visual.
5. Traducir y separar el formulario; añadir labels visibles y autocomplete.
6. Robustecer el pipeline de imágenes con validación atómica.
7. Incorporar lint real, pruebas de rutas y una prueba E2E mínima de galería.

## 12. Riesgos técnicos

- La exportación estática impide depender de APIs o middleware de servidor.
- Cambiar la estructura `[locale]` puede alterar 64 URLs indexables.
- Un nuevo sistema de scroll puede duplicar Lenis/ScrollTrigger ya existentes.
- Dos motores declarativos/imperativos de motion pueden competir por transforms.
- Las imágenes son contenido protegido; cualquier pipeline debe preservar EXIF,
  licencia y rutas públicas.
- El formulario depende de un tercero y de su configuración externa.
- El catálogo es la fuente del orden: reordenarlo cambia anterior/siguiente.

## 13. Dependencias que conviene mantener

- Next.js, React y TypeScript: base actual y build estable.
- Tailwind 4: utilizado de forma extensiva.
- Sharp, Plaiceholder y Exifr: núcleo del pipeline.
- `react-masonry-css` y `yet-another-react-lightbox`: funcionalidad actual.
- React Hook Form y Zod: validación ya integrada.
- GSAP/ScrollTrigger y Lenis: ya forman parte del comportamiento publicado;
  consolidar antes de valorar cambios.
- Lucide: iconografía consistente.

## 14. Dependencias que conviene revisar

- Framer Motion: solapa responsabilidades con GSAP en About/Gallery.
- `next-themes`: no se referencia y la interfaz es negra fija.
- Autoprefixer: instalado, pero no aparece en la configuración PostCSS.
- `@plaiceholder/next`: no se referencia; sí se usa `plaiceholder` directo.
- Radix Slot, CVA, clsx y tailwind-merge: solo sostienen primitivas UI sin uso
  actual; conservar hasta confirmar intención futura.

No se ha eliminado ni actualizado ninguna dependencia en esta fase.

## 15. Propuesta de arquitectura para animaciones

Estructura compatible, todavía no implementada:

```text
components/
  motion/
    motion-boundary.tsx       # reduced motion, desktop/mobile y cleanup
    reveal.tsx                # primitiva opcional y accesible
hooks/
  motion/
    use-motion-preference.ts
    use-gsap-section.ts
    use-scroll-capability.ts
lib/
  motion/
    gsap.ts                   # registro único de plugins
    config.ts                 # duraciones, easings y breakpoints
    scroll.ts                 # coordinación Lenis/ScrollTrigger
    cleanup.ts                # restauración de ticker/timelines
motion/
  sections/
    hero.motion.ts
    gallery.motion.ts
    about.motion.ts
    contact.motion.ts
```

Principios: un único registro de GSAP; todo timeline ligado a scope; cleanup al
desmontar; `matchMedia` para escritorio/móvil; fallback sin transforms; contenido
usable antes de animar; efectos de sección fuera de sus datos; ninguna animación
obligatoria para navegar.

ScrollTrigger debería reutilizar un único adaptador con Lenis. WebGL futuro debe
ser un componente cliente dinámico, aislado, activado tras feature detection y
con fallback `<Image>`. No debe convertirse en requisito para ver la fotografía.

## 16. Línea base de rendimiento

Medición local sobre `pnpm build` y `out/es.html`:

- HTML: 50,8 KB.
- JavaScript referenciado inicialmente: 14 archivos, 1044,8 KB sin comprimir.
- CSS: 2 archivos, 65,4 KB sin comprimir.
- Fotografías raw: 31 archivos, 4,61 MB.
- Derivados optimizados: 248 archivos, 22,93 MB.
- Preloader: cuatro WebP originales, aproximadamente 329 KB antes de mostrar home.
- Mayor recurso de imagen: 605,1 KB.
- Build: compilación 3,9 s; TypeScript 4,9 s; 70 páginas generadas en 5,3 s.

Producción respondió desde Cloudflare con `CF-Cache-Status: HIT`; HTML usa
`must-revalidate` y las imágenes `max-age=31536000, immutable`. Los tiempos curl
observados fueron aproximadamente 0,10–0,18 s, no equivalentes a Core Web Vitals.
No se ha ejecutado Lighthouse de rendimiento; esta base debe complementarse con
LCP, CLS e INP en dispositivo real al iniciar Fase 1.

## 17. Estado de responsive

Se revisaron 375, 768, 1024 y 1440 px. No hubo scroll horizontal ni imágenes
rotas. El único elemento fuera del viewport es el texto decorativo gigante, que
está dentro de contenedores con overflow oculto. Las imágenes conservan proporción.

En 375 px el menú cerrado aparecía en el árbol accesible y el toggle medía 24 px.
Se corrigió con `inert`, `aria-hidden` y 44 px. En 768 px la navegación desktop
cabía de forma demasiado ajustada; ahora se conserva la navegación móvil hasta
1024 px. Filtros, CTA y tabs de contacto tienen altura mínima de 44 px.

No se detectó dependencia funcional exclusiva de hover. La galería mantiene
título y metadata visibles. No hay uso directo de `100vh` para el hero; usa
`min-height: 92vh`. El menú y loader usan overlays fijos, que deberán probarse
en Safari iOS real durante Fase 1.

## 18. Estado de accesibilidad

Correcto: landmarks principales, jerarquía de headings, alt, enlaces con nombre,
botones reales, foco global, `aria-pressed`, focus trap y retorno de foco en menú,
`aria-live` en formularios y regla CSS global para reduced motion.

Pendiente: `lang` incorrecto en inglés; contenido español en `/en`; textos con
opacidades `white/20`–`white/40` probablemente insuficientes; formularios sin
labels visibles ni `autocomplete`; política sin reduced motion; loader sin rol
de progreso ni alternativa no-JS; 404 nueva pendiente de desplegar; lightbox debe validarse
con lector de pantalla real.

## 19. Plan de preparación para la Fase 1

1. Congelar rutas, IDs, orden y snapshot visual actual.
2. Hacer progresivo el loader sin ocultar el HTML.
3. Resolver arquitectura de locale/`lang` antes de nuevos layouts.
4. Crear presupuesto: JS inicial, LCP, CLS, INP y peso por imagen.
5. Centralizar motion existente con los mismos efectos actuales.
6. Extraer adaptador Web3Forms y contenido localizado del formulario.
7. Añadir tests mínimos de rutas, filtros, lightbox, idioma y anterior/siguiente.
8. Solo entonces comenzar el sistema visual cinematográfico por secciones.

## 20. Lista priorizada de tareas

### P0 — antes del rediseño

- Renderizar contenido principal sin depender del loader cliente.
- Corregir `lang` e i18n de contenido sin cambiar URLs.
- Establecer presupuesto de bundle y Core Web Vitals.

### P1 — base de Fase 1

- Centralizar GSAP, ScrollTrigger, Lenis y reduced motion.
- Dividir JavaScript por sección y cargar lightbox bajo demanda real.
- Completar formularios bilingües, labels y configuración Web3Forms.
- Añadir 404 y pruebas E2E mínimas.

### P2 — mantenimiento

- Robustecer el pipeline de imágenes y decidir estrategia AVIF.
- Revisar dependencias y CSS sin uso con evidencia.
- Incorporar lint/format y limpiar scripts redundantes.
- Especializar canonical, hreflang y sitemap.
