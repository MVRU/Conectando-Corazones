// Configuración de la base de datos con Prisma
// Soporta SQLite en desarrollo y PostgreSQL en producción

import { PrismaClient } from '@prisma/client';

// Configuración del cliente Prisma
const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Función para conectar a la base de datos
export const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log('✅ Conexión exitosa a la base de datos');
    } catch (error) {
        console.error('❌ Error al conectar a la base de datos:', error);
        process.exit(1);
    }
};

// Función para desconectar de la base de datos
export const disconnectDB = async () => {
    try {
        await prisma.$disconnect();
        console.log('✅ Desconexión exitosa de la base de datos');
    } catch (error) {
        console.error('❌ Error al desconectar de la base de datos:', error);
    }
};

export default prisma;