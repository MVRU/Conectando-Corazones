import type { ProyectoUbicacionRepository } from '$lib/domain/repositories/ProyectoUbicacionRepository';
import type { ProyectoUbicacion } from '$lib/domain/entities/ProyectoUbicacion';
import type { UbicacionCreate } from '$lib/domain/types/dto/UbicacionCreate';
import { prisma } from '$lib/infrastructure/prisma/client';
import {
    mapProyectoUbicacionToDomain,
    mapProyectoUbicacionesToDomain
} from './mappers/proyecto-ubicacion.mapper';

export class ProyectoUbicacionRepoPrisma implements ProyectoUbicacionRepository {
    private readonly ubicacionInclude = {
        ubicacion: {
            include: {
                localidad: {
                    include: { provincia: true }
                }
            }
        }
    };

    async findByProyectoId(proyectoId: number): Promise<ProyectoUbicacion[]> {
        const data = await prisma.proyectoUbicacion.findMany({
            where: { proyecto_id: proyectoId },
            include: this.ubicacionInclude
        });

        return mapProyectoUbicacionesToDomain(data);
    }

    //Crea la ubicación Y la relación en una transacción 
    async createWithUbicacion(
        proyectoId: number,
        ubicacionData: UbicacionCreate
    ): Promise<ProyectoUbicacion> {
        const ubicacionPrismaData = this.buildUbicacionData(ubicacionData);

        const result = await prisma.$transaction(async (tx) => {
            // 1. Crear la ubicación
            const nuevaUbicacion = await tx.ubicacion.create({
                data: ubicacionPrismaData
            });

            // 2. Crear la relación proyecto-ubicación
            const proyectoUbicacion = await tx.proyectoUbicacion.create({
                data: {
                    proyecto_id: proyectoId,
                    ubicacion_id: nuevaUbicacion.id_ubicacion
                },
                include: this.ubicacionInclude
            });

            return proyectoUbicacion;
        });

        return mapProyectoUbicacionToDomain(result);
    }

    async countByProyectoId(proyectoId: number): Promise<number> {
        return prisma.proyectoUbicacion.count({
            where: { proyecto_id: proyectoId }
        });
    }

    async getEstadoProyecto(proyectoId: number): Promise<string | null> {
        const proyecto = await prisma.proyecto.findUnique({
            where: { id_proyecto: proyectoId },
            select: { estado: true }
        });

        return proyecto?.estado ?? null;
    }

    //Construye el objeto de datos para crear la ubicación en Prisma
    private buildUbicacionData(data: UbicacionCreate) {
        const baseData = {
            tipo_ubicacion: data.tipo_ubicacion,
            modalidad: data.modalidad
        };

        if (data.modalidad === 'presencial' && data.direccion_presencial) {
            return {
                ...baseData,
                calle: data.direccion_presencial.calle,
                numero: data.direccion_presencial.numero,
                piso: data.direccion_presencial.piso,
                departamento: data.direccion_presencial.departamento,
                referencia: data.direccion_presencial.referencia,
                url_google_maps: data.direccion_presencial.url_google_maps,
                localidad_id: data.direccion_presencial.localidad_id
            };
        }

        if (data.modalidad === 'virtual') {
            return {
                ...baseData,
                url_virtual: data.url_virtual
            };
        }

        return baseData;
    }

    async existsUbicacionEquivalente(
        proyectoId: number,
        ubicacion: UbicacionCreate
    ): Promise<boolean> {
        if (ubicacion.modalidad === 'presencial' && ubicacion.direccion_presencial) {
            const dir = ubicacion.direccion_presencial;

            const count = await prisma.proyectoUbicacion.count({
                where: {
                    proyecto_id: proyectoId,
                    ubicacion: {
                        modalidad: 'presencial',
                        calle: dir.calle,
                        numero: dir.numero,
                        localidad_id: dir.localidad_id
                    }
                }
            });

            return count > 0;
        }

        if (ubicacion.modalidad === 'virtual') {
            const count = await prisma.proyectoUbicacion.count({
                where: {
                    proyecto_id: proyectoId,
                    ubicacion: {
                        modalidad: 'virtual',
                        url_virtual: ubicacion.url_virtual
                    }
                }
            });

            return count > 0;
        }

        return false;
    }
}
