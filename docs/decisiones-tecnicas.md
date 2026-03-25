# Decisiones técnicas iniciales

## Estado actual del repositorio
- Frontend: base funcional con React + rutas básicas.
- Backend: base NestJS con auth, usuarios, health y app-info.
- Infra: docker-compose y Dockerfiles disponibles.

## Decisiones recomendadas para alineación objetivo
1. **DB corporativa**: migrar configuración de `mysql` a `mssql` (SQL Server) para cumplir estándar objetivo.
2. **Persistencia**: habilitar migraciones y deshabilitar cualquier sincronización automática en productivo.
3. **Arquitectura backend**: separar módulos por dominio (operaciones, documentos, alertas, incidencias, integraciones).
4. **Integraciones**: patrón Adapter + Outbox para resiliencia y trazabilidad de eventos.
5. **Seguridad**: RBAC granular por módulo y acción (crear, editar, ver, aprobar, validar, ejecutar).
6. **Observabilidad**: logging estructurado + correlación por `operationId` + auditoría de cambios.
7. **Frontend**: diseño por feature modules con layout corporativo y vista 360 como pantalla principal.
8. **DevOps**: CI/CD con pipelines para lint, test, build, seguridad y despliegue por ambientes.

## Riesgos técnicos tempranos
- Divergencia entre stack objetivo y configuración actual de base de datos.
- Acoplamiento con sistemas externos sin contrato de integración formal.
- Falta de catálogo de estados y reglas de transición del proceso.

## Recomendación práctica para el momento actual
- Si ya iniciaron con MySQL, mantener MySQL en MVP para no frenar login y operación inicial.
- Diseñar el modelo con naming y tipos portables para facilitar futura migración a SQL Server.
- Planificar migración a SQL Server como hito de fase controlada, no como bloqueo inmediato.

## Nomenclatura de base de datos en español
- Se adopta nomenclatura de tablas y columnas en español para el dominio corporativo (`pr_persona`, `correo_electronico`, `contrasena_hash`, etc.).
- Mantener consistencia con prefijo `pr_` y nombres legibles por negocio.

## Convivencia con XAMPP
- Se separa el puerto de MySQL en Docker (`MYSQL_HOST_PORT`, por defecto `3308`) para no ocupar el `3306` de XAMPP.
- El backend dentro de Docker sigue conectando al servicio `mysql:3306` en red interna.

## Modelo de autenticación vigente
- Se simplifica el login usando `pr_empleado.nombre_usuario` + `pr_empleado.contrasena_hash`.
- Los roles se resuelven con `pr_empleado_rol` + `pr_rol`.
- Se descarta `pr_usuario_login` para evitar duplicidad de datos.
