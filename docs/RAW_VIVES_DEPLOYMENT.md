> Actualización 2026-10-15: contacto y licencias usan solo borradores `mailto:`. No hay proveedor externo de formularios, clave de acceso ni POST. Las menciones al proveedor anterior en registros de auditoría describen el estado histórico. Para validar: comprobar asunto, cuerpo y destino del borrador; no confundir apertura con envío.

# raw.vives — Despliegue y operación

## 1. Plataforma

Cloudflare Pages sirve el export estático de Next.js. `wrangler.json` define el proyecto `alexgallery`, el directorio `out/` y la fecha de compatibilidad de Pages Functions. El subdominio técnico asignado es `alexgallery-83x.pages.dev`; el dominio canónico es `rawvives.aleviclop.dev`.

## 2. Requisitos

Git, Node 24.18.0, Corepack, pnpm 11.20.0, acceso a Cloudflare Pages y permisos sobre el GitHub environment `production`.

## 3. Versiones

`.nvmrc`, `packageManager`, `engines` y el lockfile fijan el contrato. Wrangler está anclado a `4.118.0`.

## 4. Variables

| Nombre | Lugar | Carácter |
| --- | --- | --- |
| `NEXT_PUBLIC_BASE_URL` | Pages, producción y preview | URL pública de build |
| `NODE_VERSION` | Pages, producción y preview | Node exacto de build |
| `PNPM_VERSION` | Pages, producción y preview | pnpm exacto de instalación |

No registrar valores en el repositorio ni en logs. Las variables `NEXT_PUBLIC_*` terminan visibles en el cliente.

### Auditoría de credenciales (2026-07-21)

GitHub no contiene secretos de repositorio ni variables duplicadas. El environment
`production` contiene exactamente `CLOUDFLARE_API_TOKEN`,
`CLOUDFLARE_ACCOUNT_ID` y `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`; solo el job de
despliegue asociado a ese environment puede resolverlos.

| Token Cloudflare | Último uso visible | Alcance observado | Clasificación |
| --- | --- | --- | --- |
| `raw-vives production deploy` | 2026-07-21 | Workers Scripts: Edit en la cuenta requerida; Workers Routes: Edit solo en `aleviclop.dev` | Mantener |
| `photography-app build token` | 2026-06-17 | 23 permisos, una cuenta y todas las zonas | Revisión manual; permisos excesivos |
| `alexgallery build token` (uso 2026-07-21) | 2026-07-21 | 21 permisos, una cuenta y todas las zonas | Revisión manual; probable credencial heredada y permisos excesivos |
| `alex-gallery build token` | Sin uso registrado | 21 permisos, una cuenta y todas las zonas | Candidato a revocación; permisos excesivos |
| `alexgallery build token` (uso 2026-01-19) | 2026-01-19 | 21 permisos, una cuenta y todas las zonas | Candidato a revocación tras confirmar consumidores; permisos excesivos |

Cloudflare no mostró la fecha de creación en el inventario disponible. No se
revocó ni modificó ninguna credencial durante la auditoría. Antes de retirar un
token heredado hay que identificar su consumidor y verificar un ciclo completo
con su sustituto de mínimo privilegio.

## 5. Instalación

```powershell
corepack enable
pnpm install --frozen-lockfile
```

## 6. Build

```powershell
$env:NEXT_PUBLIC_BASE_URL='https://rawvives.aleviclop.dev'
pnpm build
```

La build valida el proceso fotográfico, exporta, normaliza los nombres de los
segmentos de navegación generados en Windows y ejecuta `prune-private-assets`.
La normalización conserva los archivos originales y genera además
`opengraph-image.png` desde el endpoint exportado, para que Pages sirva la imagen
social con el tipo MIME correcto. `pnpm export` usa esta misma secuencia.

## 7. Output

`out/` es el único artefacto desplegable. Debe contener HTML, chunks, variantes optimizadas, `_headers`, `robots.txt`, `sitemap.xml` y manifest; no debe contener `photos/raw`.

## 8. Dominio

El canonical es `https://rawvives.aleviclop.dev`. No cambiarlo sin actualizar variable, dominio de Pages, metadata y smoke tests.

## 9. DNS

El subdominio usa un CNAME DNS-only hacia `alexgallery-83x.pages.dev` y está asociado como dominio personalizado del proyecto Pages. Activar el proxy sobre ese CNAME produjo 522 durante la validación; mantener DNS-only y verificar desde una red externa tras cada cambio.

## 10. HTTPS

El certificado observado cubre `aleviclop.dev`. Cloudflare aplica la Single
Redirect Rule `raw.vives HTTP to HTTPS`, limitada al patrón
`https://gallery.aleviclop.dev/*`, con destino
`https://rawvives.aleviclop.dev/${1}`, estado `308` y conservación de query. La
regla preserva ruta y parámetros sin afectar a otros hosts de la zona. HSTS solo
protege después de una visita HTTPS y no sustituye la redirección.

