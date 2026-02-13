import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { RegisterColaboradorInput } from '$lib/stores/auth';
import type { Organizacion } from '$lib/domain/types/Usuario';
import { RegistrationService } from '$lib/server/registration.service';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const input = (await request.json()) as RegisterColaboradorInput;
		const service = new RegistrationService();

		// Extraer metadata adicional
		const orgMetadata = input.metadata?.organizacion as Partial<Organizacion> | undefined;

		const usuarioCreado = await service.registrar({
			email: input.email,
			password: input.password,
			rol: 'colaborador',
			perfil: {
				username: input.perfil.username,
				nombre: input.perfil.nombre,
				apellido: input.perfil.apellido,
				fecha_nacimiento: input.perfil.fecha_nacimiento?.toString(),
				url_foto: input.perfil.url_foto,
				contactos: input.perfil.contactos,
				tipo_colaborador: input.perfil.tipo_colaborador
			},
			metadata: {
				organizacion: {
					razon_social: orgMetadata?.razon_social,
					con_fines_de_lucro: orgMetadata?.con_fines_de_lucro ? 'true' : 'false'
				}
			}
		});

		return json({ usuario: usuarioCreado });
	} catch (error) {
		console.error('Error registering collaborator:', error);
		if (error instanceof Error) {
			// Prisma P2002 es violación de restricción única
			if (error.message.includes('unique') || error.message.includes('P2002')) {
				return json({ error: 'El nombre de usuario o email ya está en uso' }, { status: 409 });
			}
			// Auth errors
			if (error.message.includes('Auth')) {
				return json({ error: error.message }, { status: 400 });
			}
			return json({ error: error.message }, { status: 500 });
		}
		return json({ error: 'Error interno del servidor' }, { status: 500 });
	}
};
