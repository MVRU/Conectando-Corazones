import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import { validarCorreo } from '$lib/utils/validaciones';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const { identificador, password } = await request.json();

		if (!identificador || !password) {
			return json({ error: 'Credenciales incompletas' }, { status: 400 });
		}

		const repo = new PostgresUsuarioRepository();
		let email = identificador;

		// Si no es correo, asumimos que es username y buscamos el email
		if (!validarCorreo(identificador)) {
			// Necesitamos buscar el usuario por username y extraer el email de sus contactos.

			const usuario = await repo.findByUsername(identificador);
			if (!usuario || !usuario.contactos) {
				return json({ error: 'Credenciales inválidas' }, { status: 401 });
			}

			const emailContacto = usuario.contactos.find((c) => c.tipo_contacto === 'email');
			if (!emailContacto || !emailContacto.valor) {
				return json(
					{ error: 'El usuario no tiene un email asociado para iniciar sesión' },
					{ status: 401 }
				);
			}
			email = emailContacto.valor;
		}

		// Iniciar sesión en Supabase
		const { data, error } = await locals.supabase.auth.signInWithPassword({
			email: email,
			password: password
		});

		if (error) {
			console.error('Supabase Auth Login Error:', error);
			return json({ error: 'Credenciales inválidas' }, { status: 401 });
		}

		if (!data.user) {
			return json({ error: 'Error al iniciar sesión' }, { status: 500 });
		}

		// Obtener usuario de dominio completo para devolver al frontend
		const usuario = await repo.findByAuthId(data.user.id);

		if (!usuario) {
			// Caso borde: Existe en Auth pero no en DB local
			return json({ error: 'Usuario no registrado en el sistema' }, { status: 401 });
		}

		// Strip sensitive data
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password: _, ...usuarioSafe } = usuario;

		return json({ usuario: usuarioSafe });
	} catch (error) {
		console.error('ERROR INICIAR SESION:', error);
		if (error instanceof Error) {
			console.error('Mensaje del error:', error.message);
			console.error('Stack del error:', error.stack);
		}
		return json({ error: 'Error interno del servidor' }, { status: 500 });
	}
};
