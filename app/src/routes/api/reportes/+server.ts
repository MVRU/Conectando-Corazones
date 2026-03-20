import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PostgresReporteRepository } from '$lib/infrastructure/supabase/postgres/reporte.repo';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { CrearReporte } from '$lib/domain/use-cases/reportes/CrearReporte';
import { ListarReportes } from '$lib/domain/use-cases/reportes/ListarReportes';
import { MotivoReporte } from '$lib/domain/types/Reporte';

// POST /api/reportes — Crear un reporte (cualquier usuario autenticado)
export const POST: RequestHandler = async ({ request, locals }) => {
	const usuario = locals.usuario;
	if (!usuario) {
		return json({ error: 'No autenticado.' }, { status: 401 });
	}

	try {
		const data = await request.json();

		// 1. Validaciones estrictas de entrada (Runtime check)
		if (!['Usuario', 'Proyecto'].includes(data.tipo_objeto)) {
			return json({ error: 'tipo_objeto inválido. Debe ser "Usuario" o "Proyecto".' }, { status: 400 });
		}

		const id_objeto = Number(data.id_objeto);
		if (isNaN(id_objeto) || id_objeto <= 0) {
			return json({ error: 'id_objeto inválido.' }, { status: 400 });
		}

		const motivos = Object.values(MotivoReporte);
		if (!motivos.includes(data.motivo as MotivoReporte)) {
			return json({ error: 'motivo inválido.' }, { status: 400 });
		}

		const descripcion = data.descripcion?.trim();
		if (!descripcion || descripcion.length < 20) {
			return json({ error: 'La descripción del reporte debe tener al menos 20 caracteres.' }, { status: 400 });
		}
		if (descripcion.length > 800) {
			return json({ error: 'La descripción no puede superar los 800 caracteres.' }, { status: 400 });
		}

		const repo = new PostgresReporteRepository();
		const proyRepo = new PostgresProyectoRepository();
		const crearReporte = new CrearReporte(repo, proyRepo);

		const reporte = await crearReporte.execute({
			tipo_objeto: data.tipo_objeto as 'Usuario' | 'Proyecto',
			id_objeto: id_objeto,
			motivo: data.motivo as MotivoReporte,
			descripcion: data.descripcion,
			reportante_id: usuario.id_usuario!
		});

		return json({ success: true, reporte }, { status: 201 });
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Error interno.';
		console.error('[POST /api/reportes] Error:', error);
		return json({ success: false, error: message }, { status: 400 });
	}
};

// GET /api/reportes — Listar reportes (Admin ve todo, Usuario ve solo los suyos)
export const GET: RequestHandler = async ({ url, locals }) => {
	const usuario = locals.usuario;
	if (!usuario) {
		return json({ error: 'No autenticado.' }, { status: 401 });
	}

	const esAdmin = usuario.rol === 'administrador';

	try {
		const estado = url.searchParams.get('estado') as 'pendiente' | 'verificado' | 'desestimado' | null;
		
		const estadosValidos = ['pendiente', 'verificado', 'desestimado'];
		if (estado && !estadosValidos.includes(estado)) {
			return json({ error: 'estado de filtro inválido.' }, { status: 400 });
		}

		const tipo_objeto = url.searchParams.get('tipo_objeto') as 'Usuario' | 'Proyecto' | null;
		if (tipo_objeto && !['Usuario', 'Proyecto'].includes(tipo_objeto)) {
			return json({ error: 'tipo_objeto de filtro inválido.' }, { status: 400 });
		}

		const limitStr = url.searchParams.get('limit') ?? '20';
		const offsetStr = url.searchParams.get('offset') ?? '0';
		
		const limit = parseInt(limitStr);
		const offset = parseInt(offsetStr);

		if (isNaN(limit) || isNaN(offset)) {
			return json({ error: 'limit y offset deben ser números.' }, { status: 400 });
		}
		
		const desdeStr = url.searchParams.get('desde');
		const hastaStr = url.searchParams.get('hasta');

		const desde = desdeStr ? new Date(desdeStr) : undefined;
		if (desde && isNaN(desde.getTime())) {
			return json({ error: 'Fecha "desde" inválida.' }, { status: 400 });
		}

		const hasta = hastaStr ? new Date(hastaStr) : undefined;
		if (hasta && isNaN(hasta.getTime())) {
			return json({ error: 'Fecha "hasta" inválida.' }, { status: 400 });
		}

		const repo = new PostgresReporteRepository();
		const listarReportes = new ListarReportes(repo);

		const result = await listarReportes.execute({
			estado: estado ?? undefined,
			tipo_objeto: tipo_objeto ?? undefined,
			// Si no es admin, forzar el filtro al ID del usuario autenticado
			reportante_id: esAdmin ? undefined : usuario.id_usuario!,
			limit,
			offset,
			desde,
			hasta
		});

		return json(result);
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Error interno.';
		console.error('[GET /api/reportes] Error:', error);
		return json({ error: message }, { status: 400 });
	}
};
