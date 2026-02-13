import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import { ActualizarUsuario } from '$lib/domain/use-cases/usuarios/ActualizarUsuario';
import type { Usuario } from '$lib/domain/entities/Usuario';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { id_usuario, contactos, direccion, categorias, tiposParticipacion } = body;

		if (!id_usuario) {
			return json({ success: false, error: 'ID de usuario requerido' }, { status: 400 });
		}

		const repo = new PostgresUsuarioRepository();
		const actualizarUseCase = new ActualizarUsuario(repo);

		// Construir objeto de cambios
		const cambios: Partial<Usuario> = {};

		if (contactos && Array.isArray(contactos)) {
			cambios.contactos = contactos.map((c: any) => ({
				tipo_contacto: c.tipo_contacto,
				valor: c.valor,
				etiqueta: c.etiqueta
			}));
		}

		if (direccion?.localidadId) {
			cambios.localidad_id = parseInt(direccion.localidadId);
		}

		if (categorias && Array.isArray(categorias)) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			cambios.categorias_preferidas = categorias.map((id: number) => ({
				id_categoria: id
			})) as any;
		}

		if (tiposParticipacion && Array.isArray(tiposParticipacion)) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			cambios.tipos_participacion_preferidas = tiposParticipacion.map((id: number) => ({
				id_tipo_participacion: id
			})) as any;
		}

		if (Object.keys(cambios).length === 0) {
			return json({ success: true, message: 'Nada para actualizar' });
		}

		const updatedUser = await actualizarUseCase.execute(parseInt(id_usuario), cambios);

		return json({ success: true, data: updatedUser });
	} catch (error: any) {
		console.error('Error actualizando perfil:', error);
		return json({ success: false, error: error.message || 'Error interno' }, { status: 500 });
	}
};
