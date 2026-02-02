import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { RegistrarUsuario } from '$lib/domain/use-cases/auth/RegistrarUsuario';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import { Usuario } from '$lib/domain/entities/Usuario';
import type { RegisterColaboradorInput } from '$lib/stores/auth';
import type { Organizacion } from '$lib/domain/types/Usuario';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const input = (await request.json()) as RegisterColaboradorInput;

		const repo = new PostgresUsuarioRepository();
		const useCase = new RegistrarUsuario(repo);

		// Extraer metadata adicional
		const orgMetadata = input.metadata?.organizacion as Partial<Organizacion> | undefined;

		const nuevoUsuario = new Usuario({
			username: input.perfil.username,
			password: input.password,
			nombre: input.perfil.nombre,
			apellido: input.perfil.apellido,
			fecha_nacimiento: input.perfil.fecha_nacimiento
				? new Date(input.perfil.fecha_nacimiento)
				: undefined,
			estado: 'activo',
			rol: 'colaborador',
			url_foto: input.perfil.url_foto,
			contactos: input.perfil.contactos,
			tipo_colaborador: input.perfil.tipo_colaborador,

			razon_social: orgMetadata?.razon_social,
			con_fines_de_lucro: orgMetadata?.con_fines_de_lucro
		});

		const created = await useCase.execute(nuevoUsuario);
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password: _, ...usuarioSafe } = created;

		return json({ usuario: usuarioSafe });
	} catch (error) {
		console.error('Error registering collaborator:', error);
		if (error instanceof Error) {
			// Prisma P2002 es violación de restricción única
			if (error.message.includes('unique') || error.message.includes('P2002')) {
				return json({ error: 'El nombre de usuario o email ya está en uso' }, { status: 409 });
			}
			return json({ error: error.message }, { status: 500 });
		}
		return json({ error: 'Error interno del servidor' }, { status: 500 });
	}
};
