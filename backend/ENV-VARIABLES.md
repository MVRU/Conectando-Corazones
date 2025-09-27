# Variables de Entorno

## Archivo .env

Crear un archivo `.env` en el directorio `backend/` con el siguiente contenido:

```env
# Base de datos - Desarrollo (SQLite)
DATABASE_URL="file:./dev.db"

# Para producción (PostgreSQL), cambiar a:
# DATABASE_URL="postgresql://usuario:password@localhost:5432/conectando_corazones"

# Otras variables de entorno del proyecto
# NODE_ENV=development
# PORT=3000
```

## Configuración por Ambiente

### Desarrollo
- Usa SQLite con archivo local `dev.db`
- No requiere servidor de base de datos
- Ideal para prototipado rápido

### Producción
- Usa PostgreSQL
- Requiere servidor de base de datos
- Mejor rendimiento y escalabilidad

## Migración entre Ambientes

1. Cambiar `DATABASE_URL` en `.env`
2. Cambiar `provider` en `prisma/schema.prisma`
3. Ejecutar `npx prisma migrate deploy`
4. Ejecutar `npx prisma generate`
