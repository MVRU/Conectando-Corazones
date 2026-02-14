import { prisma } from '$lib/infrastructure/prisma/client';
import type { SolicitudFinalizacionRepository } from '$lib/domain/repositories/SolicitudFinalizacionRepository';
import type { SolicitudFinalizacion } from '$lib/domain/types/SolicitudFinalizacion';

export class PostgresSolicitudFinalizacionRepository implements SolicitudFinalizacionRepository {
    async findByProyectoId(proyectoId: number): Promise<SolicitudFinalizacion | null> {
        const found = await prisma.solicitudFinalizacion.findFirst({
            where: { proyecto_id: proyectoId },
            orderBy: { created_at: 'desc' },
            include: {
                solicitud_evidencias: {
                    include: {
                        evidencia: {
                            include: { archivos: { include: { usuario: true } } }
                        }
                    }
                }
            }
        });

        if (!found) return null;

        const evidencias = found.solicitud_evidencias.map((se) => se.evidencia);

        return {
            id_solicitud: found.id_solicitud,
            estado: found.estado ?? undefined,
            created_at: found.created_at ?? undefined,
            proyecto_id: found.proyecto_id,
            evidencia_ids: evidencias.map((e) => e.id_evidencia),
            evidencias
        } as SolicitudFinalizacion;
    }

    async updateEstado(id: number, estado: string): Promise<SolicitudFinalizacion> {
        const updated = await prisma.solicitudFinalizacion.update({
            where: { id_solicitud: id },
            data: { estado }
        });

        return {
            id_solicitud: updated.id_solicitud,
            estado: updated.estado ?? undefined,
            created_at: updated.created_at ?? undefined,
            proyecto_id: updated.proyecto_id,
            evidencia_ids: []
        } as SolicitudFinalizacion;
    }

    async countRechazadasByProyectoId(proyectoId: number): Promise<number> {
        return await prisma.solicitudFinalizacion.count({
            where: {
                proyecto_id: proyectoId,
                estado: 'rechazada'
            }
        });
    }

    async create(solicitud: SolicitudFinalizacion): Promise<SolicitudFinalizacion> {
        const created = await prisma.solicitudFinalizacion.create({
            data: {
                proyecto_id: solicitud.proyecto_id,
                estado: solicitud.estado ?? 'pendiente'
            }
        });

        // Vincular evidencias a la solicitud
        if (solicitud.evidencia_ids?.length) {
            await prisma.solicitudFinalizacionEvidencia.createMany({
                data: solicitud.evidencia_ids.map((evidencia_id) => ({
                    evidencia_id,
                    solicitud_finalizacion_id: created.id_solicitud
                }))
            });
        }

        return {
            id_solicitud: created.id_solicitud,
            estado: created.estado ?? undefined,
            created_at: created.created_at ?? undefined,
            proyecto_id: created.proyecto_id,
            evidencia_ids: solicitud.evidencia_ids ?? []
        } as SolicitudFinalizacion;
    }
}
