import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { RegistrarUsuario } from '$lib/domain/use-cases/auth/RegistrarUsuario';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import { Usuario } from '$lib/domain/entities/Usuario';
import type { RegisterInstitucionInput } from '$lib/stores/auth';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const input = (await request.json()) as RegisterInstitucionInput;

		const repo = new PostgresUsuarioRepository();
		const useCase = new RegistrarUsuario(repo);

		const nuevoUsuario = new Usuario({
			username: input.perfil.username,
			password: input.password,
			nombre: input.perfil.nombre,
			apellido: input.perfil.apellido,
			fecha_nacimiento: input.perfil.fecha_nacimiento
				? new Date(input.perfil.fecha_nacimiento)
				: undefined,
			estado: 'activo',
			rol: 'institucion',
			url_foto: input.perfil.url_foto,
			contactos: input.perfil.contactos,

			nombre_legal: input.perfil.nombre_legal,
			tipo_institucion: input.perfil.tipo_institucion
		});

		const created = await useCase.execute(nuevoUsuario);
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password: _, ...usuarioSafe } = created;

		return json({ usuario: usuarioSafe });
	} catch (error) {
		console.error('Error registering institution:', error);
		if (error instanceof Error) {
			if (error.message.includes('unique') || error.message.includes('P2002')) {
				return json({ error: 'El nombre de usuario o email ya está en uso' }, { status: 409 });
			}
			return json({ error: error.message }, { status: 500 });
		}
		return json({ error: 'Error interno del servidor' }, { status: 500 });
	}
};
