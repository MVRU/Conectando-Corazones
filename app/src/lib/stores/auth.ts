import { writable, derived, get } from 'svelte/store';
import { esInstitucionVerificada } from '$lib/utils/util-verificacion';
import type {
	Usuario,
	Institucion,
	Colaborador,
	Organizacion,
	Unipersonal,
	Administrador
} from '$lib/domain/types/Usuario';
import type { Contacto } from '$lib/domain/types/Contacto';
import { validarCorreo, validarUsername } from '$lib/utils/validaciones';

/**
 * * DECISIÓN DE DISEÑO:
 *     -*- Se centralizó la lógica de autenticación en un store para facilitar el acceso global a la sesión y mantener un único origen de verdad.
 */

// Tipo uniión para todos los tipos de usuario posibles
type UsuarioCompleto = Usuario | Institucion | Organizacion | Unipersonal | Administrador;

interface RegisterPerfilBase
	extends Pick<Usuario, 'username' | 'nombre' | 'apellido' | 'fecha_nacimiento' | 'url_foto'> {
	contactos: Contacto[];
}

export interface RegisterColaboradorPerfil
	extends RegisterPerfilBase,
		Pick<Colaborador, 'tipo_colaborador'> {}

export interface RegisterInstitucionPerfil
	extends RegisterPerfilBase,
		Pick<Institucion, 'nombre_legal' | 'tipo_institucion'> {}

type RegistroMetadata = Record<string, unknown>;

interface RegisterInputBase<TPerfil extends RegisterPerfilBase> {
	email: string;
	password: string;
	perfil: TPerfil;
	metadata?: RegistroMetadata;
}

export type RegisterColaboradorInput = RegisterInputBase<RegisterColaboradorPerfil>;
export type RegisterInstitucionInput = RegisterInputBase<RegisterInstitucionPerfil>;

type RegistroResultado = 'api' | 'simulado';

interface StorageLike {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
}

interface RegistroSimulado {
	tipo: 'colaborador' | 'institucion';
	email: string;
	timestamp: string;
	perfil: Record<string, unknown>;
	metadata: RegistroMetadata | null;
}

const CLAVE_REGISTROS_SIMULADOS = 'cc:registro:simulado';

// Estado de autenticación
interface AuthState {
	usuario: UsuarioCompleto | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
}

// TODO: corregir la lógica de autenticación

// Estado inicial
const initialState: AuthState = {
	usuario: null,
	isAuthenticated: false,
	isLoading: true, // Estado de carga inicial verdadero para evitar destellos/condiciones de carrera
	error: null
};

// Estado para usuario no autenticado (cargado pero no conectado)
export const unauthenticatedState: AuthState = {
	usuario: null,
	isAuthenticated: false,
	isLoading: false,
	error: null
};

// Store principal de autenticación
export const authStore = writable<AuthState>(initialState);

// Stores derivados para facilitar el acceso
export const usuario = derived(authStore, ($auth) => $auth.usuario);
export const isAuthenticated = derived(authStore, ($auth) => $auth.isAuthenticated);
export const isLoading = derived(authStore, ($auth) => $auth.isLoading);
export const authError = derived(authStore, ($auth) => $auth.error);

// Store derivado para el rol del usuario
export const usuarioRol = derived(authStore, ($auth) => $auth.usuario?.rol ?? null);

// Store derivado para verificar rol
export const isAdmin = derived(authStore, ($auth) => $auth.usuario?.rol === 'administrador');
export const isInstitucion = derived(authStore, ($auth) => $auth.usuario?.rol === 'institucion');
export const isColaborador = derived(authStore, ($auth) => $auth.usuario?.rol === 'colaborador');

// Store derivado para verificar estado
export const isVerified = derived(authStore, ($auth) => $auth.usuario?.estado === 'activo');
export const isInstitucionVerificada = derived(authStore, ($auth) =>
	esInstitucionVerificada($auth.usuario)
);

