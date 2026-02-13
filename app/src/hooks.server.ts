import { redirect, type Handle } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import { env } from '$lib/infrastructure/config/env';

export const handle: Handle = async ({ event, resolve }) => {
	const rememberMe = event.cookies.get('remember_me') === 'true';

	event.locals.supabase = createServerClient(env.SUPABASE_URL || '', env.SUPABASE_ANON_KEY || '', {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					const cookieOptions = { ...options, path: '/' };
					// Si el usuario pidió recordar sesión, extendemos la duración de las cookies de auth
					if (rememberMe) {
						cookieOptions.maxAge = 60 * 60 * 24 * 30; // 30 días
					} else if (cookieOptions.maxAge) {
						cookieOptions.maxAge = undefined;
					}
					event.cookies.set(name, value, cookieOptions);
				});
			}
		}
	});

	event.locals.safeGetSession = async () => {
		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();

		if (error || !user) {
			return { session: null, user: null };
		}

		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();

		return { session, user };
	};

	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	if (user) {
		const sessionCookie = event.cookies.get('session_usuario');
		let usuario: PostgresUsuarioRepository | null = null;

		if (sessionCookie) {
			try {
				const parsed = JSON.parse(sessionCookie);
				// Verificar que la cookie pertenezca al usuario autenticado actual
				if (parsed.auth_user_id === user.id) {
					const { Usuario } = await import('$lib/domain/entities/Usuario');
					event.locals.usuario = new Usuario(parsed);
				}
			} catch (e) {
				console.warn('Error al parsear cookie de sesión de usuario, se invalidará.', e);
				event.cookies.delete('session_usuario', { path: '/' });
			}
		}

		// Si no se recuperó de la cookie (o era inválida/otro usuario), consultar DB
		if (!event.locals.usuario) {
			const usuarioRepo = new PostgresUsuarioRepository();
			const usuarioDb = await usuarioRepo.findByAuthId(user.id);

			if (usuarioDb) {
				event.locals.usuario = usuarioDb;
				const maxAge = rememberMe ? 60 * 60 * 24 * 30 : undefined;
				event.cookies.set('session_usuario', JSON.stringify(usuarioDb), {
					path: '/',
					httpOnly: false,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'lax',
					maxAge
				});
			} else {
				console.warn(`Usuario autenticado en Supabase (ID: ${user.id}) sin registro en DB local.`);
			}
		}
	}

	// Protección de Rutas (Middleware)
	if (event.url.pathname.startsWith('/mis-proyectos')) {
		if (!event.locals.usuario) {
			throw redirect(303, '/iniciar-sesion');
		}
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};
