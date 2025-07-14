import { writable, derived, get } from 'svelte/store';
import type {
  User,
  RegisterColaboradorData,
  RegisterInstitucionData
} from '$lib/types/User';
import { isValidEmail } from '$lib/utils/validators';

/**
 * * DECISIÓN DE DISEÑO:
 *     -*- Se centralizó la lógica de autenticación en un store para facilitar el acceso global a la sesión y mantener un único origen de verdad.
 */

// Estado de autenticación
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Estado inicial
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

// Store principal de autenticación
export const authStore = writable<AuthState>(initialState);

// Stores derivados para facilitar el acceso
export const user = derived(authStore, ($auth) => $auth.user);
export const isAuthenticated = derived(authStore, ($auth) => $auth.isAuthenticated);
export const isLoading = derived(authStore, ($auth) => $auth.isLoading);
export const authError = derived(authStore, ($auth) => $auth.error);

// Store derivado para el rol del usuario
export const userRole = derived(authStore, ($auth) => $auth.user?.role || null);

// Store derivado para verificar si es admin
export const isAdmin = derived(authStore, ($auth) => $auth.user?.role === 'admin');

// Store derivado para verificar si es institución
export const isInstitucion = derived(authStore, ($auth) => $auth.user?.role === 'institucion');

// Store derivado para verificar si es colaborador
export const isColaborador = derived(authStore, ($auth) => $auth.user?.role === 'colaborador');

// Store derivado para verificar si está verificado
export const isVerified = derived(authStore, ($auth) => $auth.user?.verificationStatus === 'verificado');

// Funciones para manejar la autenticación
export const authActions = {
  // Iniciar sesión (versión mock para pruebas)
  async login(email: string, password: string, rememberMe: boolean = false) {
    if (!isValidEmail(email) || !password.trim()) {
      authStore.update((s) => ({ ...s, error: 'Credenciales inválidas' }));
      return null;
    }
    authStore.update((state) => ({ ...state, isLoading: true, error: null }));

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe })
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error ?? 'Error al iniciar sesión');
      }

      const { user } = await response.json();

      authStore.update((state) => ({
        ...state,
        user: user as User,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }));

      return user;
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
  async registerInstitucion(userData: RegisterInstitucionData) {
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
  async registerColaborador(userData: RegisterColaboradorData) {
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
      const { user } = await response.json();

      if (user) {
        authStore.update((state) => ({
          ...state,
          user: user as User,
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
  updateUser(userData: Partial<User>) {
    authStore.update(state => ({
      ...state,
      user: state.user ? { ...state.user, ...userData } as User : null
    }));
  }
};

// Función para verificar permisos
export function hasPermission(permission: string): boolean {
  const state = get(authStore);
  if (state.user?.role === 'admin') return true;
  if (state.user?.role === 'institucion') {
    const institucionPermissions = ['crear_proyecto', 'editar_proyecto', 'ver_proyectos_propios'];
    return institucionPermissions.includes(permission);
  }
  if (state.user?.role === 'colaborador') {
    const colaboradorPermissions = ['ver_proyectos', 'hacer_donacion', 'ver_perfil'];
    return colaboradorPermissions.includes(permission);
  }
  return false;
}

// Función para verificar si puede acceder a una ruta
export function canAccessRoute(route: string): boolean {
  const routePermissions: Record<string, string[]> = {
    '/admin': ['admin'],
    '/institucion': ['institucion', 'admin'],
    '/colaborador': ['colaborador', 'admin'],
    '/proyectos/crear': ['institucion', 'admin'],
    '/perfil': ['institucion', 'colaborador', 'admin']
  };

  const requiredRoles = routePermissions[route] || [];

  const state = get(authStore);
  return (
    requiredRoles.length === 0 ||
    (!!state.user && requiredRoles.includes(state.user.role))
  );
}