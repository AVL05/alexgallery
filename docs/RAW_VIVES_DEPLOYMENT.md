# raw.vives — Despliegue y operación

## 1. Plataforma

Cloudflare Workers Static Assets sirve un export estático de Next.js. `wrangler.json` es la fuente de verdad del servicio `alexgallery` y del dominio `gallery.aleviclop.dev`.

## 2. Requisitos

Git, Node 22.22.2, Corepack, pnpm 10.34.1, acceso a Cloudflare y permisos sobre el GitHub environment `production`.

## 3. Versiones

`.nvmrc`, `packageManager`, `engines` y el lockfile fijan el contrato. Wrangler está anclado a `4.112.0`.

## 4. Variables

| Nombre | Lugar | Carácter |
| --- | --- | --- |
| `NEXT_PUBLIC_BASE_URL` | GitHub environment variable | URL pública de build |
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | GitHub environment secret | Identificador público inyectado en build |
| `CLOUDFLARE_API_TOKEN` | GitHub environment secret | Credencial de despliegue |
| `CLOUDFLARE_ACCOUNT_ID` | GitHub environment secret | Cuenta de destino |

No registrar valores en el repositorio ni en logs. Las variables `NEXT_PUBLIC_*` terminan visibles en el cliente.

## 5. Instalación

```powershell
corepack enable
pnpm install --frozen-lockfile
```

## 6. Build

```powershell
$env:NEXT_PUBLIC_BASE_URL='https://gallery.aleviclop.dev'
$env:NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY='public-form-key'
pnpm build
```

La build valida el proceso fotográfico, exporta y ejecuta `prune-private-assets`.

## 7. Output

`out/` es el único artefacto desplegable. Debe contener HTML, chunks, variantes optimizadas, `_headers`, `robots.txt`, `sitemap.xml` y manifest; no debe contener `photos/raw`.

## 8. Dominio

El canonical es `https://gallery.aleviclop.dev`. No cambiarlo sin actualizar variable, route de Wrangler, metadata y smoke tests.

## 9. DNS

El subdominio está proxied por Cloudflare. La route `custom_domain` vincula el Worker. Verificar desde una red externa tras cada cambio DNS.

## 10. HTTPS

El certificado observado cubre `aleviclop.dev`. Activar manualmente **Always Use HTTPS** o una regla equivalente: la auditoría previa comprobó que HTTP aún respondía `200`. HSTS solo protege después de una visita HTTPS y no sustituye la redirección.

## 11. Headers

`public/_headers` define CSP, HSTS, `X-Content-Type-Options`, referrer, frame protection, COOP y policies. Cloudflare aplica `_headers` a respuestas de Static Assets; cualquier origen externo nuevo requiere revisar CSP.

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

Debe apuntar a `https://gallery.aleviclop.dev/sitemap.xml`, permitir `/` y declarar Host. La versión actualmente pública estaba desactualizada antes de esta release.

## 16. Sitemap

La build esperada genera 63 URLs: raíz, dos homes y 60 detalles. Privacidad y política de uso se excluyen por decisión editorial.

## 17. Analytics

No hay analítica de aplicación ni eventos de producto. No añadir scripts hasta definir finalidad, minimización, retención y obligaciones de consentimiento.

## 18. Privacidad

El sitio no establece cookies propias ni persiste analítica. El formulario envía nombre, email, mensaje o solicitud de licencia a Web3Forms; la página `/[locale]/privacidad` explica el encargado y derechos.

## 19. Preview

Local: `pnpm preview`. Remoto recomendado: `pnpm exec wrangler versions upload --preview-alias release-candidate`, con Preview URLs habilitadas y, si procede, Cloudflare Access. Una preview URL es pública por defecto y actualmente no ofrece logs de Worker; no usar datos reales.

## 20. Producción

Abrir Actions → `Deploy production` → `Run workflow`. El job repite validaciones, construye, despliega y hace smoke de ES, EN, robots, sitemap y 404. No usar push como disparador de producción.

## 21. Logs

Revisar el run de GitHub y el panel de Workers. Para diagnóstico en tiempo real: `pnpm exec wrangler tail`. Static Assets no contiene lógica de aplicación propia; observar sobre todo estados HTTP, deployment y cuota.

## 22. Monitorización

Mínimo operativo: disponibilidad de `/es`, `/en`, una foto, `robots.txt` y `sitemap.xml`, más certificado y formulario. No se configura un proveedor nuevo en esta release; asignar responsable y frecuencia antes de producción.

## 23. Rollback

Antes de publicar, anotar el version ID estable con `pnpm exec wrangler deployments list`. Ante regresión: detener cambios, ejecutar `pnpm exec wrangler rollback <VERSION_ID> --message "rollback phase 12"`, comprobar el dominio y documentar el incidente. Cloudflare crea inmediatamente un nuevo deployment con la versión elegida.

## 24. Verificación

```powershell
pnpm check
pnpm exec wrangler deploy --dry-run
curl.exe -I https://gallery.aleviclop.dev/es
curl.exe https://gallery.aleviclop.dev/robots.txt
curl.exe -I https://gallery.aleviclop.dev/es/photo/21
curl.exe -I https://gallery.aleviclop.dev/no-existe-phase-12
```

Completar también [RAW_VIVES_RELEASE_CHECKLIST.md](RAW_VIVES_RELEASE_CHECKLIST.md).

## 25. Problemas comunes

- Canonical incorrecto: revisar `NEXT_PUBLIC_BASE_URL` y reconstruir.
- Formulario no disponible: comprobar secret del environment y restricciones de Web3Forms.
- Rutas 404: confirmar `html_handling`/`not_found_handling` y que `out/` es reciente.
- Assets viejos: inspeccionar cache headers, esperar TTL o purgar con alcance mínimo.
- Build `EBUSY` en Windows: cerrar `pnpm preview`; Wrangler mantiene archivos de `out/` abiertos y Next necesita regenerar el directorio.
- Preview local con errores HTTPS: HSTS puede quedar memorizado por el navegador en localhost; usar un perfil limpio o curl. Producción debe probarse siempre por HTTPS.

## 26. Cómo publicar

1. Confirmar CI verde y árbol de trabajo esperado.
2. Configurar variables/secrets del environment.
3. Validar una preview remota.
4. Registrar deployment estable actual.
5. Ejecutar el workflow manual.
6. Completar smoke tests y monitorizar.
7. Crear tag/release solo si el usuario lo autoriza.

## 27. Cómo revertir

Seleccionar un deployment estable conocido, hacer rollback desde Wrangler o Dashboard, validar todas las rutas críticas y registrar causa/versión. No reconstruir una versión antigua como sustituto de un rollback versionado.

## 28. Cómo validar después

Probar Home ES/EN, idioma, archivo, filtro, búsqueda, load more, detalle, navegación, fullscreen, compartir/copiar, 404, mobile, reduced motion, fallback WebGL, headers, red y consola. Confirmar además que HTTP redirige a HTTPS, robots/sitemap usan el dominio y `/photos/raw/*` responde 404.

## Referencias operativas

- [Cloudflare Static Assets headers](https://developers.cloudflare.com/workers/static-assets/headers/)
- [Cloudflare local development](https://developers.cloudflare.com/workers/local-development/)
- [Cloudflare Preview URLs](https://developers.cloudflare.com/workers/versions-and-deployments/preview-urls/)
- [Cloudflare Workers rollbacks](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/)
- [Cloudflare Workers logs](https://developers.cloudflare.com/workers/observability/logs/)
