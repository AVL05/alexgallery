# RAW.VIVES — Brief para el rediseño cinematográfico con Premium Frontend Director

## Encargo

Hacer que `raw.vives` se perciba como **una exposición fotográfica cinematográfica de autor**, con cuidado artesanal en tipografía, montaje, microinteracciones, narrativa y rendimiento. El usuario busca una percepción de calidad comparable a una experiencia digital de alta gama; **no se promete un precio ni se imita a un estudio comercial**.

**Scope:** proyecto real `AVL05/alexgallery`. La web pública contiene fotografías personales, catálogo, series, archivo, fichas y contacto ES/EN. El objetivo no es «crear otra landing», sino mejorar la experiencia completa sin perder su identidad ni romper ningún contrato.

## Lo que se espera del agente

- Usar `premium-frontend-director` como **líder** con perfil **Premium**.
- `ui-ux-pro-max`: investigación de estilo, tipografía, patrones y accesibilidad en la fase inicial.
- `design-taste-frontend`: conceptos editoriales y dirección fotográfica, sin imponer sus presets.
- `impeccable`: crítica y pulido del render, anotando si la revisión independiente/overlay realmente ocurrió.
- `web-design-guidelines`: heurísticas de interfaz y accesibilidad. No sustituye un navegador.
- No cargar otros complementos de diseño salvo necesidad constatada. No auto-instalar skills adicionales.

## Cuatro elementos indispensables

1. **Fotografía real y autoría**: ningún recurso inventado suplanta fotografías propias; respetar licencias, ediciones y encuadres.
2. **Cine, no efectos**: ritmo, punto de vista, silencios, transiciones pertinentes; nada de intro larga, scroll-jacking o WebGL obligatorio.
3. **Diseño editorial útil**: el archivo sigue siendo exploratorio, con filtros y URLs; los metadatos se leen; las fichas funcionan.
4. **Calidad probada**: revisión real en Chrome y Playwright, responsive, accesibilidad básica, rendimiento comparado y exportación estática.

## Alcance y procedimiento

**Primero** revisar `AGENTS.md`, `PRODUCT.md`, `DESIGN.md` y el código; obtener capturas ANTES de editar. **Después** explorar tres direcciones y decidir con criterios documentados. **Finalmente** intervenir por capítulos (home → selección/series → archivo → detalle → cierre) revisando cada uno en navegador. Respetar cualquier cambio local no publicado.

### Entregables necesarios

- Informe inicial con capturas de referencia (375, 768, 1440, 1920 px), problemas y fortalezas del estado existente.
- Tres propuestas de arte diferenciadas, dirección elegida y registro de decisiones.
- Cambios locales en código y tokens, sin cambiar arquitectura de export estática ni el catálogo.
- Capturas DESPUÉS, pruebas de navegación y rutas en ambos idiomas.
- Evidencia de roles usados para cada skill, revisión Impeccable y Web Design Guidelines.
- Resultados `PASS / FAIL / NOT RUN`; informe de rendimiento comparado o `NOT RUN` si no medible.
- Sin commits, pushes, PR, ramas o despliegues sin una aprobación posterior.

## Prohibiciones explícitas

No tocar `public/photos/raw/` ni `lib/images-data.json` salvo mandato y ejecución del pipeline; no introducir fotos generadas; no cambiar IDs/orden/series; no inventar clientes, textos comerciales, premios o métricas; no eliminar prestaciones existentes para simplificar el diseño.

La dirección visual completa, tokens y criterios de calidad están en [`DESIGN.md`](../DESIGN.md). Los contratos técnicos vigentes se mantienen en [`AGENTS.md`](../AGENTS.md) y la definición del producto en [`PRODUCT.md`](../PRODUCT.md).
