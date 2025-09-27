# Configuración de Prisma con SQLite y PostgreSQL

## Resumen

Este proyecto está configurado para usar **SQLite en desarrollo** y **PostgreSQL en producción**

## Estructura de Archivos

```
backend/
├── prisma/
│   ├── schema.prisma          # Esquema de base de datos
│   ├── seed.ts               # Script para poblar datos básicos
│   └── migrations/           # Migraciones de base de datos
├── src/
│   └── config/
│       └── db.ts            # Configuración de Prisma
└── .env                     # Variables de entorno
```

## Configuración Actual

### Desarrollo (SQLite)
- **Base de datos**: `dev.db` (archivo local)
- **Provider**: `sqlite`
- **URL**: `file:./dev.db`

### Producción (PostgreSQL)
- **Provider**: `postgresql`
- **URL**: `postgresql://usuario:password@localhost:5432/conectando_corazones`

## Comandos Principales

### Inicialización
```bash
# Instalar dependencias
npm install

# Generar cliente de Prisma
npm run db:generate

# Crear migración inicial
npx prisma migrate dev --name init

# Poblar datos básicos
npm run db:seed
```

### Desarrollo
```bash
# Crear nueva migración
npm run db:migrate

# Ver base de datos en navegador
npm run db:studio

# Resetear base de datos y ejecutar seed
npm run db:reset
```

### Producción
```bash
# Aplicar migraciones
npx prisma migrate deploy

# Generar cliente
npx prisma generate
```

## Migración a PostgreSQL

### Paso 1: Cambiar Provider
En `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // Cambiar de "sqlite" a "postgresql"
  url      = env("DATABASE_URL")
}
```

### Paso 2: Actualizar Variable de Entorno
En `.env`:
```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/conectando_corazones"
```

### Paso 3: Aplicar Migraciones
```bash
npx prisma migrate deploy
npx prisma generate
```

## Endpoints API Disponibles

**Base URL**: `http://localhost:3000/api`

### Proyectos
- `GET /api/proyectos` - Listar todos los proyectos
- `POST /api/proyectos` - Crear nuevo proyecto
- `GET /api/proyectos/:id` - Obtener proyecto específico
- `PUT /api/proyectos/:id` - Actualizar proyecto
- `DELETE /api/proyectos/:id` - Eliminar proyecto

### Categorías
- `GET /api/categorias` - Listar categorías
- `POST /api/categorias` - Crear categoría

### Tipos de Participación
- `GET /api/tipos-participacion` - Listar tipos
- `POST /api/tipos-participacion` - Crear tipo

## Arquitectura Correcta

- **Backend**: Express.js con Prisma ORM
- **Frontend**: SvelteKit (solo UI, sin lógica de negocio)
- **Separación clara**: API en backend, presentación en frontend
- **Seguridad**: Base de datos solo accesible desde backend

## Modelos de Datos

El esquema incluye todos los modelos basados en los tipos TypeScript existentes:

- **Usuario** (con herencia: Institucion, Colaborador, Administrador)
- **Proyecto** (con relaciones completas)
- **Colaboracion**
- **Evidencia**
- **Ubicacion** y **Direccion**
- **Categoria** y **TipoParticipacion**
- **Estado** y **Provincia**

## Archivos que NO subir a Git

Los siguientes archivos están en `.gitignore`:
- `dev.db` - Base de datos SQLite
- `dev.db-journal` - Archivo de journal de SQLite
- `.env` - Variables de entorno (usar `.env.example`)

## Ventajas de esta Configuración

1. **Desarrollo rápido**: SQLite no requiere servidor
2. **Migración simple**: Un solo cambio de provider
3. **Consistencia**: Mismo esquema en dev y prod
4. **Type safety**: Cliente generado automáticamente
5. **Relaciones completas**: Todas las FK y relaciones configuradas

## Troubleshooting

### Error de migración
```bash
# Resetear base de datos
npm run db:reset
```

### Error de conexión
```bash
# Verificar variables de entorno
cat .env

# Regenerar cliente
npm run db:generate
```

### Error de tipos
```bash
# Regenerar cliente después de cambios en schema
npx prisma generate
```
