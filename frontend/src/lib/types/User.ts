// TODO: revisar para asegurar que todo esté correcto y completo, traducir al inglés

// Tipos de usuario en el sistema
export type UserRole = 'institucion' | 'colaborador' | 'admin';

// Tipo de colaborador
export type CollaboratorType = 'empresa' | 'persona' | 'ong'; // ? ¿Empresa u ONG o directamente con o sin fines de lucro? Yo distinguiría organización y unipersonal, y de organización con o sin fines de lucro

// Estado de verificación
export type VerificationStatus = 'pendiente' | 'verificado' | 'rechazado'; // ? ¿Pendiente lo mantenemos o directamente no se crearía el usuario?

// Modelo base de usuario
export interface BaseUser {
  id?: string;
  username?: string;
  email: string;
  nombre: string; // ? ¿Distinguimos nombre y apellido o directamente nombre completo?
  // ---------------------------------------------------
  // * Representante legal (o persona)
  tipoDocumento?: string; // * Faltaba este atributo
  numeroDocumento?: string;  // * Faltaba este atributo
  fechaNacimiento?: Date;  // * Faltaba este atributo
  // ---------------------------------------------------
  role: UserRole;
  isActive: boolean; // ? ¿Esto sería el estado?
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date; // ! Esto probablemente lo registra Firebase
  verificationStatus: VerificationStatus;
  profile?: string; // URL de la foto de perfil
}

// Usuario tipo Institución (crea proyectos)
export interface InstitucionUser extends BaseUser {
  role: 'institucion';
  // Información específica de la institución
  cuit?: string;
  razonSocial: string; // ? ¿Razón social y nombre legal son lo mismo?
  telefono: string; // ! Esto sería contacto de BaseUser
  direccion: { // ! Dirección es de BaseUser
    calle: string;
    numero: string;
    ciudad: string;
    provincia: string;
    codigoPostal: string;
  };
  descripcion: string;
  sitioWeb?: string;
  // Campos específicos para instituciones
  tipoInstitucion: 'escuela' | 'hospital' | 'ong' | 'fundacion' | 'otro'; // * Esto sería directamente un string pero que la interfaz muestre un select con algunas opciones
  capacidadBeneficiarios: number; // ! Esto lo sacaría
  proyectosCreados: string[]; // IDs de proyectos
  resenia?: string; // TODO: corregir esto para que sea una interfaz aparte
}

// Usuario tipo Colaborador (donantes/voluntarios)
export interface ColaboradorUser extends BaseUser {
  role: 'colaborador';
  // Información específica del colaborador
  tipoColaborador: CollaboratorType;
  telefono: string; // ! Esto sería contacto de BaseUser
  direccion?: { // ! Dirección es de BaseUser
    calle: string;
    numero: string;
    ciudad: string;
    provincia: string;
    codigoPostal: string;
  };
  // Campos específicos según el tipo
  empresa?: { // * Con fines de lucro
    razonSocial: string;
    cuit: string;
    rubro: string; // ? ¿Rubro es necesario? ¿No sería mejor un campo de descripción en BaseUser?
    empleados: number; // ! Esto lo sacaría
  };
  persona?: { // * Unipersonal
    dni: string; // ! Esto lo sacaría, el documento ya es de BaseUser
    fechaNacimiento: Date; // ! Esto lo sacaría, la fecha de nacimiento ya es de BaseUser
    genero: 'masculino' | 'femenino' | 'otro'; // ? ¿Mantenemos género? ¿No sería mejor en BaseUser?
  };
  ong?: { // * Sin fines de lucro
    razonSocial: string;
    cuit: string;
    mision: string; // ? ¿Misión es necesario? ¿No sería mejor un campo de descripción en BaseUser?
    añoFundacion: number; // * Me gustó, ¿se mantiene?
  };
  // Historial de colaboraciones
  colaboraciones: string[]; // IDs de colaboraciones
  preferencias: {
    categorias: string[];
    provincias: string[]; // ? ¿Acá no sería tipoParticipacion?
    notificaciones: boolean;
  };
}

// Usuario tipo Admin (superusuario)
export interface AdminUser extends BaseUser {
  role: 'admin';
  // Permisos específicos del admin
  permisos: { // ? ¿Se mantiene? ¿No se supone que puede hacer todo?
    gestionarUsuarios: boolean;
    gestionarProyectos: boolean;
    gestionarInstituciones: boolean;
    verReportes: boolean;
    gestionarSistema: boolean;
  };
  // Información de contacto // ! Esto sería contacto de BaseUser
  telefono: string;
  departamento: string; // ? ¿Departamento es necesario? ¿No sería mejor un campo de descripción en BaseUser?
}

// Union type para todos los usuarios
export type User = InstitucionUser | ColaboradorUser | AdminUser;

// DTOs para formularios
export interface LoginCredentials {
  email: string; // * Acá podría ser email o username
  password: string;
  rememberMe?: boolean;
}

// TODO: revisar que coincida con sign in
export interface RegisterInstitucionData {
  email: string;
  password: string; // ! Acá hay que ver cómo se maneja la contraseña
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