// Funciones para manejar la autenticación
export const authActions = {
	/**
	 * Iniciar sesión (acepta email o username como "identificador")
	 */
	async login(
		identificador: string,
		password: string,
		recordarSesion: boolean = false
	): Promise<UsuarioCompleto | null> {
		const credencial = identificador?.trim();
		if (
			!credencial ||
			!password?.trim() ||
			(!validarCorreo(credencial) && !validarUsername(credencial))
		) {
			authStore.update((s) => ({ ...s, error: 'Credenciales inválidas', isLoading: false }));
			return null;
		}

		authStore.update((state) => ({ ...state, isLoading: true, error: null }));

		try {
			const response = await fetch('/api/iniciar-sesion', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					identificador: credencial,
					password,
					rememberMe: recordarSesion
				})
			});

			if (!response.ok) {
				const { error } = await response.json().catch(() => ({ error: null }));
				throw new Error(error ?? 'Error al iniciar sesión');
			}

			const { usuario } = (await response.json()) as { usuario: UsuarioCompleto };

			authStore.update((state) => ({
				...state,
				usuario,
				isAuthenticated: true,
				isLoading: false,
				error: null
			}));

			return usuario;
		} catch (error) {
			authStore.update((state) => ({
				...state,
				isLoading: false,
				error: error instanceof Error ? error.message : 'Error al iniciar sesión'
			}));
			throw error;
		}
	},

	/**
	 * Cerrar sesión
	 */
	async logout(): Promise<void> {
		try {
			await fetch('/api/cerrar-sesion', { method: 'POST' });
		} catch (error) {
			console.error('Error al cerrar sesión:', error);
		} finally {
			authStore.set(unauthenticatedState);
		}
	},

	/**
	 * Verificar sesión al cargar la app
	 */
	async checkAuth(): Promise<void> {
		authStore.update((state) => ({ ...state, isLoading: true }));
		try {
			const response = await fetch('/api/sesion');
			const { usuario } = (await response.json()) as { usuario: UsuarioCompleto | null };
			if (usuario) {
				authStore.update((state) => ({
					...state,
					usuario,
					isAuthenticated: true,
					isLoading: false,
					error: null
				}));
			} else {
				authStore.set(unauthenticatedState);
			}
		} catch (error) {
			console.error('Error al verificar autenticación:', error);
			authStore.set(unauthenticatedState);
		}
	},

	/**
	 * Limpiar estado de error
	 */
	clearError() {
		authStore.update((state) => ({ ...state, error: null }));
	},

	/**
	 * Actualizar datos del usuario
	 */
	updateUsuario(usuarioData: Partial<Usuario>) {
		authStore.update((state) => ({
			...state,
			usuario: state.usuario ? ({ ...state.usuario, ...usuarioData } as Usuario) : null
		}));
	},

	async registerColaborador(input: RegisterColaboradorInput): Promise<void> {
		validarRegistroColaborador(input);
		const endpoint = '/api/registro/colaborador';
		const fallbackError = 'No pudimos registrar tu cuenta de colaborador. Intentá nuevamente.';

		authStore.update((state) => ({ ...state, isLoading: true, error: null }));
		try {
			await enviarSolicitudRegistro(endpoint, input, fallbackError);
		} catch (error) {
			const message = obtenerMensajeError(error, fallbackError);
			authStore.update((state) => ({ ...state, error: message }));
			throw new Error(message);
		} finally {
			authStore.update((state) => ({ ...state, isLoading: false }));
		}
	},

	async registerInstitucion(input: RegisterInstitucionInput): Promise<void> {
		validarRegistroInstitucion(input);
		const endpoint = '/api/registro/institucion';
		const fallbackError =
			'No pudimos registrar la cuenta institucional. Revisa los datos e intentá más tarde.';

		authStore.update((state) => ({ ...state, isLoading: true, error: null }));
		try {
			await enviarSolicitudRegistro(endpoint, input, fallbackError);
		} catch (error) {
			const message = obtenerMensajeError(error, fallbackError);
			authStore.update((state) => ({ ...state, error: message }));
			throw new Error(message);
		} finally {
			authStore.update((state) => ({ ...state, isLoading: false }));
		}
	},

	async signInWithGoogle(rol: 'institucion' | 'colaborador'): Promise<UsuarioCompleto | null> {
		const rolNormalizado = normalizarRol(rol);
		const fallbackError = 'No pudimos completar la autenticación con Google.';

		authStore.update((state) => ({ ...state, isLoading: true, error: null }));
		try {
			const respuesta = await enviarSolicitudOAuth(rolNormalizado, fallbackError);
			const usuario = respuesta?.usuario ?? null;

			if (usuario) {
				authStore.update((state) => ({
					...state,
					usuario,
					isAuthenticated: true,
					error: null
				}));
			}

			return usuario;
		} catch (error) {
			const message = obtenerMensajeError(error, fallbackError);
			authStore.update((state) => ({ ...state, error: message }));
			throw new Error(message);
		} finally {
			authStore.update((state) => ({ ...state, isLoading: false }));
		}
	}
};

