# 📧 Configurar Envío de Emails

Para que los formularios de contacto y solicitud de licencias funcionen, necesitas obtener una **API Key gratuita de Web3Forms**.

## 🚀 Pasos para Configurar

### 1. Registrarse en Web3Forms

1. Ve a **https://web3forms.com/**
2. Haz clic en **"Get Started Free"**
3. Ingresa tu email: **alexviclop@gmail.com**
4. Recibirás un email de confirmación
5. Haz clic en el enlace de confirmación del email

### 2. Obtener tu Access Key

1. Una vez confirmado, inicia sesión en https://web3forms.com/
2. Copia tu **Access Key** (es una cadena larga de caracteres)
3. Se ve algo así: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

### 3. Agregar la Access Key al Código

Abre el archivo `components/contact.tsx` y busca estas dos líneas (aparecen dos veces):

```typescript
access_key: "YOUR_WEB3FORMS_KEY", // Necesitas registrarte en web3forms.com
```

Reemplázalas con tu Access Key:

```typescript
access_key: "tu-access-key-aqui",
```

### 4. Ejemplo Completo

Antes:
```typescript
body: JSON.stringify({
  access_key: "YOUR_WEB3FORMS_KEY",
  subject: "Nuevo mensaje de contacto - Galería Fotográfica",
  from_name: formData.name,
  email: formData.email,
  message: formData.message,
}),
```

Después:
```typescript
body: JSON.stringify({
  access_key: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", // Tu key real
  subject: "Nuevo mensaje de contacto - Galería Fotográfica",
  from_name: formData.name,
  email: formData.email,
  message: formData.message,
}),
```

### 5. Guardar y Probar

1. Guarda los cambios en `components/contact.tsx`
2. Recarga tu aplicación si está corriendo
3. Prueba enviando un formulario
4. Deberías recibir el email en **alexviclop@gmail.com**

## ✨ Características

Una vez configurado, recibirás:

### Formulario de Contacto General:
- Nombre del remitente
- Email del remitente
- Mensaje

### Formulario de Solicitud de Licencia:
- Nombre completo
- Email
- Empresa/Organización
- Fotografía de interés
- Tipo de uso (comercial, editorial, web, etc.)
- Descripción del proyecto

## 🔒 Seguridad

- **100% gratuito** (hasta 250 envíos/mes)
- No requiere backend propio
- Sin configuración de servidor
- Anti-spam incluido
- GDPR compliant

## 🆘 Solución de Problemas

### No llegan los emails:
1. Verifica que copiaste bien la Access Key (sin espacios extra)
2. Revisa la carpeta de spam en tu Gmail
3. Confirma tu email en Web3Forms

### Error al enviar:
1. Abre la consola del navegador (F12)
2. Revisa si hay errores
3. Verifica que tienes internet

## 📝 Alternativa: Usar Variable de Entorno

Para mayor seguridad, puedes guardar tu Access Key en una variable de entorno:

1. Crea un archivo `.env.local` en la raíz del proyecto:
```bash
NEXT_PUBLIC_WEB3FORMS_KEY=tu-access-key-aqui
```

2. En `contact.tsx`, usa:
```typescript
access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "",
```

3. Reinicia el servidor de desarrollo

---

¿Preguntas? Contacta a Web3Forms: https://web3forms.com/support
