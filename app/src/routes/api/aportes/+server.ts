import { json, error, type RequestEvent } from '@sveltejs/kit';
import { RegistrarAporte } from '$lib/domain/use-cases/colaboracion-tipo-participacion/RegistrarAporte';
import { PostgresColaboracionTipoParticipacionRepository } from '$lib/infrastructure/supabase/postgres/colaboracion-tipo-participacion.repo';
import { PostgresColaboracionRepository } from '$lib/infrastructure/supabase/postgres/colaboracion.repo';
import { PostgresParticipacionPermitidaRepository } from '$lib/infrastructure/supabase/postgres/participacion-permitida.repo';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';

export async function POST({ request, locals }: RequestEvent) {
    const usuario = locals.usuario;
    if (!usuario || !usuario.id_usuario) {
        throw error(401, 'Debes iniciar sesión');
    }

    const body = await request.json();
    const { colaboracion_id, participacion_permitida_id, cantidad } = body;

    if (!colaboracion_id || !participacion_permitida_id || !cantidad) {
        throw error(400, 'Faltan datos requeridos');
    }

    const aporteRepo = new PostgresColaboracionTipoParticipacionRepository();
    const colaboracionRepo = new PostgresColaboracionRepository();
    const participacionRepo = new PostgresParticipacionPermitidaRepository();
    const proyectoRepo = new PostgresProyectoRepository();

    const registrarAporte = new RegistrarAporte(
        aporteRepo,
        colaboracionRepo,
        participacionRepo,
        proyectoRepo
    );

    try {
        const aporte = await registrarAporte.execute(
            {
                colaboracion_id,
                participacion_permitida_id,
                cantidad
            },
            usuario.id_usuario
        );

        return json({ success: true, aporte }, { status: 201 });
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al registrar aporte';
        throw error(400, message);
    }
};
