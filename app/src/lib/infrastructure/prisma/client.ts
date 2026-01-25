import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '$env/dynamic/private';

const connectionString = process.env.DB_POOLER_URL || process.env.DATABASE_URL || env.DATABASE_URL;

const pool = new Pool({
	connectionString,
	ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);

// Previene múltiples instancias de Prisma Client en desarrollo
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
