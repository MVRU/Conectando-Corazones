import type { PageServerLoad, Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import { PostgresColaboracionRepository } from '$lib/infrastructure/supabase/postgres/colaboracion.repo';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { PostgresArchivoRepository } from '$lib/infrastructure/supabase/postgres/archivo.repo';
import { PostgresHistorialDeCambiosRepository } from '$lib/infrastructure/supabase/postgres/historial-de-cambios.repo';
import { ObtenerMisAportes } from '$lib/domain/use-cases/colaboraciones/ObtenerMisAportes';
import { ActualizarArchivo } from '$lib/domain/use-cases/ActualizarArchivo';
import { EliminarArchivo } from '$lib/domain/use-cases/EliminarArchivo';
import { supabaseAdmin } from '$lib/infrastructure/supabase/admin-client';

export const load: PageServerLoad = async ({ params, locals }) => {
	const usuario = locals.usuario;

	if (!usuario || usuario.rol !== 'colaborador' || !usuario.id_usuario) {
		throw error(401, 'Debes iniciar sesión como colaborador para ver tus aportes');
	}

	const userId = usuario.id_usuario;
	const projectId = Number(params.id);

	const colaboracionRepo = new PostgresColaboracionRepository();
	const proyectoRepo = new PostgresProyectoRepository();
	const obtenerMisAportes = new ObtenerMisAportes(colaboracionRepo, proyectoRepo);

	try {
		const { colaboracion, aportes, proyecto } = await obtenerMisAportes.execute(userId, projectId);

		if (!colaboracion) {
			throw error(404, 'Colaboración no encontrada');
		}

		// Función auxiliar para firmar URLs
		const firmarUrl = async (url: string | undefined) => {
			if (!url || url.startsWith('http') || url.startsWith('data:')) return url;

			const partes = url.split('/');
			if (partes.length < 2) return url;

			const bucket = partes[0];
			const path = partes.slice(1).join('/');

			const { data: signData } = await import('$lib/infrastructure/supabase/admin-client').then(
				(m) => m.supabaseAdmin.storage.from(bucket).createSignedUrl(path, 3600)
			);
			return signData?.signedUrl || url;
		};

		// Procesar aportes para firmar archivos
		const aportesProcesados = await Promise.all(
			(aportes || []).map(async (aporte: any) => {
				const evidenciasEntrada = await Promise.all(
					(aporte.evidenciasEntrada || []).map(async (archivo: any) => ({
						...archivo,
						url: await firmarUrl(archivo.url)
					}))
				);

				const evidenciasSalida = await Promise.all(
					(aporte.evidenciasSalida || []).map(async (archivo: any) => ({
						...archivo,
						url: await firmarUrl(archivo.url)
					}))
				);

				return {
					...aporte,
					evidenciasEntrada,
					evidenciasSalida
				};
			})
		);

		return JSON.parse(
			JSON.stringify({
				proyecto,
				colaboracion,
				aportes: aportesProcesados
			})
		);
	} catch (e) {
		console.error(e);
		throw error(404, 'Proyecto no encontrado o error cargando aportes');
	}
};

export const actions: Actions = {
	editarArchivo: async ({ request, locals }) => {
		const usuario = locals.usuario;
		if (!usuario || !usuario.id_usuario) {
			return fail(401, { error: 'No autorizado' });
		}

		const formData = await request.formData();
		const id_archivo = Number(formData.get('id_archivo'));
		const descripcion = formData.get('descripcion')?.toString();
		const url = formData.get('url')?.toString();
		const nombre_original = formData.get('nombre_original')?.toString();
		const tipo_mime = formData.get('tipo_mime')?.toString();
		const tamanio_bytes = formData.get('tamanio_bytes')
			? Number(formData.get('tamanio_bytes'))
			: undefined;

		if (!id_archivo) {
			return fail(400, { error: 'Falta el ID del archivo' });
		}

		const archivoRepo = new PostgresArchivoRepository();
		const proyectoRepo = new PostgresProyectoRepository();
		const historialRepo = new PostgresHistorialDeCambiosRepository();
		const actualizarArchivo = new ActualizarArchivo(archivoRepo, proyectoRepo, historialRepo);

		try {
			const cambios: any = {};
			if (descripcion !== undefined) cambios.descripcion = descripcion;
			if (url) cambios.url = url;
			if (nombre_original) cambios.nombre_original = nombre_original;
			if (tipo_mime) cambios.tipo_mime = tipo_mime;
			if (tamanio_bytes) cambios.tamanio_bytes = tamanio_bytes;

			await actualizarArchivo.execute(id_archivo, usuario.id_usuario, cambios);
			return { success: true };
		} catch (err) {
			return fail(400, { error: err instanceof Error ? err.message : 'Error al editar archivo' });
		}
	},

	eliminarArchivo: async ({ request, locals }) => {
		const usuario = locals.usuario;
		if (!usuario || !usuario.id_usuario) {
			return fail(401, { error: 'No autorizado' });
		}

		const formData = await request.formData();
		const id_archivo = Number(formData.get('id_archivo'));

		if (!id_archivo) {
			return fail(400, { error: 'Falta el ID del archivo' });
		}

		const archivoRepo = new PostgresArchivoRepository();
		const proyectoRepo = new PostgresProyectoRepository();
		const historialRepo = new PostgresHistorialDeCambiosRepository();
		const eliminarArchivoUC = new EliminarArchivo(archivoRepo, proyectoRepo, historialRepo);

		try {
			// 1. Eliminar de la base de datos (valida propiedad y estado)
			const archivo = await eliminarArchivoUC.execute(id_archivo, usuario.id_usuario);

			// 2. Intentar eliminar físicamente de Supabase Storage
			if (archivo.url) {
				const partes = archivo.url.split('/');
				if (partes.length >= 2) {
					const bucket = partes[0];
					const path = partes.slice(1).join('/');
					await supabaseAdmin.storage.from(bucket).remove([path]);
				}
			}

			return { success: true };
		} catch (err) {
			return fail(400, { error: err instanceof Error ? err.message : 'Error al eliminar archivo' });
		}
	}
};