## 11. Headers

`public/_headers` define CSP, HSTS, `X-Content-Type-Options`, referrer, frame protection, COOP y policies. Cloudflare aplica `_headers` a respuestas de Static Assets; cualquier origen externo nuevo requiere revisar CSP.

El build ejecuta `scripts/secure-static-export.ts` sobre todos los HTML, incluido
el 404. Inserta tras el charset y antes de cualquier script una segunda CSP con hashes
SHA-256 de los scripts de esa página. Ambas políticas se aplican conjuntamente:
el `unsafe-inline` de la cabecera no autoriza scripts que la política del HTML
bloquea. Esto mantiene la exportación estática sin nonces de servidor ni superar
los límites de `_headers` de Pages (100 reglas y 2.000 caracteres por línea).
Los estilos inline siguen permitidos por las animaciones existentes. No editar
los HTML después de este paso: cualquier cambio en un script invalida su hash.

Las redirecciones de idioma y del dominio anterior incluyen sus propias
cabeceras de seguridad, ya que las respuestas de Functions no heredan `_headers`.
CI audita las dependencias y bloquea avisos altos o críticos; Dependabot propone
actualizaciones semanales de paquetes y GitHub Actions sin fusionarlas.

## 12. Caché

- HTML: `max-age=0, must-revalidate`.
- Chunks versionados: un año, `immutable`.
- Fotos optimizadas: un día y una semana de stale-while-revalidate.
- Iconos/OG: un día.
- Robots, sitemap y manifest: una hora.

## 13. Compresión

Cloudflare negocia Brotli/gzip en el edge. Validar con `curl.exe --compressed -I`; no precomprimir el repositorio.

## 14. Redirects

No hay alias antiguo válido. El viejo `alexgallery.alexviclop.workers.dev` devuelve 404 y `www.gallery...` no resuelve. Si se publica un alias futuro, usar 301/308 hacia el canonical y probar query/hash.

## 15. Robots

Debe apuntar a `https://rawvives.aleviclop.dev/sitemap.xml`, permitir `/` y declarar Host. La versión actualmente pública estaba desactualizada antes de esta release.

## 16. Sitemap

La build genera 72 URLs indexables: dos homes, 62 detalles, dos índices de
series y seis páginas de serie. La raíz resuelve idioma y queda fuera del sitemap;
privacidad y política de uso se excluyen por decisión editorial.

## 17. Analytics

No hay analítica de aplicación ni eventos de producto. No añadir scripts hasta definir finalidad, minimización, retención y obligaciones de consentimiento.

## 18. Privacidad

El sitio no persiste analítica. La cookie funcional `raw-vives-locale` conserva únicamente `es` o `en` durante un año para respetar la elección manual. El formulario prepara un borrador mailto, sin enviar ni almacenar el mensaje; la página `/[locale]/privacidad` explica el almacenamiento, el encargado y los derechos.

## 18.1 Resolución de idioma

El Worker intercepta exclusivamente `/` antes de servir los assets estáticos. Responde con `307`, conserva la query y aplica esta prioridad: cookie válida, idioma principal de `Accept-Language` y fallback inglés. Solo `es` y variantes `es-*` resuelven a `/es`; el resto resuelve a `/en`. Las rutas localizadas nunca se redirigen. Un script mínimo en la página raíz conserva además el fragmento cuando el Worker no está disponible, sin renderizar una pantalla intermedia.

El selector ES/EN guarda la cookie con `Path=/`, `Max-Age=31536000`, `SameSite=Lax` y `Secure`, y sustituye únicamente el prefijo de idioma, conservando ruta, query y hash.

## 19. Preview

Local: `pnpm preview`. Remoto: `pnpm exec wrangler pages deploy --branch release-candidate`; Pages genera una URL de preview y un alias de rama. No usar datos reales en previews públicas.

Reiniciar la preview después de reconstruir `out/` para evitar mezclar cachés y
datos de navegación de builds distintos. `pnpm e2e` usa Wrangler y comprueba
también navegación mediante clics, filtros de tablet, borradores y metadatos.

## 20. Producción

La integración Git de Pages construye y publica cada commit de `main`. Cloudflare
usa `pnpm build`, sirve `out/` y compila `functions/`. Revisar CI antes de promover
cambios y completar smoke de ES, EN, robots, sitemap, formulario, 404 y fuentes
privadas. `pnpm deploy:pages` queda como fallback manual con autenticación Wrangler.

## 21. Logs

Revisar el run de GitHub y el detalle del deployment Pages. Para Pages Functions: `pnpm exec wrangler pages deployment tail --project-name alexgallery --environment production`. Observar la función de `/`, estados HTTP y errores de build.

## 22. Monitorización

Mínimo operativo: disponibilidad de `/es`, `/en`, una foto, `robots.txt` y `sitemap.xml`, más certificado y formulario. No se configura un proveedor nuevo en esta release; asignar responsable y frecuencia antes de producción.

