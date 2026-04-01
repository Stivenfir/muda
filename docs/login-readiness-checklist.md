# Login readiness checklist (MVP)

## Diagnóstico rápido del estado actual

El proyecto ya tiene una **base funcional de autenticación**:

- Backend NestJS con endpoint `POST /auth/login` y `GET /auth/profile`.
- Validación de contraseña con `bcrypt` contra tabla `pr_empleado`.
- Emisión de JWT y protección de rutas con `JwtAuthGuard`.
- Frontend React con pantalla de login, persistencia de token y rutas privadas.
- Script SQL base de identidad (`docs/sql/mysql-auth-base.sql`) con usuario administrador inicial.

En términos de avance, el login está aproximadamente en un **70-80% para MVP técnico**.

## Brechas antes de declararlo “listo para producción corporativa”

### 1) Seguridad
- Mover `JWT_SECRET` a variables de entorno obligatorias (sin fallback inseguro).
- Definir expiración, refresh strategy y política de cierre de sesión.
- Implementar rate limiting / protección ante fuerza bruta.
- Asegurar hashing fuerte y política de contraseñas (rotación, complejidad, bloqueo).

### 2) Gobierno de acceso
- Pasar de rol único en token a esquema multirol/permisos por módulo y acción.
- Incorporar guards de autorización por permiso (no solo autenticación).
- Asegurar desactivación de usuario y revocación de acceso en tiempo real.

### 3) Calidad de API
- Agregar DTOs con validación (`class-validator`) para login.
- Estandarizar errores de autenticación y trazabilidad de intentos.
- Agregar pruebas e2e de auth (login válido/inválido, acceso protegido, token vencido).

### 4) Observabilidad y auditoría
- Registrar eventos de seguridad: login exitoso/fallido, logout, token inválido.
- Correlación por usuario, IP, timestamp y canal.
- Tablero mínimo de actividad de acceso para soporte/seguridad.

### 5) Alineación tecnológica
- Definir decisión formal de motor de base de datos para fase actual (hoy MySQL/XAMPP),
  versus objetivo corporativo futuro (SQL Server), incluyendo plan de migración.

## Recomendación de ejecución (siguiente sprint)

1. **Cerrar auth MVP hardening** (seguridad + validaciones + pruebas).
2. **Implementar RBAC por permisos** para módulos críticos (`Comercial`, `Operación`, `Financiero`).
3. **Habilitar auditoría de acceso** con eventos y consulta básica.
4. **Solo después** iniciar nuevas pantallas funcionales dependientes de permisos.

## Definición de “Listo” para módulo Login

- Login y profile funcionando en ambientes dev/qa.
- JWT sin secretos hardcodeados.
- Rate limit activo en endpoint de login.
- Guards de autenticación y autorización por permisos en al menos 2 módulos.
- Auditoría de eventos de acceso persistida en base de datos.
- Pruebas unitarias + e2e críticas en CI.
