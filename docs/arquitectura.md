# Arquitectura objetivo - Sistema ABC Mudanzas

## Principios
- Plataforma integradora (no reemplazo total inmediato).
- Núcleo maestro del estado operativo de la mudanza.
- Trazabilidad end-to-end con evidencia auditable.
- Diseño modular, escalable y orientado a integración.

## Capas funcionales
1. **Canales**: React SPA para usuarios internos/externos.
2. **Orquestación**: API NestJS (reglas de negocio, workflow, alertas).
3. **Datos**: SQL Server como repositorio operacional.
4. **Integración**: conectores API/webhooks/jobs para sistemas legados.
5. **Observabilidad**: logs, auditoría, trazas y tableros de KPIs.

## Dominios principales
- Comercial y prefactibilidad
- Vinculación y apertura (DO)
- Coordinación operativa
- Ejecución logística y cumplimiento
- Entrega, cierre y facturación
- Incidencias y mejora continua
- Control transversal (alertas, trazabilidad, integraciones)

## Vista técnica de referencia
- Frontend: React + TypeScript + React Router + gestión de estado por dominio.
- Backend: NestJS modular (auth, operaciones, documentos, incidencias, integraciones).
- Persistencia: SQL Server con estrategia de migraciones versionadas.
- Seguridad: JWT, RBAC por módulo/acción, bitácora de cambios.
- Integraciones: adaptadores desacoplados por proveedor (Outlook, SharePoint, Clientify, etc.).
