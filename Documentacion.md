# 📌 Nombre del Proyecto

**[Nombre del proyecto]**

**Descripción breve:** [Descripción del objetivo principal del proyecto].

**Objetivo:** [Qué problema resuelve y para quién].

**Contexto:** [Producto/cliente/ámbito de uso].

# 🏗️ Arquitectura del Proyecto

Este proyecto está construido con **Next.js (App Router)** sobre **React + TypeScript**. La estructura sigue una separación clara entre rutas, componentes de UI, hooks reutilizables y utilidades de dominio.

- **Rutas y páginas:** `app/` contiene las rutas y layouts usando App Router.
- **Componentes UI y secciones:** `components/` agrupa componentes reutilizables y secciones de pantalla.
- **Hooks personalizados:** `hooks/` centraliza lógica reutilizable de estado/efectos.
- **Utilidades y datos:** `lib/` concentra helpers, datos estáticos y funciones de soporte.
- **Assets estáticos:** `public/` contiene imágenes y recursos públicos.

**Patrón de arquitectura:**

- **Component-based UI** (React)
- **App Router** (Next.js) como orquestador de rutas, layouts y rendering
- **Capas ligeras**: UI en `components/`, lógica reutilizable en `hooks/`, utilidades en `lib/`

# 📁 Estructura de Carpetas

```text
alexgallery/
├─ app/                      # Rutas y layouts (App Router)
│  ├─ layout.tsx              # Layout raíz de la app
│  ├─ page.tsx                # Página principal
│  └─ politica-uso/           # Ruta secundaria
│     └─ page.tsx             # Página de política de uso
├─ components/               # Componentes reutilizables y secciones
│  ├─ ui/                     # Componentes UI básicos (botones, inputs, etc.)
│  ├─ hero.tsx
│  ├─ gallery.tsx
│  ├─ contact.tsx
│  └─ ...
├─ hooks/                    # Hooks personalizados
│  └─ use-typewriter.ts
├─ lib/                      # Utilidades y datos
│  ├─ gallery-data.ts         # Datos de galería
│  └─ utils.ts                # Helpers compartidos
├─ public/                   # Assets estáticos (imágenes, favicon, etc.)
├─ out/                      # Build estático exportado (si aplica)
├─ package.json              # Scripts y dependencias
├─ next.config.mjs           # Configuración de Next.js
├─ tsconfig.json             # Configuración de TypeScript
└─ postcss.config.mjs        # Configuración de PostCSS
```

# ⚙️ Instalación y Configuración

## Requisitos previos

- **Node.js** [versión recomendada]
- **npm** (o gestor compatible)

## Instalación de dependencias

```bash
npm install
```

## Variables de entorno

Actualmente no hay archivos `.env` en el proyecto. Si se requieren variables, crear un archivo `.env.local` y documentarlas aquí:

```env
# Ejemplo
NEXT_PUBLIC_API_BASE_URL=https://api.ejemplo.com
```

# 🚀 Scripts Disponibles

Definidos en `package.json`:

- `dev`: entorno de desarrollo con Next.js
- `build`: build de producción
- `start`: servidor de producción
- `lint`: linting con Next.js
- `export`: alias de build (según configuración actual)
- `deploy:wrangler`: build + despliegue con Wrangler (Cloudflare)

Ejemplos:

```bash
npm run dev
npm run build
npm run start
```

# 🧩 Tecnologías Utilizadas

- **Next.js** (App Router)
- **React**
- **TypeScript**
- **Tailwind CSS** + **PostCSS**
- **Framer Motion** (animaciones)
- **react-hook-form** + **zod** (formularios y validación)
- **Radix UI** (primitives UI)
- **lucide-react** (iconos)

# 🔄 Flujo de la Aplicación

## Navegación

La navegación se basa en **App Router**. Las rutas viven en `app/` y cada carpeta representa una ruta. `layout.tsx` define el layout global y `page.tsx` la página raíz.

## Gestión de estado

El estado local y la lógica reutilizable se encapsulan en **hooks personalizados** dentro de `hooks/`. Para estados globales, se recomienda usar contextos de React o una librería específica si el alcance crece.

## Consumo de APIs

Actualmente no hay una capa de servicios explícita. Si se integra una API, se recomienda centralizar las llamadas en `lib/` o crear una carpeta `services/` para mantener la lógica de acceso a datos desacoplada de los componentes.

# 📡 Comunicación con API

**Patrón recomendado:**

- Crear funciones por recurso (por ejemplo `lib/api/*` o `services/*`).
- Usar `fetch` o un cliente HTTP y normalizar respuestas.
- Manejar errores con try/catch y devolver errores tipados.

Ejemplo base:

```ts
export async function getItems() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/items`);
  if (!res.ok) throw new Error('Error al obtener items');
  return res.json();
}
```

# 🎨 Estilos y UI

El proyecto usa **Tailwind CSS** con configuración en `postcss.config.mjs`. Los componentes UI están organizados en `components/ui/` y las secciones de página en `components/`.

- **Estilos globales:** `app/globals.css`
- **Componentes UI:** `components/ui/*`
- **Componentes de sección:** `components/*`

# 🧪 Testing (si aplica)

Actualmente no hay herramientas de testing configuradas en `package.json`. Si se incorporan, documentar aquí el framework y comandos, por ejemplo:

```bash
npm run test
```

# 📦 Build y Despliegue

## Build

```bash
npm run build
```

## Opciones de despliegue

- **Servidor Node.js**: `npm run start`
- **Despliegue estático**: usar `npm run export` (si la configuración permite exportación estática)
- **Cloudflare Wrangler**: `npm run deploy:wrangler`

# ⚠️ Buenas Prácticas

- Mantener componentes pequeños y reutilizables.
- Evitar lógica de negocio en componentes de UI.
- Tipar todas las props y respuestas de API.
- Centralizar utilidades en `lib/`.
- Documentar cualquier nueva variable de entorno.
- Mantener consistencia en nombres de archivos y componentes.

# 📄 Licencia

Ver el archivo `LICENSE` para detalles legales.
