# Changelog

Todos los cambios relevantes de raw.vives se documentan aquí. El proyecto sigue [Semantic Versioning](https://semver.org/) para releases públicas; una versión no existe hasta crear su tag.

## [Unreleased]

### Added

- CI reproducible para push y pull request.
- Pipeline manual de producción con smoke tests.
- Manifest, iconos y página de privacidad bilingüe.
- Documentación de despliegue, release y presentación profesional.
- Tests de contrato para el sistema de producción.

### Changed

- Runtime fijado en Node 22.22.2 y pnpm 10.34.1.
- Deployment unificado en Cloudflare Workers Static Assets.
- URL pública centralizada y metadata final normalizada.
- Caché y headers ampliados por clase de recurso.
- Formulario configurado mediante variable de build.

### Security

- Sources fotográficas excluidas del artefacto público.
- CSP, Permissions Policy, COOP y HSTS reforzados.
- Patrones de originales de cámara y catálogos añadidos a `.gitignore`.

### Fixed

- Sitemap dejó de incluir páginas `noindex`.
- El título de home dejó de duplicar el nombre del sitio.
- Robots dejó de depender del antiguo dominio Workers.

## Política

Los commits históricos anteriores a la adopción de este archivo siguen siendo la fuente de detalle. La primera release propuesta es `1.0.0`, una vez desplegada y validada con autorización.
