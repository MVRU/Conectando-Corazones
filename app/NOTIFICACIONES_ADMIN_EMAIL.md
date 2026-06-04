# Notificaciones Email Admin

Este documento define los mensajes de email para eventos que requieren atención del equipo administrador.

## Configuración

- `RESEND_API_KEY`: API key para envío (obligatoria).
- `ADMIN_ALERTS_EMAIL_FROM`: remitente visible (opcional).
- `ADMIN_ALERTS_EMAILS`: lista de correos destino separada por comas (opcional).
- `APP_BASE_URL`: base URL para construir links al panel admin (opcional).

Si `ADMIN_ALERTS_EMAILS` no está definida, el sistema busca emails de usuarios activos con rol `administrador`.

## Mensajes Activos

### 1) Nueva solicitud de verificación pendiente

- **Trigger:** carga de documentación de verificación o creación de solicitud de verificación.
- **Asunto:** `Nueva solicitud de verificación pendiente`
- **Resumen:** `Una institución cargó documentación y requiere revisión administrativa.`
- **Detalle:**
  - Usuario ID
  - Username
  - Tipo
  - Archivos adjuntos
  - Panel de revisión

### 2) Nueva cuenta institucional registrada

- **Trigger:** registro exitoso de una institución.
- **Asunto:** `Nueva cuenta institucional registrada`
- **Resumen:** `Se creó una nueva cuenta de institución y puede requerir gestión administrativa.`
- **Detalle:**
  - Usuario ID
  - Username
  - Email
  - Panel de gestión

### 3) Nuevo reporte recibido

- **Trigger:** creación de reporte sobre `Usuario` o `Proyecto`.
- **Asunto:** `Nuevo reporte sobre usuario` / `Nuevo reporte sobre proyecto`
- **Resumen:** `Se recibió un nuevo reporte que requiere revisión administrativa.`
- **Detalle:**
  - Tipo de objeto
  - ID objeto reportado
  - Motivo
  - Reportante ID
  - Reportante
  - Panel de reportes

### 4) Proyecto escalado a auditoría

- **Trigger:** rechazo de solicitud de cierre que lleva el proyecto a estado `en_auditoria`.
- **Asunto:** `Proyecto escalado a auditoría`
- **Resumen:** `Un proyecto pasó automáticamente a estado de auditoría tras rechazos en la solicitud de cierre.`
- **Detalle:**
  - Proyecto ID
  - Proyecto
  - Solicitud de cierre ID
  - Colaborador que rechazó
  - Username colaborador
  - Panel de administración

## Criterios de tono

- Mensaje corto y accionable.
- Incluir IDs para trazabilidad.
- Incluir link al panel para resolución rápida.
- No exponer datos sensibles innecesarios.
