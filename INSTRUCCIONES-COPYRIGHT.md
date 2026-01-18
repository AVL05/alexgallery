# 🔒 Instrucciones para Proteger tus Fotografías

## ✅ Cambios Implementados

### 1. Protección contra Descarga de Imágenes ✓
- ✅ Deshabilitado el menú contextual (click derecho) en todas las imágenes
- ✅ Deshabilitado el drag-and-drop de imágenes
- ✅ Protección aplicada tanto en la galería como en los modales

### 2. Página de Política de Uso ✓
- ✅ Nueva página en `/politica-uso` con:
  - Información de copyright
  - Términos de uso
  - Restricciones de uso no autorizado
  - Información sobre licencias disponibles
  - Detalles de metadatos embebidos
- ✅ Enlace agregado en la navegación principal

### 3. Formulario de Solicitud de Licencias ✓
- ✅ Formulario especializado en la sección de contacto con:
  - Selector entre "Contacto General" y "Solicitar Licencia"
  - Campos específicos: nombre, email, empresa, fotografía de interés, tipo de uso, descripción del proyecto
  - Opciones de tipo de uso: comercial, editorial, web, publicitario, impresión
- ✅ Interfaz intuitiva con iconos y diseño consistente

### 4. Metadatos de Copyright
Para agregar los metadatos de copyright a todas tus imágenes:

---

## 📋 Cómo Agregar Metadatos de Copyright

### Paso 1: Instalar ExifTool

#### Opción A: Descarga Manual
1. Ve a https://exiftool.org/
2. Descarga la versión para Windows
3. Extrae el archivo y renombra `exiftool(-k).exe` a `exiftool.exe`
4. Coloca el archivo en una carpeta en tu PATH o en el directorio del proyecto

#### Opción B: Con Chocolatey
```powershell
choco install exiftool
```

#### Opción C: Con Scoop
```powershell
scoop install exiftool
```

### Paso 2: Ejecutar el Script

Abre PowerShell en el directorio del proyecto y ejecuta:

```powershell
.\add-copyright-metadata.ps1
```

El script:
- ✅ Verificará que ExifTool esté instalado
- ✅ Procesará todas las imágenes .webp en la carpeta `public/`
- ✅ Agregará los siguientes metadatos a cada imagen:
  - **Artist**: Alex Vicente
  - **Copyright**: © Alex Vicente
  - **Creator**: Alex Vicente
  - **Rights**: All Rights Reserved
- ✅ Mostrará un resumen al finalizar

### Paso 3: Verificar los Metadatos (Opcional)

Para verificar que los metadatos se agregaron correctamente:

```powershell
exiftool public/1.webp
```

Deberías ver:
```
Artist                          : Alex Vicente
Copyright                       : © Alex Vicente
Creator                         : Alex Vicente
Rights                          : All Rights Reserved
```

---

## 🛡️ Nivel de Protección

### Protecciones Implementadas:
- ✅ **Prevención de descarga por navegador** (click derecho deshabilitado)
- ✅ **Prevención de drag-and-drop**
- ✅ **Metadatos embebidos en imágenes** (identificación del autor)
- ✅ **Términos legales claros** (página de política de uso)
- ✅ **Proceso formal de licencias** (formulario específico)

### ⚠️ Limitaciones:
Las protecciones del lado del cliente (JavaScript/CSS) pueden prevenir descargas casuales, pero usuarios técnicos aún pueden:
- Inspeccionar el código fuente
- Usar herramientas de desarrollador
- Capturar pantallas

### 🔐 Protecciones Adicionales Recomendadas:
1. **Marca de agua visible** en las imágenes de la galería
2. **Imágenes de baja resolución** para la web (guardar originales de alta resolución offline)
3. **Servidor con protección de hotlinking** (evita que otros sitios incrusten tus imágenes)
4. **Monitoreo de uso no autorizado** (Google Images, TinEye)

---

## 📝 Notas Importantes

- Los metadatos permanecen en las imágenes incluso si alguien logra descargarlas
- La página de política de uso está disponible en: `http://localhost:3000/politica-uso`
- El formulario de licencias está en la sección de contacto con un botón específico
- Todos los cambios son compatibles con el diseño existente

---

## 🚀 Próximos Pasos

1. **Instalar ExifTool** (ver instrucciones arriba)
2. **Ejecutar el script** `add-copyright-metadata.ps1`
3. **Verificar** que los metadatos se agregaron correctamente
4. **Desplegar** los cambios a producción
5. **Considerar** agregar marcas de agua si necesitas mayor protección

---

© 2025 Alex Vicente López. Todos los derechos reservados.
