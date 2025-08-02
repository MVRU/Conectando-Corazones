import { writable, derived } from 'svelte/store';
import type { User, RegisterColaboradorData, RegisterInstitucionData } from '$lib/types/User';

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

// Usuarios de prueba estáticos
const mockUsers = {
  admin: {
    id: '1',
    email: 'admin@conectandocorazones.org',
    nombre: 'Administrador',
    role: 'admin' as const,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    verificationStatus: 'verificado' as const,
    permisos: {
      gestionarUsuarios: true,
      gestionarProyectos: true,
      gestionarInstituciones: true,
      verReportes: true,
      gestionarSistema: true
    },
    telefono: '+54 341 123-4567',
    departamento: 'Administración'
  },
  /**
   * * Datos de prueba para institución
   * -*- Se alinean con las interfaces de usuario institucional
   *     para validar la vista de perfil.
   */
  institucion: {
    id: '1',
    username: 'escuelaesperanza',
    email: 'contacto@escuelaesperanza.edu.ar',
    nombre: 'Marta Fernández',
    tipoDocumento: 'DNI',
    numeroDocumento: '12345678',
    fechaNacimiento: new Date('1980-05-15'),
    role: 'institucion' as const,
    isActive: true,
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date(),
    verificationStatus: 'verificado' as const,
    profile: '/users/escuela-esperanza.jpg',
    razonSocial: 'Escuela Esperanza',
    cuit: '30-12345678-1',
    telefono: '+54 341 123-4567',
    direccion: {
      calle: 'Belgrano',
      numero: '1234',
      ciudad: 'Rosario',
      provincia: 'Santa Fe',
      codigoPostal: '2000'
    },
    descripcion: 'Escuela rural comprometida con la educación inclusiva.',
    sitioWeb: 'escuelaesperanza.edu.ar',
    tipoInstitucion: 'escuela' as const,
    capacidadBeneficiarios: 150,
    proyectosCreados: ['1']
  },
  colaborador: {
    id: '3',
    email: 'juan.perez@gmail.com',
    nombre: 'Juan Pérez',
    role: 'colaborador' as const,
    isActive: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date(),
    verificationStatus: 'verificado' as const,
    tipoColaborador: 'persona' as const,
    telefono: '+54 341 555-1234',
    direccion: {
      calle: 'Belgrano',
      numero: '456',
      ciudad: 'Rosario',
      provincia: 'Santa Fe',
      codigoPostal: '2000'
    },
    persona: {
      dni: '12345678',
      fechaNacimiento: new Date('1990-05-15'),
      genero: 'masculino' as const
    },
    colaboraciones: ['1', '3'],
    preferencias: {
      categorias: ['educacion', 'salud'],
      provincias: ['santa-fe', 'buenos-aires'],
      notificaciones: true
    }
  }
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
export const isVerified = derived(
  authStore,
  ($auth) => $auth.user?.verificationStatus === 'verificado'
);

// Funciones para manejar la autenticación
export const authActions = {
  // Iniciar sesión (versión mock para pruebas)
  async login(email: string, password: string, rememberMe: boolean = false) {
    void rememberMe;
    authStore.update((state) => ({ ...state, isLoading: true, error: null }));

    try {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Buscar usuario en datos mock
      const foundUser = Object.values(mockUsers).find((u) => u.email === email);

      if (!foundUser || password !== '123456') {
        throw new Error('Credenciales inválidas');
      }

      authStore.update((state) => ({
        ...state,
        user: foundUser as User,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }));

      return foundUser;
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
      // Limpiar token local
      localStorage.removeItem('authToken');

      // Resetear estado
      authStore.set(initialState);
    }
  },

  // Registrar institución
  async registerInstitucion(userData: RegisterInstitucionData) {
    void userData;
    authStore.update((state) => ({ ...state, isLoading: true, error: null }));

    try {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simular registro exitoso
      const result = { success: true, message: 'Institución registrada exitosamente' };

      authStore.update((state) => ({
        ...state,
        isLoading: false,
        error: null
      }));

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

  // Registrar colaborador
  async registerColaborador(userData: RegisterColaboradorData) {
    void userData;
    authStore.update((state) => ({ ...state, isLoading: true, error: null }));

    try {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simular registro exitoso
      const result = { success: true, message: 'Colaborador registrado exitosamente' };

      authStore.update((state) => ({
        ...state,
        isLoading: false,
        error: null
      }));

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

  // Verificar token al cargar la app
  async checkAuth() {
    const token = localStorage.getItem('authToken');
    if (!token) return;

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
    authStore.update((state) => ({ ...state, error: null }));
  },

  // Actualizar datos del usuario
  updateUser(userData: Partial<User>) {
    authStore.update((state) => ({
      ...state,
      user: state.user ? ({ ...state.user, ...userData } as User) : null
    }));
  }
};

// Función para verificar permisos
export function hasPermission(permission: string): boolean {
  let hasPermission = false;

  authStore.subscribe((state) => {
    if (state.user?.role === 'admin') {
      hasPermission = true;
    } else if (state.user?.role === 'institucion') {
      // Permisos específicos para instituciones
      const institucionPermissions = ['crear_proyecto', 'editar_proyecto', 'ver_proyectos_propios'];
      hasPermission = institucionPermissions.includes(permission);
    } else if (state.user?.role === 'colaborador') {
      // Permisos específicos para colaboradores
      const colaboradorPermissions = ['ver_proyectos', 'hacer_donacion', 'ver_perfil'];
      hasPermission = colaboradorPermissions.includes(permission);
    }
  })();

  return hasPermission;
}

// Función para verificar si puede acceder a una ruta
// TODO: corregir rutas y permisos
export function canAccessRoute(route: string): boolean {
  const routePermissions: Record<string, string[]> = {
    '/admin': ['admin'],
    '/institucion': ['institucion', 'admin'],
    '/colaborador': ['colaborador', 'admin'],
    '/projects/create': ['institucion', 'admin'],
    '/profile': ['institucion', 'colaborador', 'admin']
  };

  const requiredRoles = routePermissions[route] || [];

  let canAccess = false;

  authStore.subscribe((state) => {
    canAccess =
      requiredRoles.length === 0 ||
      (state.user && requiredRoles.includes(state.user.role)) ||
      false;
  })();

  return canAccess;
}