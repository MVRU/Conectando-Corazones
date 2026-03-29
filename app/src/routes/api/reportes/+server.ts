import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/infrastructure/prisma/client';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.usuario?.id_usuario) {
		return json({ error: 'No autorizado' }, { status: 401 });
	}

	const usuario = locals.usuario;
	const reportes = await prisma.reporte.findMany({
		where:
			usuario.rol === 'administrador'
				? {}
				: {
						reportante_id: usuario.id_usuario
					},
		orderBy: {
			created_at: 'desc'
		}
	});

	return json(reportes);
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.usuario?.id_usuario) {
		return json({ error: 'No autorizado' }, { status: 401 });
	}

	try {
		const body = await request.json();
		const tipoObjeto = String(body.tipo_objeto ?? '').trim();
		const idObjeto = Number(body.id_objeto);
		const motivo = String(body.motivo ?? '').trim();
		const descripcion = String(body.descripcion ?? '').trim();

		if (!tipoObjeto || !idObjeto || Number.isNaN(idObjeto) || !motivo || !descripcion) {
			return json({ error: 'Datos incompletos para crear el reporte.' }, { status: 400 });
		}

		const reporte = await prisma.reporte.create({
			data: {
				tipo_objeto: tipoObjeto,
				id_objeto: idObjeto,
				motivo,
				descripcion,
				estado: 'pendiente',
				reportante_id: locals.usuario.id_usuario
			}
		});

		await prisma.historialDeCambios.create({
			data: {
				tipo_objeto: 'Reporte',
				id_objeto: reporte.id_reporte,
				accion: 'Crear',
				atributo_afectado: 'id_reporte',
				valor_anterior: 'null',
				valor_nuevo: String(reporte.id_reporte),
				justificacion: `Reporte creado por usuario sobre ${tipoObjeto}#${idObjeto}.`,
				usuario_id: locals.usuario.id_usuario
			}
		});

		return json(reporte, { status: 201 });
	} catch (error) {
		const code = error instanceof Error && error.message.includes('Unique constraint') ? 409 : 400;
		return json(
			{
				error:
					code === 409
						? 'Ya existe un reporte previo para este objetivo.'
						: error instanceof Error
							? error.message
							: 'No se pudo crear el reporte.'
			},
			{ status: code }
		);
	}
};
