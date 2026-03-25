# Docker - MySQL con XAMPP coexistiendo

Si en tu equipo ya está XAMPP usando MySQL en el puerto `3306`, este proyecto publica MySQL Docker en otro puerto (`3308` por defecto).

## Configuración
En `.env` (raíz del proyecto):

```env
MYSQL_HOST_PORT=3308
```

## Levantar servicios
```bash
docker compose --env-file .env up --build -d
```

## Conexión desde herramientas externas (Workbench, DBeaver, etc.)
- Host: `127.0.0.1`
- Puerto: `3308` (o el que definas en `MYSQL_HOST_PORT`)
- Usuario: según `.env` (`MYSQL_USER` o `root`)

## Nota clave de respaldo
- La imagen Docker no reemplaza una política de backup.
- Usa `mysqldump` para respaldo periódico y conserva los archivos `.sql` fuera del contenedor.