/**
 * Verificar permisos por rol
 */
export function hasPermission(permission: string): boolean {
	const state = get(authStore);
	if (state.usuario?.rol === 'administrador') return true;

	if (state.usuario?.rol === 'institucion') {
		const institucionPermissions = ['crear_proyecto', 'editar_proyecto', 'ver_proyectos_propios'];
		return institucionPermissions.includes(permission);
	}

	if (state.usuario?.rol === 'colaborador') {
		const colaboradorPermissions = ['ver_proyectos', 'hacer_donacion', 'ver_perfil'];
		return colaboradorPermissions.includes(permission);
	}

	return false;
}

/**
 * Verificar acceso a rutas por rol
 */
export function canAccessRoute(route: string): boolean {
	const routePermissions: Record<string, string[]> = {
		'/admin': ['administrador'],
		'/institucion': ['institucion', 'administrador'],
		'/colaborador': ['colaborador', 'administrador'],
		'/proyectos/crear': ['institucion', 'administrador'],
		'/mi-panel': ['institucion', 'colaborador', 'administrador'],
		'/configuracion': ['institucion', 'colaborador', 'administrador'],
		'/reportes': ['institucion', 'colaborador', 'administrador']
	};

	const state = get(authStore);
	const userRole = state.usuario?.rol;

	if (routePermissions[route]) {
		return !!userRole && routePermissions[route].includes(userRole);
	}

	const permissions = Object.entries(routePermissions).sort((a, b) => b[0].length - a[0].length);

	for (const [path, roles] of permissions) {
		if (route.startsWith(path)) {
			return !!userRole && roles.includes(userRole);
		}
	}

	return true;
}

function obtenerMensajeError(error: unknown, fallback: string): string {
	if (error instanceof Error) {
		const mensaje = error.message?.trim();
		if (mensaje) {
			return mensaje;
		}
	}
	return fallback;
}

function esTextoNoVacio(valor: unknown): valor is string {
	return typeof valor === 'string' && valor.trim().length > 0;
}

function validarContactos(contactos: Contacto[]): boolean {
	if (!Array.isArray(contactos) || contactos.length === 0) {
		return false;
	}
	return contactos.some((contacto) => contacto && esTextoNoVacio(contacto.valor));
}

function validarMetadata(metadata: RegistroMetadata | undefined): boolean {
	if (metadata === undefined) {
		return true;
	}
	return typeof metadata === 'object' && metadata !== null && !Array.isArray(metadata);
}

