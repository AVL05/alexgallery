# Preparar raw.vives para Codex — Premium Frontend Director

Esta guía prepara **una prueba local de rediseño**, no un despliegue. Se ejecuta desde la raíz del repositorio `alexgallery` en Windows PowerShell. No cambia las skills globales de Codex.

## 1. Verificar la copia local

```powershell
cd "C:\Users\alexv\Documents\Desarrollo\alexgallery"
git status --short
git branch --show-current
git pull --ff-only origin main
```

**Sustituye la ruta si tu clon se encuentra en otro directorio.** Si `git status` muestra cambios no publicados, **no ejecutes `git pull` ni limpies archivos** sin revisarlos; la preparación de GitHub no modifica tu copia local automáticamente.

La rama única deseada es `main`. Las ramas antiguas del servidor se limpian aparte; no hace falta crear ramas para esta prueba.

## 2. Archivar skills instaladas previamente en ESTE proyecto

`npx skills ls` desde la raíz del repositorio permite inspeccionar skills locales; `npx skills ls -g` lista las globales, que **no deben tocarse**.

Las skills locales pueden vivir en `.agents/skills`, `.codex/skills` o `.claude/skills`. El repositorio de GitHub **no versionaba ninguna** en el momento de esta preparación. Si hay copias locales preexistentes, archívalas fuera del proyecto antes de reinstalar:

```powershell
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backup = Join-Path $HOME "Documents\rawvives-skills-backup-$stamp"
New-Item -ItemType Directory -Force $backup | Out-Null

foreach ($relative in @(".agents\skills", ".codex\skills", ".claude\skills")) {
  $path = Join-Path (Get-Location) $relative
  if (Test-Path $path) {
    $destination = Join-Path $backup ($relative -replace "[\\/]", "_")
    Move-Item -LiteralPath $path -Destination $destination
    Write-Host "Archivado: $relative -> $destination"
  }
}
```

Este paso **solo mueve las carpetas locales de skills**, no modifica otras configuraciones, `AGENTS.md`, `DESIGN.md`, `PRODUCT.md`, tus fotografías o `~/.agents/skills`. Revisa lo que contiene cada ruta si tienes personalizaciones.

## 3. Instalar las cinco skills de Premium

Ejecuta los comandos en la raíz del proyecto y elige **Codex** y **project/local** cuando el instalador lo solicite. No uses el modo global (`-g`).

```powershell
# 1: coordinador
npx skills add https://github.com/AVL05/premium-frontend-director --skill premium-frontend-director

# 2: investigación UI/UX: usa su instalador nativo, ámbito de proyecto
npx ui-ux-pro-max-cli init --ai codex

# 3: dirección de arte
npx skills add https://github.com/Leonxlnx/taste-skill --skill design-taste-frontend

# 4: crítica visual: seleccionar Codex y ámbito local en los prompts
npx impeccable install

# 5: auditoría de interfaz
npx skills add vercel-labs/agent-skills --skill web-design-guidelines
```

**Requisitos:** Codex compatible con skills, Node.js 22+ para el instalador/Taste, Python 3 para la búsqueda de UI UX Pro Max y Chrome/Chromium para algunas funciones; el repositorio exige **Node 24.18.x y pnpm 11.20.x** para compilar la web.

Si Impeccable guarda una configuración `.impeccable/design.json`, es **estado local generado**, no la autoridad sobre el diseño; la fuente correcta es `DESIGN.md`. Revisa el alcance de sus hooks al instalar.

Comprueba con `npx skills ls` y en una **sesión nueva de Codex** que estén registradas e invocables, no solamente que existan sus carpetas. El instalador nativo UI UX Pro Max puede no aparecer en el lockfile del instalador genérico.

## 4. Archivos que debe leer Codex

**Lectura inicial y en este orden:**

1. `AGENTS.md` — límites técnicos, Git, rutas, pruebas y reglas.
2. `PRODUCT.md` — misión de archivo personal y audiencia.
3. `DESIGN.md` — dirección cinematográfica, tokens y gates.
4. `docs/RAW_VIVES_CINEMATIC_BRIEF.md` — alcance del rediseño.
5. `README.md` — comandos y mapa de proyecto.

**Lectura posterior bajo demanda:** docs de home/curación, archivo, series, fichas, motion/hero, SEO y deployment. Esos documentos pueden describir fases históricas: **corroborar primero el código real**.

## 5. Lanzar la prueba

Abrir `alexgallery` en Codex Desktop y abrir una conversación nueva. Pegar el prompt de rediseño preparado en el chat. Pedirle que primero compruebe `git status`, skills registradas y baseline de capturas.

Los comandos del proyecto son:

```powershell
corepack enable
pnpm install --frozen-lockfile
pnpm dev
# En otra terminal, desde el mismo repositorio:
pnpm typecheck
pnpm test
pnpm build
pnpm e2e
```

Para reproducir la exportación estática, `pnpm preview` **después de `pnpm build`**. `pnpm deploy:pages` publica y **NO** se ejecuta en la prueba.

## 6. Validaciones y seguridad

- Capturas antes/después a 375, 768, 1440, 1920 px en home/archivo/serie/ficha; navegación ES/EN.
- Comprobar fotos/IDs/URLs/series/SEO, filtros, contacto por `mailto:`, teclado, reduced-motion y fallbacks.
- Ejecutar Impeccable y Web Design Guidelines cuando estén de verdad disponibles.
- Reportar `PASS`, `FAIL`, `NOT RUN` y `USED`/`PARTIAL`/`NOT AVAILABLE` con evidencia.
- No instalar dependencias innecesarias, no tocar originales ni el catálogo y no hacer deploy, commit o push sin autorización.

## 7. Una sola rama en GitHub

**GitHub contiene cinco ramas secundarias antiguas.** El PR de Dependabot #10 fue cerrado sin fusionarlo. La configuración del repo pausa temporalmente las **PR automáticas de actualizaciones de versión**, pero puede seguir habiendo alertas o propuestas de seguridad.

Para dejar **solo `main`**, debe realizarse una limpieza de referencias de ramas desde GitHub (interfaz **Branches**) o GitHub CLI. **Revisa antes las ramas Divergentes**; sus cambios de dependencias no fueron fusionados, solo descartados para este ensayo. Copia los SHAs si quieres poder recuperarlos.

Con `gh` autenticado, tras revisar:

```powershell
gh api -X DELETE repos/AVL05/alexgallery/git/refs/heads/codex/migrate-cloudflare-pages
gh api -X DELETE repos/AVL05/alexgallery/git/refs/heads/dependabot/github_actions/actions/checkout-7.0.1
gh api -X DELETE repos/AVL05/alexgallery/git/refs/heads/dependabot/github_actions/actions/setup-node-7.1.0
gh api -X DELETE repos/AVL05/alexgallery/git/refs/heads/dependabot/npm_and_yarn/npm-minor-patch-97b10050bc
gh api -X DELETE repos/AVL05/alexgallery/git/refs/heads/dependabot/npm_and_yarn/three-0.186.1
```

Estas órdenes **eliminan ramas remotas** y pueden dejar inalcanzables cambios no fusionados. No afectan a `main`. No las ejecutes hasta decidir que prescindes de los commits pendientes de Dependabot.
