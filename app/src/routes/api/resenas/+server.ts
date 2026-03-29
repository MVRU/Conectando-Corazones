import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { PostgresResenaRepository } from '$lib/infrastructure/supabase/postgres/resena.repo';
import { PostgresColaboracionRepository } from '$lib/infrastructure/supabase/postgres/colaboracion.repo';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { PostgresHistorialDeCambiosRepository } from '$lib/infrastructure/supabase/postgres/historial-cambios.repo';

import { CrearResena } from '$lib/domain/use-cases/resenas/CrearResena';
import { EliminarResena } from '$lib/domain/use-cases/resenas/EliminarResena';
import { ObtenerResenasPorObjeto } from '$lib/domain/use-cases/resenas/ObtenerResenasPorObjeto';
import { ObtenerResenasEscritas } from '$lib/domain/use-cases/resenas/ObtenerResenasEscritas';
import type { TipoObjetoResena } from '$lib/domain/types/Resena';

// Inyección de dependencias para el módulo
const resenaRepo = new PostgresResenaRepository();
const colaboracionRepo = new PostgresColaboracionRepository();
const proyectoRepo = new PostgresProyectoRepository();

const historialRepo = new PostgresHistorialDeCambiosRepository();

const crearResenaUC = new CrearResena(resenaRepo, colaboracionRepo, proyectoRepo, historialRepo);
const eliminarResenaUC = new EliminarResena(resenaRepo, historialRepo);
const obtenerResenasPorObjetoUC = new ObtenerResenasPorObjeto(resenaRepo);
const obtenerResenasEscritasUC = new ObtenerResenasEscritas(resenaRepo);

export const GET: RequestHandler = async ({ url }) => {
	const tipo_objeto = url.searchParams.get('tipo_objeto') as TipoObjetoResena | null;
	const id_objeto = url.searchParams.get('id_objeto');
	const autor_id = url.searchParams.get('autor_id');

	try {
		if (tipo_objeto && id_objeto) {
			const resenas = await obtenerResenasPorObjetoUC.execute(tipo_objeto, Number(id_objeto));
			return json(resenas);
		} else if (autor_id) {
			const resenas = await obtenerResenasEscritasUC.execute(Number(autor_id));
			return json(resenas);
		} else {
			return json({ error: 'Faltan parámetros de búsqueda válidos.' }, { status: 400 });
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Error desconocido';
		return json({ error: message }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.usuario || !locals.usuario.id_usuario) {
		return json({ error: 'Debes iniciar sesión para dejar una reseña.' }, { status: 401 });
	}

	try {
		const body = await request.json();
		const { tipo_objeto, id_objeto, contenido, puntaje } = body;

		if (!tipo_objeto || !id_objeto || !contenido || !puntaje) {
			return json(
				{ error: 'Faltan campos requeridos: tipo_objeto, id_objeto, contenido, puntaje.' },
				{ status: 400 }
			);
		}

		const nuevaResena = await crearResenaUC.execute({
			tipo_objeto,
			id_objeto: Number(id_objeto),
			contenido,
			puntaje: Number(puntaje),
			autor_id: locals.usuario.id_usuario,
			username: locals.usuario.username || 'usuario_desconocido',
			rol: locals.usuario.rol
		});

		return json(nuevaResena, { status: 201 });
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Error al procesar la reseña';
		return json({ error: message }, { status: 400 });
	}
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
	if (!locals.usuario || !locals.usuario.id_usuario) {
		return json({ error: 'Debes iniciar sesión para eliminar una reseña.' }, { status: 401 });
	}

	try {
		const body = await request.json();
		const id_resena = Number(body.id_resena);

		if (!id_resena) {
			return json({ error: 'El ID de la reseña es requerido.' }, { status: 400 });
		}

		const isAdmin = locals.usuario.rol === 'administrador';

		await eliminarResenaUC.execute(id_resena, locals.usuario.id_usuario, isAdmin);

		return json({ success: true, message: 'Reseña eliminada correctamente.' });
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Error al eliminar la reseña';
		const esErrorDePermiso = message.startsWith('No tenés permiso');
		return json({ error: message }, { status: esErrorDePermiso ? 403 : 400 });
	}
};
