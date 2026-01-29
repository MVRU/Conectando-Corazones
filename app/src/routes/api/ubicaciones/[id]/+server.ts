import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { UbicacionRepoPrisma } from '$lib/infrastructure/supabase/postgres/ubicacion.repo';
import { UpdateUbicacion } from '$lib/domain/use-cases/ubicacion/UpdateUbicacion';
import { prisma } from '$lib/infrastructure/prisma/client';

interface PatchBody {
    referencia?: string;
    url_virtual?: string;
}

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
    try {
        if (!locals.usuario) {
            throw error(401, 'No autorizado');
        }

        const ubicacionId = Number(params.id);

        if (isNaN(ubicacionId) || ubicacionId <= 0) {
            throw error(400, 'ID de ubicación inválido');
        }

        const proyectoUbicacion = await prisma.proyectoUbicacion.findFirst({
            where: { ubicacion_id: ubicacionId },
            include: {
                proyecto: {
                    select: { institucion_id: true }
                }
            }
        });

        if (!proyectoUbicacion || !proyectoUbicacion.proyecto) {
            throw error(404, 'Ubicación no encontrada o no asociada a un proyecto');
        }

        const esDueno = proyectoUbicacion.proyecto.institucion_id === locals.usuario.id_usuario;

        if (!esDueno) {
            throw error(403, 'Acceso denegado - Solo el dueño del proyecto puede editar sus ubicaciones');
        }

        let body: PatchBody;
        try {
            body = await request.json();
        } catch {
            throw error(400, 'El cuerpo de la solicitud no es JSON válido');
        }

        const { referencia, url_virtual } = body;

        const repository = new UbicacionRepoPrisma();
        const useCase = new UpdateUbicacion(repository);

        const ubicacionActualizada = await useCase.execute({
            id: ubicacionId,
            referencia,
            url_virtual
        });

        return json({
            success: true,
            data: {
                id_ubicacion: ubicacionActualizada.id_ubicacion,
                tipo_ubicacion: ubicacionActualizada.tipo_ubicacion,
                modalidad: ubicacionActualizada.modalidad,
                referencia: ubicacionActualizada.referencia,
                url_virtual: ubicacionActualizada.url_virtual
            },
            message: 'Ubicación actualizada correctamente'
        });
    } catch (e) {
        console.error('Error actualizando ubicación:', e);

        if (e && typeof e === 'object' && 'status' in e) {
            throw e;
        }

        if (e instanceof Error) {
            throw error(400, e.message);
        }

        throw error(500, 'Error al actualizar la ubicación');
    }
};

