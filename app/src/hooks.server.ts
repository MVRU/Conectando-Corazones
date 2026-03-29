import { type Handle } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';
import { dev } from '$app/environment';
import { env } from '$lib/infrastructure/config/env';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import { ObtenerUsuarioSesion } from '$lib/domain/use-cases/auth/ObtenerUsuarioSesion';
import { AuthGuard } from '$lib/infrastructure/auth/AuthGuard';

/**
 * Handler principal para gestionar sesión, Supabase y RBAC.
 */
export const handle: Handle = async ({ event, resolve }) => {
	const rememberMe = event.cookies.get('remember_me') === 'true';

	// 1. Inicializar cliente de Supabase (SSR)
	event.locals.supabase = createServerClient(env.SUPABASE_URL || '', env.SUPABASE_ANON_KEY || '', {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					const cookieOptions = {
						...options,
						path: '/',
						secure: !dev,
						httpOnly: true,
						sameSite: 'lax' as const
					};

					// Extender duración si el usuario marcó 'recordarme'
					if (rememberMe && name.includes('auth-token')) {
						cookieOptions.maxAge = 60 * 60 * 24 * 30; // 30 días
					}

					event.cookies.set(name, value, cookieOptions);
				});
			}
		}
	});

	/**
	 * Función para obtener la sesión de forma segura y tipada.
	 */
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

	// 2. Pre-poblar locals con sesión de Supabase
	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	// 3. Resolución de usuario de dominio (Backend local)
	if (user) {
		const usuarioRepo = new PostgresUsuarioRepository();
		const obtenerUsuario = new ObtenerUsuarioSesion(usuarioRepo);

		const usuarioDb = await obtenerUsuario.execute(user.id);
		if (usuarioDb) {
			event.locals.usuario = usuarioDb;
		}
	}

	// 4. Centralización de Control de Acceso (RBAC)
	const { pathname } = event.url;

	// Prevenir acceso a login/registro si ya está logueado
	AuthGuard.handleAuthRoutes(pathname, event.locals.usuario);

	// Proteger rutas según roles
	AuthGuard.checkAccess(pathname, event.locals.usuario);

	// 5. Resolver el request original
	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};
