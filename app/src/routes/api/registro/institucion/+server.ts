import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { RegisterInstitucionInput } from '$lib/stores/auth';
import { RegistrationService } from '$lib/server/registration.service';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const input = (await request.json()) as RegisterInstitucionInput;
		const service = new RegistrationService();

		const usuarioCreado = await service.registrar({
			email: input.email,
			password: input.password,
			rol: 'institucion',
			perfil: {
				username: input.perfil.username,
				nombre: input.perfil.nombre,
				apellido: input.perfil.apellido,
				fecha_nacimiento: input.perfil.fecha_nacimiento?.toString(),
				url_foto: input.perfil.url_foto,
				contactos: input.perfil.contactos,
				nombre_legal: input.perfil.nombre_legal,
				tipo_institucion: input.perfil.tipo_institucion
			},
			metadata: input.metadata
		});

		return json({ usuario: usuarioCreado });
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
