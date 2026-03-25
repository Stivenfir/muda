# Setup de entorno de trabajo

## Prerrequisitos
- Node.js 20+
- npm 10+
- Docker y Docker Compose (opcional)
- XAMPP opcional (si ya existe MySQL local)

## Variables de entorno
1. Copiar archivos ejemplo:
   - `cp .env.example .env`
   - `cp frontend/.env.example frontend/.env`
   - `cp backend/.env.example backend/.env`
2. Ajustar credenciales según ambiente.
3. Si usas XAMPP, configura en `backend/.env`:
   - `DB_HOST=127.0.0.1`
   - `DB_PORT=3306`
   - `DB_USERNAME=root`
   - `DB_PASSWORD=` (vacío)
   - `DB_DATABASE=abcmudanzas`

## Opción A - Usar XAMPP MySQL (tu caso actual)
1. Inicia MySQL en XAMPP.
2. Ejecuta en phpMyAdmin -> pestaña **SQL** el contenido de:
   - `docs/sql/mysql-auth-base.sql`
3. Ese script **sí crea la base de datos** (`abcmudanzas`), crea tablas y también deja un usuario inicial `admin` (clave `Admin123*`).
4. Levanta backend y frontend:
   - `npm --prefix backend install && npm --prefix backend run start:dev`
   - `npm --prefix frontend install && npm --prefix frontend run dev`

## Opción B - Usar MySQL en Docker
- Desde raíz:
  - `docker compose --env-file .env up --build -d`
- Si usas XAMPP al mismo tiempo, deja `MYSQL_HOST_PORT=3308`.

## Backups recomendados
- La imagen de MySQL **no es** respaldo de datos.
- Usa export SQL periódico (`mysqldump` o Export de phpMyAdmin).

## Verificaciones mínimas
- API health: `GET /api/health`
- Swagger: `/api/docs`
- Frontend: carga de login/dashboard
