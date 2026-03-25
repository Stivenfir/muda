# Información requerida del cliente (siguiente paso)

Para avanzar sin bloquear el desarrollo, necesitamos confirmar estos datos:

## 1) Infraestructura y despliegue
- Ambiente inicial: ¿local, servidor interno o nube?
- ¿Se usará XAMPP en producción o solo en desarrollo?
- Puerto definitivo para MySQL Docker (`MYSQL_HOST_PORT`): ej. `3308`.
- Política de backups: frecuencia (diaria/semanal) y ruta de almacenamiento.

## 2) Base de datos y acceso
- Credenciales definitivas de MySQL por ambiente (dev/qa/prod).
- Nombre final de base de datos.
- IPs o equipos autorizados a conectarse.

## 3) Login y seguridad
- ¿Login solo para empleados internos o también clientes externos desde el inicio?
- Regla de contraseñas (longitud mínima, expiración, bloqueo por intentos).
- ¿Requieren doble factor (2FA) en esta fase?

## 4) Roles iniciales
- Confirmación de roles de arranque (Cliente, Comercial, Pricing, Ejecutivo, etc.).
- Permisos mínimos por rol (ver/crear/editar/aprobar/validar/ejecutar).

## 5) Datos maestros mínimos
- Campos obligatorios de `pr_persona` y `pr_empleado`.
- Catálogos iniciales: áreas, cargos, estados de empleado.

## 6) Integraciones fase 1
- Confirmar qué se integra primero: Outlook, SharePoint o Clientify.
- Responsable funcional y técnico por cada sistema externo.

## 7) Operación y gobierno
- Dueño del producto (aprobación funcional final).
- SLA esperado para incidencias críticas.
- Ritmo de seguimiento (comité semanal / quincenal).
