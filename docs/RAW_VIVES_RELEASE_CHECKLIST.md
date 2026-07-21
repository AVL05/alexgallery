# raw.vives — Checklist de release

Marca solo con evidencia del artefacto que se va a publicar.

## Código

- [x] Rama actual confirmada; no se ha creado ni cambiado de rama.
- [x] Typecheck y lint sin errores.
- [x] Tests 67/67.
- [x] Build estática completada.
- [x] `git diff --check` limpio.
- [x] Dependencias y lockfile coherentes.
- [x] `AGENTS.md` local permanece sin versionar.

## Contenido

- [x] Home, archivo, 30 fotografías y rutas ES/EN presentes.
- [x] Títulos, descripciones, categorías y años validados por el pipeline.
- [x] Contacto y política de privacidad localizados.
- [x] Capturas reales optimizadas y sin material ficticio.

## SEO

- [x] Canonical y `hreflang` apuntan al dominio final.
- [x] Robots generado con Host y sitemap correctos.
- [x] Sitemap con 63 URLs indexables.
- [x] JSON-LD de sitio e imágenes.
- [x] Open Graph, Twitter, manifest y favicons presentes.

## Rendimiento

- [x] Variantes WebP/AVIF y blur placeholders.
- [x] Chunks con caché inmutable y HTML revalidable.
- [x] WebGL/cursor condicionados por capacidad.
- [x] `out/photos/raw/` ausente.
- [ ] Web Vitals de campo medidos después del despliegue.

## Accesibilidad

- [x] Teclado, foco, Escape y restauración de foco verificados.
- [x] Reduced motion evita intro/WebGL.
- [x] Forced colors mantiene contenido y sin overflow.
- [x] Mobile menu y fullscreen comprobados.
- [ ] Auditoría manual con lector de pantalla en dispositivo real.

## Producción

- [x] Wrangler dry-run correcto.
- [x] Preview local: 200 ES/EN, 404 real y headers aplicados.
- [x] Pipeline de CI y deployment manual definidos.
- [x] GitHub environment y secretos confirmados.
- [ ] Preview remota creada y validada.
- [x] HTTP → HTTPS forzado mediante Single Redirect específica y comprobado.
- [ ] Restricción de dominio/anti-spam de Web3Forms revisada.
- [x] Version ID estable anterior registrado.

## Publicación

- [x] Autorización explícita recibida.
- [x] Workflow manual ejecutado.
- [x] Smoke tests de producción completados.
- [x] Consola y red sin errores propios.
- [x] Robots/sitemap públicos corresponden a esta release.
- [ ] Disponibilidad y formulario monitorizados.
- [ ] Tag y GitHub Release creados solo si se autorizan.

## Estado posterior al despliegue

La release está publicada y validada. Permanecen como tareas operativas
independientes la preview remota, la revisión anti-spam de Web3Forms, la medición
de Web Vitals de campo y una auditoría manual con lector de pantalla real.
