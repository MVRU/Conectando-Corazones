import { writable, derived, get } from 'svelte/store';
import type { Usuario, Institucion, Organizacion, Unipersonal, Administrador } from '$lib/types/Usuario';
import { validarCorreo, validarUsername } from '$lib/utils/validaciones';

/**
 * * DECISIÓN DE DISEÑO:
 *     -*- Se centralizó la lógica de autenticación en un store para facilitar el acceso global a la sesión y mantener un único origen de verdad.
 */

// Tipo unión para todos los tipos de usuario posibles
type UsuarioCompleto = Usuario | Institucion | Organizacion | Unipersonal | Administrador;

// Tipos para registro
interface RegisterColaboradorData {
  username: string;
  nombre: string;
  apellido: string;
  tipo_documento: string;
  numero_documento: string;
  fecha_nacimiento: Date;
  cuit_cuil: string; // ! quitar cuando corrijamos signin
  tipo_colaborador: string;
  email: string;
  password: string;
}

interface RegisterInstitucionData {
  username: string;
  nombre: string;
  apellido: string;
  tipo_documento: string;
  numero_documento: string;
  fecha_nacimiento: Date;
  cuit: string; // ! quitar cuando corrijamos signin
  nombre_legal: string;
  tipo_institucion: string;
  email: string;
  password: string;
}

// Estado de autenticación
interface AuthState {
  usuario: UsuarioCompleto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Estado inicial
const initialState: AuthState = {
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

// Funciones para manejar la autenticación
export const authActions = {
  /**
   * Iniciar sesión (acepta email o username como "identificador")
   */
  async login(identificador: string, password: string, recordarSesion: boolean = false): Promise<UsuarioCompleto | null> {
    const credencial = identificador?.trim();
    if (
      !credencial ||
      !password?.trim() ||
      (!validarCorreo(credencial) && !validarUsername(credencial))
    ) {
      authStore.update((s) => ({ ...s, error: 'Credenciales inválidas' }));
      return null;
    }

    authStore.update((state) => ({ ...state, isLoading: true, error: null }));

    try {
      const response = await fetch('/api/login', {
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
      await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      authStore.set(initialState);
    }
  },

  /**
   * Registrar institución (mock)
   */
  async registerInstitucion(_usuarioData: RegisterInstitucionData) {
    authStore.update((state) => ({ ...state, isLoading: true, error: null }));
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const result = { success: true, message: 'Institución registrada exitosamente' };
      authStore.update((state) => ({ ...state, isLoading: false, error: null }));
      return result;
    } catch (error) {
      authStore.update((state) => ({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error al registrar'
      }));
      throw error;
    }
  },

  /**
   * Registrar colaborador (mock)
   */
  async registerColaborador(_usuarioData: RegisterColaboradorData) {
    authStore.update((state) => ({ ...state, isLoading: true, error: null }));
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const result = { success: true, message: 'Colaborador registrado exitosamente' };
      authStore.update((state) => ({ ...state, isLoading: false, error: null }));
      return result;
    } catch (error) {
      authStore.update((state) => ({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error al registrar'
      }));
      throw error;
    }
  },

  /**
   * Verificar sesión al cargar la app
   */
  async checkAuth(): Promise<void> {
    authStore.update((state) => ({ ...state, isLoading: true }));
    try {
      const response = await fetch('/api/session');
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
        authStore.set(initialState);
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      authStore.set(initialState);
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
    '/perfil': ['institucion', 'colaborador', 'administrador']
  };

  const requiredRoles = routePermissions[route] ?? [];
  const state = get(authStore);

  return (
    requiredRoles.length === 0 ||
    (!!state.usuario && requiredRoles.includes(state.usuario.rol))
  );
}
