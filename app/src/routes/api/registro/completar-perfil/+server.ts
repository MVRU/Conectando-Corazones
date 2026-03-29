import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import { ActualizarUsuario } from '$lib/domain/use-cases/usuarios/ActualizarUsuario';
import type { Usuario } from '$lib/domain/entities/Usuario';
import type { Categoria } from '$lib/domain/types/Categoria';
import type { TipoParticipacion } from '$lib/domain/types/TipoParticipacion';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.usuario) {
		return json({ success: false, error: 'No autenticado' }, { status: 401 });
	}

	try {
		const body = await request.json();
		const { id_usuario, contactos, direccion, categorias, tiposParticipacion } = body;

		if (!id_usuario) {
			return json({ success: false, error: 'ID de usuario requerido' }, { status: 400 });
		}

		if (locals.usuario.rol !== 'administrador' && locals.usuario.id_usuario !== parseInt(id_usuario)) {
			return json({ success: false, error: 'No autorizado' }, { status: 403 });
		}

		const repo = new PostgresUsuarioRepository();
		const actualizarUseCase = new ActualizarUsuario(repo);

		// Construir objeto de cambios
		const cambios: Partial<Usuario> = {};

		if (contactos && Array.isArray(contactos)) {
			cambios.contactos = contactos.map(
				(c: { tipo_contacto: string; valor: string; etiqueta?: string }) => ({
					tipo_contacto: c.tipo_contacto,
					valor: c.valor,
					etiqueta: c.etiqueta
				})
			);
		}

		if (direccion?.localidadId) {
			cambios.localidad_id = parseInt(direccion.localidadId);
		}

		if (categorias && Array.isArray(categorias)) {
			cambios.categorias_preferidas = categorias.map((id: number) => ({
				id_categoria: id
			})) as unknown as Categoria[];
		}

		if (tiposParticipacion && Array.isArray(tiposParticipacion)) {
			cambios.tipos_participacion_preferidas = tiposParticipacion.map((id: number) => ({
				id_tipo_participacion: id
			})) as unknown as TipoParticipacion[];
		}

		if (Object.keys(cambios).length === 0) {
			return json({ success: true, message: 'Nada para actualizar' });
		}

		const updatedUser = await actualizarUseCase.execute(parseInt(id_usuario), cambios);

		return json({ success: true, data: updatedUser });
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Error interno';
		console.error('Error actualizando perfil:', error);
		return json({ success: false, error: errorMessage }, { status: 500 });
	}
};
