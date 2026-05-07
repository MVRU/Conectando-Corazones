import { redirect } from '@sveltejs/kit';
import type { Usuario } from '$lib/domain/entities/Usuario';

/**
 * Servicio de autorización centralizado para la aplicación.
 * Gestiona el mapeo de roles y permisos para el acceso a rutas.
 */
export class AuthGuard {
	/**
	 * Mapa de rutas protegidas y los roles permitidos para acceder a ellas.
	 * El orden importa: los prefijos más específicos deben ir primero.
	 */
	private static readonly ROUTE_PERMISSIONS: Array<{
		prefix: string;
		roles: string[];
		fallback: string;
	}> = [
		{ prefix: '/admin', roles: ['administrador'], fallback: '/' },
		{
			prefix: '/institucion',
			roles: ['institucion'],
			fallback: '/colaborador/mi-panel'
		},
		{
			prefix: '/colaborador',
			roles: ['colaborador'],
			fallback: '/institucion/mi-panel'
		},
		{
			prefix: '/mi-panel',
			roles: ['institucion', 'colaborador', 'administrador'],
			fallback: '/iniciar-sesion'
		},
		{
			prefix: '/configuracion',
			roles: ['institucion', 'colaborador', 'administrador'],
			fallback: '/iniciar-sesion'
		},
		{
			prefix: '/reportes',
			roles: ['institucion', 'colaborador', 'administrador'],
			fallback: '/iniciar-sesion'
		},
		{
			prefix: '/mensajes',
			roles: ['institucion', 'colaborador', 'administrador'],
			fallback: '/iniciar-sesion'
		},
		{
			prefix: '/mis-proyectos',
			roles: ['institucion', 'administrador'],
			fallback: '/iniciar-sesion'
		}
	];

	/**
	 * Verifica si un usuario tiene permiso para acceder a una ruta específica.
	 *
	 * @param pathname Ruta actual que se intenta acceder
	 * @param usuario Usuario autenticado (o null)
	 * @throws {Redirect} Redirige si el acceso es denegado o el usuario no está autenticado
	 */
	static checkAccess(pathname: string, usuario: Usuario | null | undefined): void {
		// 1. Identificar si la ruta requiere permisos específicos
		const rule = this.ROUTE_PERMISSIONS.find((r) => pathname.startsWith(r.prefix));

		if (!rule) {
			// Es una ruta pública o no registrada en el guardián
			return;
		}

		// 2. Si la ruta es protegida y no hay usuario, redirigir al login
		if (!usuario) {
			console.warn(`[AuthGuard] Acceso denegado a '${pathname}': Usuario no autenticado.`);
			const redirectTo = encodeURIComponent(pathname);
			throw redirect(303, `/iniciar-sesion?redirectTo=${redirectTo}&reason=unauthenticated`);
		}

		// 3. Verificar si el rol del usuario está en la lista de permitidos
		if (!rule.roles.includes(usuario.rol)) {
			console.warn(
				`[AuthGuard] Acceso denegado a '${pathname}': Rol '${usuario.rol}' no permitido.`
			);

			throw redirect(303, `${rule.fallback}?reason=forbidden`);
		}
	}

	/**
	 * Obtiene la ruta del panel principal según el rol del usuario.
	 * Utilizado para centralizar el 'multiplexer' de /mi-panel.
	 *
	 * @param usuario Usuario autenticado
	 * @returns Ruta del panel correspondiente
	 */
	static getPanelRedirect(usuario: Usuario): string {
		switch (usuario.rol) {
			case 'administrador':
				return '/admin';
			case 'institucion':
				return '/institucion/mi-panel';
			case 'colaborador':
				return '/colaborador/mi-panel';
			default:
				return '/';
		}
	}

	/**
	 * Se encarga de redirecciones para rutas que NO deberían ser accesibles si el usuario está logueado.
	 * Ejemplo: Login, Registro.
	 */
	static handleAuthRoutes(pathname: string, usuario: Usuario | null | undefined): void {
		if (
			usuario &&
			(pathname === '/iniciar-sesion' || pathname === '/registrarse' || pathname === '/login')
		) {
			console.info(
				`[AuthGuard] Redirigiendo a panel: Usuario ya autenticado intentó acceder a '${pathname}'.`
			);

			throw redirect(303, this.getPanelRedirect(usuario));
		}
	}
}
