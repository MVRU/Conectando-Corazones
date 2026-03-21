import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import { supabaseAdmin } from '$lib/infrastructure/supabase/admin-client';
import { validarCorreo } from '$lib/utils/validaciones';

export const POST: RequestHandler = async ({ request, locals, cookies }) => {
	try {
		const { identificador, password, rememberMe } = await request.json();

		if (!identificador || !password) {
			return json({ error: 'Credenciales incompletas' }, { status: 400 });
		}

		const repo = new PostgresUsuarioRepository();
		let email = identificador;


		if (!validarCorreo(identificador)) {
			const usuarioDb = await repo.findByUsername(identificador);
			if (!usuarioDb) {
				return json({ error: 'Credenciales inválidas' }, { status: 401 });
			}


			const emailContacto = usuarioDb.contactos?.find((c) => c.tipo_contacto === 'email');

			if (emailContacto?.valor) {
				email = emailContacto.valor;
			} else if (usuarioDb.auth_user_id) {

				const { data: authUserData, error: authLookupError } =
					await supabaseAdmin.auth.admin.getUserById(usuarioDb.auth_user_id);

				if (authLookupError || !authUserData.user?.email) {
					console.error('No se pudo obtener el email desde Supabase Auth:', authLookupError);
					return json({ error: 'Credenciales inválidas' }, { status: 401 });
				}
				email = authUserData.user.email;
			} else {
				return json({ error: 'Credenciales inválidas' }, { status: 401 });
			}
		}


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


		const usuario = await repo.findByAuthId(data.user.id);

		if (!usuario) {

			return json({ error: 'Usuario no registrado en el sistema' }, { status: 401 });
		}


		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password: _pwd, ...usuarioSafe } = usuario.toPOJO();


		const maxAge = rememberMe ? 60 * 60 * 24 * 30 : undefined;

		if (rememberMe) {
			cookies.set('remember_me', 'true', {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge
			});
		} else {
			cookies.delete('remember_me', { path: '/' });
		}


		cookies.set('session_usuario', JSON.stringify(usuarioSafe), {
			path: '/',
			httpOnly: false,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge
		});


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