function validarRegistroBase<TPerfil extends RegisterPerfilBase>(
	input: RegisterInputBase<TPerfil>
): void {
	if (!validarCorreo(input.email)) {
		throw new Error('Ingresá un correo electrónico válido.');
	}

	/*
	const emailExistente = Object.values(mockUsuarios).some((u) =>
		u.contactos?.some((c) => c.tipo_contacto === 'email' && c.valor === input.email)
	);
	*/
	const emailExistente = false; // Validación se realiza en backend

	if (emailExistente) {
		throw new Error(`El correo electrónico "${input.email}" ya está en uso`);
	}

	if (!esTextoNoVacio(input.password) || input.password.length < 8) {
		throw new Error('La contraseña debe tener al menos 8 caracteres.');
	}

	if (!validarUsername(input.perfil.username)) {
		throw new Error('Ingresá un nombre de usuario válido.');
	}

	/*
	const usuarioExistente = Object.values(mockUsuarios).some(
		(u) => u.username === input.perfil.username
	);
	*/
	const usuarioExistente = false; // Validación se realiza en backend

	if (usuarioExistente) {
		throw new Error(`El nombre de usuario "${input.perfil.username}" ya está en uso`);
	}

	if (!esTextoNoVacio(input.perfil.nombre) || !esTextoNoVacio(input.perfil.apellido)) {
		throw new Error('Completá nombre y apellido.');
	}

	if (!validarContactos(input.perfil.contactos)) {
		throw new Error('Ingresá al menos un medio de contacto válido.');
	}

	if (!validarMetadata(input.metadata)) {
		throw new Error('La metadata enviada no tiene el formato correcto.');
	}
}

function validarRegistroColaborador(input: RegisterColaboradorInput): void {
	validarRegistroBase(input);

	if (!esTextoNoVacio(input.perfil.tipo_colaborador)) {
		throw new Error('Seleccioná el tipo de colaborador.');
	}
}

function validarRegistroInstitucion(input: RegisterInstitucionInput): void {
	validarRegistroBase(input);

	if (!esTextoNoVacio(input.perfil.nombre_legal)) {
		throw new Error('Ingresá el nombre legal de la institución.');
	}

	if (!esTextoNoVacio(input.perfil.tipo_institucion)) {
		throw new Error('Seleccioná el tipo de institución.');
	}
}

async function enviarSolicitudRegistro(
	endpoint: string,
	input: RegisterColaboradorInput | RegisterInstitucionInput,
	fallbackError: string
): Promise<RegistroResultado> {
	const payload =
		typeof structuredClone === 'function'
			? structuredClone(input)
			: JSON.parse(JSON.stringify(input));

	try {
		const response = await fetch(endpoint, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});

		if (response.ok) {
			return 'api';
		}

		if (esCodigoSimulable(response.status)) {
			simularRegistroLocal(endpoint, input);
			return 'simulado';
		}

		const mensaje = await extraerMensajeDeRespuesta(response, fallbackError);
		throw new Error(mensaje);
	} catch (error) {
		if (esErrorDeConectividad(error)) {
			simularRegistroLocal(endpoint, input);
			return 'simulado';
		}
		throw error;
	}
}

async function enviarSolicitudOAuth(
	rol: 'institucion' | 'colaborador',
	fallbackError: string
): Promise<{ usuario: UsuarioCompleto | null } | null> {
	const response = await fetch('/api/auth/google', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ rol })
	});

	if (!response.ok) {
		const data = await response.json().catch(() => ({ error: null }));
		const mensaje =
			typeof data?.error === 'string' && data.error.trim() ? data.error.trim() : fallbackError;
		throw new Error(mensaje);
	}

	if (response.status === 204) {
		return null;
	}

	return response.json().catch(() => ({ usuario: null }));
}

function normalizarRol(rol: string): 'institucion' | 'colaborador' {
	const limpio = rol?.toString().trim().toLowerCase();
	if (limpio === 'institucion' || limpio === 'colaborador') {
		return limpio;
	}
	throw new Error('El rol indicado no es válido para autenticación.');
}

export type { AuthState };

