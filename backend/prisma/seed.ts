// Script de seed para poblar datos básicos en la base de datos
import { PrismaClient } from '@prisma/client';
import * as process from 'process';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed de la base de datos...');

    // Crear estados básicos
    const estados = [
        { descripcion: 'en_curso' },
        { descripcion: 'pendiente_solicitud_cierre' },
        { descripcion: 'en_revision' },
        { descripcion: 'en_auditoria' },
        { descripcion: 'completado' },
        { descripcion: 'cancelado' }
    ];

    await prisma.estado.createMany({
        data: estados
    });
    console.log('✅ Estados creados');

    // Crear categorías básicas
    const categorias = [
        { descripcion: 'Educación' },
        { descripcion: 'Salud' },
        { descripcion: 'Medio Ambiente' },
        { descripcion: 'Desarrollo Social' },
        { descripcion: 'Cultura' },
        { descripcion: 'Deportes' },
        { descripcion: 'Tecnología' },
        { descripcion: 'Emergencias' }
    ];

    await prisma.categoria.createMany({
        data: categorias
    });
    console.log('✅ Categorías creadas');

    // Crear tipos de participación
    const tiposParticipacion = [
        { descripcion: 'Voluntariado' },
        { descripcion: 'Especie' },
        { descripcion: 'Monetaria' }
    ];

    await prisma.tipoParticipacion.createMany({
        data: tiposParticipacion
    });
    console.log('✅ Tipos de participación creados');

    // Crear provincias básicas de Argentina
    const provincias = [
        { nombre: 'Buenos Aires', nombre_corto: 'BA', codigo_iso: 'AR-B' },
        { nombre: 'CABA', nombre_corto: 'CABA', codigo_iso: 'AR-C' },
        { nombre: 'Córdoba', nombre_corto: 'CBA', codigo_iso: 'AR-X' },
        { nombre: 'Santa Fe', nombre_corto: 'SF', codigo_iso: 'AR-S' },
        { nombre: 'Mendoza', nombre_corto: 'MZA', codigo_iso: 'AR-M' },
        { nombre: 'Tucumán', nombre_corto: 'TUC', codigo_iso: 'AR-T' }
    ];

    await prisma.provincia.createMany({
        data: provincias
    });
    console.log('✅ Provincias creadas');

    console.log('🎉 Seed completado exitosamente!');
}

main()
    .catch((e) => {
        console.error('❌ Error durante el seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
