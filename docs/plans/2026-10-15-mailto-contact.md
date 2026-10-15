# Contacto mediante mailto

Petición: sustituir el proveedor de formularios por correo y publicar todos los cambios pendientes en GitHub.

- Mensaje y licencia preparan un borrador `mailto:alexviclop@gmail.com` con asunto y cuerpo localizados. Se mantienen validación, borradores y referencia de la fotografía.
- El visitante revisa y envía desde su cliente de correo. No hay fetch, POST, clave de acceso, persistencia ni confirmación de envío desde la web.
- El estado ofrece volver a abrir el borrador. Los caracteres reservados se codifican para que no creen parámetros adicionales.
- Retirados la configuración pública del proveedor, su entrada de CI y sus orígenes CSP. Privacidad, instrucciones y documentación vigente actualizadas. Las auditorías anteriores conservan el registro histórico; esta migración sustituye sus pendientes de configuración de formularios.
- `pnpm check`: PASS, typecheck, 154 tests y export estático. `pnpm e2e`: PASS, 38/38 contra Wrangler, incluidos borradores ES/EN sin POST. `git diff --check`: PASS.

Límite: la apertura depende de que el dispositivo tenga un cliente de correo asociado. La web no puede comprobar que se envió el mensaje. No se enviaron correos reales ni se ejecutó un despliegue manual.
