// Tipos de usuario en el sistema
export type UserRole = 'institucion' | 'colaborador' | 'admin';

// Tipo de colaborador
export type CollaboratorType = 'empresa' | 'persona' | 'ong';

// Estado de verificación
export type VerificationStatus = 'pendiente' | 'verificado' | 'rechazado';

// Modelo base de usuario
export interface BaseUser {
  id: string;
  email: string;
  nombre: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  verificationStatus: VerificationStatus;
  profile?: string; // URL de la foto de perfil
}

// Usuario tipo Institución (crea proyectos)
export interface InstitucionUser extends BaseUser {
  role: 'institucion';
  // Información específica de la institución
  razonSocial: string;
  cuit?: string;
  telefono: string;
  direccion: {
    calle: string;
    numero: string;
    ciudad: string;
    provincia: string;
    codigoPostal: string;
  };
  descripcion: string;
  sitioWeb?: string;
  // Campos específicos para instituciones
  tipoInstitucion: 'escuela' | 'hospital' | 'ong' | 'fundacion' | 'otro';
  capacidadBeneficiarios: number;
  proyectosCreados: string[]; // IDs de proyectos
}

// Usuario tipo Colaborador (donantes/voluntarios)
export interface ColaboradorUser extends BaseUser {
  role: 'colaborador';
  // Información específica del colaborador
  tipoColaborador: CollaboratorType;
  telefono: string;
  direccion?: {
    calle: string;
    numero: string;
    ciudad: string;
    provincia: string;
    codigoPostal: string;
  };
  // Campos específicos según el tipo
  empresa?: {
    razonSocial: string;
    cuit: string;
    rubro: string;
    empleados: number;
  };
  persona?: {
    dni: string;
    fechaNacimiento: Date;
    genero: 'masculino' | 'femenino' | 'otro';
  };
  ong?: {
    razonSocial: string;
    cuit: string;
    mision: string;
    añoFundacion: number;
  };
  // Historial de colaboraciones
  colaboraciones: string[]; // IDs de colaboraciones
  preferencias: {
    categorias: string[];
    provincias: string[];
    notificaciones: boolean;
  };
}

// Usuario tipo Admin (superusuario)
export interface AdminUser extends BaseUser {
  role: 'admin';
  // Permisos específicos del admin
  permisos: {
    gestionarUsuarios: boolean;
    gestionarProyectos: boolean;
    gestionarInstituciones: boolean;
    verReportes: boolean;
    gestionarSistema: boolean;
  };
  // Información de contacto
  telefono: string;
  departamento: string;
}

// Union type para todos los usuarios
export type User = InstitucionUser | ColaboradorUser | AdminUser;

// DTOs para formularios
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterInstitucionData {
  email: string;
  password: string;
  nombre: string;
  razonSocial: string;
  cuit?: string;
  telefono: string;
  direccion: {
    calle: string;
    numero: string;
    ciudad: string;
    provincia: string;
    codigoPostal: string;
  };
  descripcion: string;
  sitioWeb?: string;
  tipoInstitucion: 'escuela' | 'hospital' | 'ong' | 'fundacion' | 'otro';
  capacidadBeneficiarios: number;
}

export interface RegisterColaboradorData {
  email: string;
  password: string;
  nombre: string;
  tipoColaborador: CollaboratorType;
  telefono: string;
  direccion?: {
    calle: string;
    numero: string;
    ciudad: string;
    provincia: string;
    codigoPostal: string;
  };
  // Campos específicos según tipo
  empresa?: {
    razonSocial: string;
    cuit: string;
    rubro: string;
    empleados: number;
  };
  persona?: {
    dni: string;
    fechaNacimiento: Date;
    genero: 'masculino' | 'femenino' | 'otro';
  };
  ong?: {
    razonSocial: string;
    cuit: string;
    mision: string;
    añoFundacion: number;
  };
  preferencias: {
    categorias: string[];
    provincias: string[];
    notificaciones: boolean;
  };
} 