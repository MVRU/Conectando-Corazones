import { redirect, type Handle } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import { env } from '$lib/infrastructure/config/env';

export const handle: Handle = async ({ event, resolve }) => {
	// 1. Inicializar Supabase Client para SSR
	event.locals.supabase = createServerClient(env.SUPABASE_URL || '', env.SUPABASE_ANON_KEY || '', {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});

	// 2. Helper seguro para obtener sesión
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

	// 3. Ejecutar auth check
	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	// 4. Sincronizar con Usuario de dominio (PostgreSQL)
	if (user) {
		const usuarioRepo = new PostgresUsuarioRepository();
		const usuario = await usuarioRepo.findByAuthId(user.id);

		if (usuario) {
			event.locals.usuario = usuario;
		} else {
			// Usuario autenticado en Supabase pero no existe en nuestra DB
			// Esto puede pasar si el registro falló a medias o se borró el usuario local.
			// Permitimos continuar, pero event.locals.usuario será undefined.
			console.warn(`Usuario autenticado en Supabase (ID: ${user.id}) sin registro en DB local.`);
		}
	}

	// 5. Protección de Rutas (Middleware)
	if (event.url.pathname.startsWith('/mis-proyectos')) {
		if (!event.locals.usuario) {
			throw redirect(303, '/iniciar-sesion');
		}
	}
	// Protección de rutas api que requieran auth estricta podría ir aquí o en cada endpoint

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};
