import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import { PostgresColaboracionRepository } from '$lib/infrastructure/supabase/postgres/colaboracion.repo';
import { ObtenerDetalleAportesColaborador } from '$lib/domain/use-cases/colaboraciones/ObtenerDetalleAportesColaborador';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/infrastructure/supabase/admin-client';

export const load: PageServerLoad = async ({ params }) => {
	const projectId = Number(params.id);
	const collaboratorId = Number(params.colaboradorId);

	const proyectoRepo = new PostgresProyectoRepository();
	const usuarioRepo = new PostgresUsuarioRepository();
	const colaboracionRepo = new PostgresColaboracionRepository();

	const obtenerDetalle = new ObtenerDetalleAportesColaborador(
		colaboracionRepo,
		proyectoRepo,
		usuarioRepo
	);

	try {
		const { colaborador, aportes, colaboradores } = await obtenerDetalle.execute(
			projectId,
			collaboratorId
		);

		// Función auxiliar para firmar URLs
		const firmarUrl = async (url: string | undefined) => {
			if (!url || url.startsWith('http') || url.startsWith('data:')) return url;

			const partes = url.split('/');
			if (partes.length < 2) return url;

			const bucket = partes[0];
			const path = partes.slice(1).join('/');

			const { data } = await supabaseAdmin.storage.from(bucket).createSignedUrl(path, 3600);
			return data?.signedUrl || url;
		};

		// Procesar aportes para firmar evidencias
		const aportesProcesados = await Promise.all(
			aportes.map(async (aporte: any) => {
				const evidenciasEntrada = await Promise.all(
					(aporte.evidencias_entrada || []).map(async (archivo: any) => ({
						...archivo,
						url: await firmarUrl(archivo.url)
					}))
				);

				const evidenciasSalida = await Promise.all(
					(aporte.evidencias_salida || []).map(async (archivo: any) => ({
						...archivo,
						url: await firmarUrl(archivo.url)
					}))
				);

				return {
					...aporte,
					evidencias_entrada: evidenciasEntrada,
					evidencias_salida: evidenciasSalida
				};
			})
		);

		// Procesar colaborador para firmar avatar
		const colaboradorProcesado = {
			...colaborador,
			avatar_url: await firmarUrl((colaborador as any).avatar_url)
		};

		let tipoLabel = 'Colaborador';
		if ('tipo_colaborador' in colaborador) {
			const tipo = (colaborador as any).tipo_colaborador;
			if (tipo === 'organizacion') tipoLabel = 'Colaborador - ONG';
			else tipoLabel = 'Colaborador - Voluntario/a';
		}

		return {
			colaborador: JSON.parse(
				JSON.stringify({
					...colaboradorProcesado,
					tipo_etiqueta: tipoLabel
				})
			),
			aportes: JSON.parse(JSON.stringify(aportesProcesados)),
			colaboradores: JSON.parse(JSON.stringify(colaboradores))
		};
	} catch (e) {
		console.error(e);
		throw error(404, 'Error al cargar el detalle del colaborador');
	}
};
