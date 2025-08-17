import { writable, derived, get } from 'svelte/store';
import type {
  Usuario,
  Institucion,
  Colaborador
} from '$lib/types/Usuario';
import { isValidEmail } from '$lib/utils/validators';

/**
 * * DECISIÓN DE DISEÑO:
 *     -*- Se centralizó la lógica de autenticación en un store para facilitar el acceso global a la sesión y mantener un único origen de verdad.
 */

// Tipos para registro
interface RegisterColaboradorData {
  username: string;
  nombre: string;
  apellido: string;
  tipo_documento: string;
  numero_documento: string;
  fecha_nacimiento: string;
  cuit_cuil: string;
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
  fecha_nacimiento: string;
  cuit: string;
  nombre_legal: string;
  tipo_institucion: string;
  email: string;
  password: string;
}

// Estado de autenticación
interface AuthState {
  usuario: Usuario | null;
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
export const usuarioRol = derived(authStore, ($auth) => $auth.usuario?.rol || null);

// Store derivado para verificar si es admin
export const isAdmin = derived(authStore, ($auth) => $auth.usuario?.rol === 'administrador');

// Store derivado para verificar si es institución
export const isInstitucion = derived(authStore, ($auth) => $auth.usuario?.rol === 'institucion');

// Store derivado para verificar si es colaborador
export const isColaborador = derived(authStore, ($auth) => $auth.usuario?.rol === 'colaborador');

// Store derivado para verificar si está verificado
export const isVerified = derived(authStore, ($auth) => $auth.usuario?.estado === 'activo');

// Funciones para manejar la autenticación
export const authActions = {
  // Iniciar sesión (versión mock para pruebas)
  async login(username: string, password: string, rememberMe: boolean = false) {
    if (!username.trim() || !password.trim()) {
      authStore.update((s) => ({ ...s, error: 'Credenciales inválidas' }));
      return null;
    }
    authStore.update((state) => ({ ...state, isLoading: true, error: null }));

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, rememberMe })
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error ?? 'Error al iniciar sesión');
      }

      const { usuario } = await response.json();

      authStore.update((state) => ({
        ...state,
        usuario: usuario as Usuario,
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

  // Cerrar sesión
  async logout() {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      authStore.set(initialState);
    }
  },

  // Registrar institución
  async registerInstitucion(usuarioData: RegisterInstitucionData) {
    authStore.update(state => ({ ...state, isLoading: true, error: null }));

    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simular registro exitoso
      const result = { success: true, message: 'Institución registrada exitosamente' };

      authStore.update(state => ({
        ...state,
        isLoading: false,
        error: null
      }));

      return result;
    } catch (error) {
      authStore.update(state => ({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error al registrar'
      }));
      throw error;
    }
  },

  // Registrar colaborador
  async registerColaborador(usuarioData: RegisterColaboradorData) {
    authStore.update(state => ({ ...state, isLoading: true, error: null }));

    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simular registro exitoso
      const result = { success: true, message: 'Colaborador registrado exitosamente' };

      authStore.update(state => ({
        ...state,
        isLoading: false,
        error: null
      }));

      return result;
    } catch (error) {
      authStore.update(state => ({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error al registrar'
      }));
      throw error;
    }
  },

  // Verificar token al cargar la app
  async checkAuth() {
    authStore.update((state) => ({ ...state, isLoading: true }));

    try {
      const response = await fetch('/api/session');
      const { usuario } = await response.json();

      if (usuario) {
        authStore.update((state) => ({
          ...state,
          usuario: usuario as Usuario,
          isAuthenticated: true,
          isLoading: false
        }));
      } else {
        authStore.set(initialState);
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      authStore.set(initialState);
    }
  },

  // Limpiar error
  clearError() {
    authStore.update(state => ({ ...state, error: null }));
  },

  // Actualizar datos del usuario
  updateUsuario(usuarioData: Partial<Usuario>) {
    authStore.update(state => ({
      ...state,
      usuario: state.usuario ? { ...state.usuario, ...usuarioData } as Usuario : null
    }));
  }
};

// Función para verificar permisos
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

// Función para verificar si puede acceder a una ruta
export function canAccessRoute(route: string): boolean {
  const routePermissions: Record<string, string[]> = {
    '/admin': ['administrador'],
    '/institucion': ['institucion', 'administrador'],
    '/colaborador': ['colaborador', 'administrador'],
    '/proyectos/crear': ['institucion', 'administrador'],
    '/perfil': ['institucion', 'colaborador', 'administrador']
  };

  const requiredRoles = routePermissions[route] || [];

  const state = get(authStore);
  return (
    requiredRoles.length === 0 ||
    (!!state.usuario && requiredRoles.includes(state.usuario.rol))
  );
}