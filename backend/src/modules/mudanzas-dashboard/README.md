# Módulo Mudanzas Dashboard (Comercial)

## Endpoint principal
- `GET /api/mudanzas/dashboard/comercial`
  - Devuelve payload agregado para el escritorio comercial.
  - Usa caché en memoria con TTL configurable (`ttlSeconds`, default `120`).

## Endpoint de refresco
- `POST /api/mudanzas/dashboard/refresh`
  - Fuerza recálculo y actualización de caché.

## Query/body soportado
- `pipeline` (default: `mudanzas`)
- `stage` (default: `en costeo`)
- `pageSize` (default: `100`)
- `ttlSeconds` (default: `120`)

## Fuentes
Este módulo **no reemplaza** Clientify. Reutiliza la integración existente consultando:
- `/api/clientify/deals`
- `/api/clientify/clients/open-opportunities`

Si necesitas apuntar a otro host interno, define:
- `CLIENTIFY_INTERNAL_BASE_URL=http://host-interno:puerto`
- `CLIENTIFY_INTERNAL_API_KEY=abc_clientify_2026`

Defaults actuales:
- Base URL fallback: `http://127.0.0.1:3001`
- API Key fallback: `abc_clientify_2026`

## Estructura de respuesta
```json
{
  "summary": {
    "leadsNuevos": 0,
    "cotizacionesEnviadas": 0,
    "operacionesGanadas": 0,
    "valorPipeline": 0
  },
  "quotationPending": [],
  "pendingTasks": [],
  "operations": [],
  "meta": {
    "generatedAt": "ISO_DATE",
    "source": "clientify+mudanzas-dashboard",
    "cached": true,
    "ttlSeconds": 120
  }
}
```

## Extensión futura
- Reemplazar caché en memoria por Redis implementando la misma interfaz de `MudanzasDashboardCacheService`.
- Reemplazar placeholders de `pendingTasks` y `operations` cuando exista fuente real definitiva.