## 23. Rollback

Antes de publicar, anotar el deployment estable con `pnpm exec wrangler pages deployment list --project-name alexgallery`. Ante regresión, usar Rollback en Pages sobre ese deployment, comprobar el dominio y documentar el incidente.

## 24. Verificación

```powershell
pnpm check
pnpm exec wrangler pages functions build --outdir .wrangler/tmp/pages-functions
curl.exe -I https://rawvives.aleviclop.dev/es
curl.exe https://rawvives.aleviclop.dev/robots.txt
curl.exe -I https://rawvives.aleviclop.dev/es/photo/21
curl.exe -I https://rawvives.aleviclop.dev/no-existe-phase-12
```

Completar también [RAW_VIVES_RELEASE_CHECKLIST.md](RAW_VIVES_RELEASE_CHECKLIST.md).

## 25. Problemas comunes

- Canonical incorrecto: revisar `NEXT_PUBLIC_BASE_URL` y reconstruir.
- Correo no abierto: comprobar que el dispositivo tiene una aplicación asociada a mailto; el borrador puede volver a abrirse desde el enlace de estado.
- Rutas 404: confirmar `html_handling`/`not_found_handling` y que `out/` es reciente.
- Assets viejos: inspeccionar cache headers, esperar TTL o purgar con alcance mínimo.
- Build `EBUSY` en Windows: cerrar `pnpm preview`; Wrangler mantiene archivos de `out/` abiertos y Next necesita regenerar el directorio.
- Preview local con errores HTTPS: HSTS puede quedar memorizado por el navegador en localhost; usar un perfil limpio o curl. Producción debe probarse siempre por HTTPS.

## 26. Cómo publicar

1. Confirmar CI verde y árbol de trabajo esperado.
2. Configurar variables/secrets del proyecto Pages.
3. Validar una preview remota.
4. Registrar el deployment estable actual.
5. Promover el commit validado a `main`.
6. Esperar el deployment Pages y completar smoke tests.
7. Crear tag/release solo si el usuario lo autoriza.

## 27. Cómo revertir

Seleccionar un deployment estable conocido, hacer rollback desde Wrangler o Dashboard, validar todas las rutas críticas y registrar causa/versión. No reconstruir una versión antigua como sustituto de un rollback versionado.

## 28. Cómo validar después

Probar Home ES/EN, idioma, archivo, filtro, búsqueda, load more, detalle, navegación, fullscreen, compartir/copiar, 404, mobile, reduced motion, fallback WebGL, headers, red y consola. Confirmar además que HTTP redirige a HTTPS, robots/sitemap usan el dominio y `/photos/raw/*` responde 404.

## Auditoría de tokens heredados (21-07-2026)

No se registran valores de credenciales. La revisión cubrió secrets y environments de los repositorios accesibles de `AVL05`, workflows, Wrangler, configuraciones locales y proyectos relacionados disponibles.

| Token | Evidencia | Decisión |
| --- | --- | --- |
| `raw-vives production deploy` | Consumidor confirmado: environment `production` de `AVL05/alexgallery`; permisos limitados a editar el Worker y su ruta. Despliegue validado. | Mantener sin cambios. |
| `alexgallery build token` (último uso 21-07-2026) | Token amplio ya sustituido por el anterior; el environment no conserva duplicados y el despliegue con el reemplazo fue correcto. | Revocado tras validar el reemplazo. |
| `alex-gallery build token` (nunca usado) | Sin uso, secrets, workflow ni configuración consumidora. | Revocado. |
| `photography-app build token` (último uso 17-06-2026) | La nota local apunta a un checkout `photography-app` que ya no existe; no aparece un repositorio o secret accesible que permita reemplazarlo con seguridad. | Pendiente de identificación; no revocar. |
| `alexgallery build token` (último uso 19-01-2026) | No existe consumidor actual verificable y el nombre duplicado no permite atribuir el uso histórico. | Pendiente de identificación; no revocar. |

El environment `production` mantiene únicamente `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` y `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`. No hay secrets Cloudflare en otros repositorios accesibles. Cualquier limpieza futura de los dos tokens pendientes debe partir de un consumidor identificado o de registros de auditoría concluyentes.

## Referencias operativas

- [Cloudflare Pages headers](https://developers.cloudflare.com/pages/configuration/headers/)
- [Cloudflare Pages local development](https://developers.cloudflare.com/pages/functions/local-development/)
- [Cloudflare Pages preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/)
- [Cloudflare Pages rollbacks](https://developers.cloudflare.com/pages/configuration/rollbacks/)
- [Cloudflare Pages deployment logs](https://developers.cloudflare.com/pages/configuration/debugging-pages/)
- [Cloudflare Single Redirects](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/)
- [Cloudflare wildcard redirects](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/settings/#wildcard-url-redirect)
