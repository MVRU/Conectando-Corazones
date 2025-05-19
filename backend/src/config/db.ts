// Acá se configura la conexión a la base de datos utilizando Prisma

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log('✅ Conexión exitosa a la base de datos');
    } catch (error) {
        console.error('❌ Error al conectar a la base de datos:', error);
        process.exit(1);
    }
};

export default prisma;