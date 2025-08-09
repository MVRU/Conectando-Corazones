// FIX: corregir todo esto para que coincida con DER

// Tipos de usuario en el sistema
export type UserRole = 'institucion' | 'colaborador' | 'admin';

// Tipo de colaborador
export type CollaboratorType = 'empresa' | 'persona' | 'ong';

// Estado de verificación
// FIX: dijimos que no vamos a almacenar el estado de verificación ya que si se crea el usuario se asume que está verificado
export type VerificationStatus = 'pendiente' | 'verificado' | 'rechazado';

// Modelo base de usuario
export interface BaseUser {  // FIX: ¿username?
  id: string;
  email: string;
  nombre: string; // FIX: ¿apellido se va? ¿es nombre completo entonces?
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date; // FIX: este atributo no fue discutido y para esto está el historial de cambios, aunque se puede considerar
  lastLogin?: Date; // FIX: este atributo no fue discutido y no entiendo para qué es relevante
  verificationStatus: VerificationStatus; // FIX: dijimos que no vamos a almacenar el estado de verificación
  profile?: string; // URL de la foto de perfil
}

// Usuario tipo Institución (crea proyectos)
export interface InstitucionUser extends BaseUser {
  role: 'institucion';
  // Información específica de la institución
  razonSocial: string; // FIX: difiere del DER
  cuit?: string;
  telefono: string; // FIX: difiere del DER
  direccion: { // FIX: difiere del DER
    calle: string;
    numero: string;
    ciudad: string;
    provincia: string;
    codigoPostal: string;
  };
  descripcion: string; // FIX: atributo inventado
  sitioWeb?: string; // FIX: difiere del DER
  // Campos específicos para instituciones
  tipoInstitucion: 'escuela' | 'hospital' | 'ong' | 'fundacion' | 'otro'; // ? ¿Una ONG puede ser una institución?
  capacidadBeneficiarios: number; // FIX: atributo inventado
  proyectosCreados: string[]; // IDs de proyectos
}

// Usuario tipo Colaborador (donantes/voluntarios)
export interface ColaboradorUser extends BaseUser {
  role: 'colaborador';
  // Información específica del colaborador
  tipoColaborador: CollaboratorType;
  telefono: string; // FIX: difiere del DER
  direccion?: { // FIX: difiere del DER y no tiene sentido
    calle: string;
    numero: string;
    ciudad: string;
    provincia: string;
    codigoPostal: string;
  };
  // Campos específicos según el tipo
  empresa?: { // FIX: difiere del DER ¿Organización? ¿con_fines_de_lucro?
    razonSocial: string;
    cuit: string;
    rubro: string; // FIX: atributo inventado
    empleados: number; // FIX: atributo inventado
  };
  persona?: { // FIX: difiere del DER 
    dni: string; // FIX: difiere del DER
    fechaNacimiento: Date; // FIX: difiere del DER
    genero: 'masculino' | 'femenino' | 'otro'; // FIX: atributo inventado
  };
  ong?: { // FIX: difiere del DER ¿Organización?
    razonSocial: string;
    cuit: string;
    mision: string; // FIX: atributo inventado
    añoFundacion: number; // FIX: atributo inventado
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
  // FIX: habíamos dicho que los admins pueden hacer todo
  permisos: {
    gestionarUsuarios: boolean;
    gestionarProyectos: boolean;
    gestionarInstituciones: boolean;
    verReportes: boolean;
    gestionarSistema: boolean;
  };
  // Información de contacto
  telefono: string; // FIX: difiere del DER
  departamento: string; // FIX: atributo inventado
}

// Union type para todos los usuarios
export type User = InstitucionUser | ColaboradorUser | AdminUser;

// DTOs para formularios
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterInstitucionData { // FIX: esta interfaz no tiene sentido y no tiene implementaciones
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

export interface RegisterColaboradorData { // FIX: esta interfaz no tiene sentido y no tiene implementaciones
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