async function extraerMensajeDeRespuesta(response: Response, fallback: string): Promise<string> {
	try {
		const data = await response.json();
		const mensaje = typeof data?.error === 'string' ? data.error.trim() : '';
		return mensaje || fallback;
	} catch (error) {
		console.warn('No se pudo interpretar la respuesta de error del registro.', error);
		return fallback;
	}
}

function esCodigoSimulable(status: number): boolean {
	return status === 404 || status === 501;
}

function esErrorDeConectividad(error: unknown): boolean {
	if (error instanceof TypeError) {
		return true;
	}
	if (error instanceof Error) {
		const mensaje = error.message.toLowerCase();
		return mensaje.includes('fetch') || mensaje.includes('network');
	}
	return false;
}

// ? Riesgo: los registros simulados se almacenan sin cifrado y deben eliminarse al habilitar la integración real.
function simularRegistroLocal(
	endpoint: string,
	input: RegisterColaboradorInput | RegisterInstitucionInput
): void {
	const storage = obtenerAlmacenamientoSeguro();
	if (!storage) {
		return;
	}

	const registro: RegistroSimulado = {
		tipo: tipoRegistroDesdeEndpoint(endpoint),
		email: input.email,
		timestamp: new Date().toISOString(),
		perfil: serializarPerfilSimulado(input.perfil),
		metadata: clonarMetadata(input.metadata)
	};

	try {
		const existentes = JSON.parse(
			storage.getItem(CLAVE_REGISTROS_SIMULADOS) ?? '[]'
		) as RegistroSimulado[];
		const actualizados = [...existentes.slice(-9), registro];
		storage.setItem(CLAVE_REGISTROS_SIMULADOS, JSON.stringify(actualizados));
		console.info('Registro simulado almacenado localmente hasta completar la integración real.');
	} catch (error) {
		console.warn('No fue posible persistir el registro simulado.', error);
	}
}

function obtenerAlmacenamientoSeguro(): StorageLike | null {
	try {
		if (typeof window !== 'undefined' && window.localStorage) {
			return window.localStorage;
		}
	} catch (error) {
		console.warn('Acceso a localStorage restringido en window.', error);
	}

	try {
		if (typeof globalThis !== 'undefined') {
			const posible = (globalThis as { localStorage?: StorageLike }).localStorage;
			if (posible) {
				return posible;
			}
		}
	} catch (error) {
		console.warn('Acceso a localStorage restringido en globalThis.', error);
	}

	return null;
}

function tipoRegistroDesdeEndpoint(endpoint: string): 'colaborador' | 'institucion' {
	return endpoint.includes('institucion') ? 'institucion' : 'colaborador';
}

function serializarPerfilSimulado(
	perfil: RegisterColaboradorPerfil | RegisterInstitucionPerfil
): Record<string, unknown> {
	const { contactos, fecha_nacimiento, ...resto } = perfil;
	return {
		...resto,
		fecha_nacimiento: normalizarFecha(fecha_nacimiento),
		contactos: serializarContactos(contactos)
	};
}

function serializarContactos(contactos: Contacto[]): Array<Record<string, string>> {
	return contactos.filter(Boolean).map((contacto) => ({
		tipo_contacto: contacto.tipo_contacto ?? '',
		etiqueta: contacto.etiqueta ?? '',
		valor: contacto.valor ?? ''
	}));
}

function normalizarFecha(fecha: unknown): string | null {
	if (fecha instanceof Date) {
		return fecha.toISOString();
	}
	if (typeof fecha === 'string') {
		const parseada = new Date(fecha);
		if (!Number.isNaN(parseada.getTime())) {
			return parseada.toISOString();
		}
		return fecha;
	}
	return null;
}

function clonarMetadata(metadata: RegistroMetadata | undefined): RegistroMetadata | null {
	if (metadata === undefined) {
		return null;
	}
	try {
		return typeof structuredClone === 'function'
			? structuredClone(metadata)
			: JSON.parse(JSON.stringify(metadata));
	} catch (error) {
		console.warn('No se pudo clonar la metadata para el modo simulado.', error);
		return null;
	}
}
