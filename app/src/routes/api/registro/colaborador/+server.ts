import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { RegisterColaboradorInput } from '$lib/stores/auth';
import type { Organizacion } from '$lib/domain/types/Usuario';
import { RegistrationService } from '$lib/server/registration.service';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const input = (await request.json()) as RegisterColaboradorInput;
		const service = new RegistrationService();

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
			},
			consentimientos: input.consentimientos
		});

		return json({ usuario: usuarioCreado });
	} catch (error) {
		console.error('Error registrando colaborador:', error);
		if (error instanceof Error) {
			if (error.message.includes('P2002') || error.message.includes('unique constraint')) {
				return json(
					{ error: 'El nombre de usuario o correo electrónico ya está en uso.' },
					{ status: 409 }
				);
			}
			return json({ error: error.message }, { status: 400 });
		}
		return json({ error: 'Error interno del servidor' }, { status: 500 });
	}
};
