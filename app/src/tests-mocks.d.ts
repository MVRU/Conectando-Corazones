// Type declarations for test mocks
// This allows TypeScript to recognize imports from $lib/infrastructure/mocks/

declare module '$lib/infrastructure/mocks/mock-usuarios' {
  import type { Usuario, Institucion, Organizacion, Unipersonal, Administrador } from '$lib/domain/types/Usuario';
  export const mockUsuarios: Record<string, Usuario | Institucion | Organizacion | Unipersonal | Administrador>;
}

declare module '$lib/infrastructure/mocks/mock-proyectos' {
  import type { Proyecto } from '$lib/domain/types/Proyecto';
  export const mockProyectos: Proyecto[];
}

declare module '$lib/infrastructure/mocks/mock-colaboraciones' {
  import type { Colaboracion } from '$lib/domain/types/Colaboracion';
  export const mockColaboraciones: Colaboracion[];
}

declare module '$lib/infrastructure/mocks/mock-localidades' {
  import type { Localidad } from '$lib/domain/types/Localidad';
  export const mockLocalidades: Localidad[];
}

declare module '$lib/infrastructure/mocks/mock-categorias' {
  import type { Categoria } from '$lib/domain/types/Categoria';
  export const mockCategorias: Categoria[];
}

declare module '$lib/infrastructure/mocks/mock-reportes' {
  import type { Reporte } from '$lib/domain/types/Reporte';
  export const mockReportes: Reporte[];
}

declare module '$lib/infrastructure/mocks/mock-testimonios' {
  import type { Resena } from '$lib/domain/types/Resena';
  export const mockTestimonios: Resena[];
}

declare module '$lib/infrastructure/mocks/mock-resenas' {
  import type { Resena } from '$lib/domain/types/Resena';
  export const mockResenas: Resena[];
}

declare module '$lib/infrastructure/mocks/mock-verificaciones' {
  import type { Verificacion } from '$lib/domain/types/Verificacion';
  export const mockVerificaciones: Verificacion[];
}

declare module '$lib/infrastructure/mocks/mock-proyecto-categorias' {
  import type { ProyectoCategoria } from '$lib/domain/types/ProyectoCategoria';
  export const mockProyectoCategorias: ProyectoCategoria[];
}

declare module '$lib/infrastructure/mocks/mock-proyecto-ubicaciones' {
  import type { ProyectoUbicacion } from '$lib/domain/types/ProyectoUbicacion';
  export const mockProyectoUbicaciones: ProyectoUbicacion[];
}

declare module '$lib/infrastructure/mocks/mock-ubicaciones' {
  import type { UbicacionDisyuncion } from '$lib/domain/types/Ubicacion';
  export const mockUbicaciones: UbicacionDisyuncion[];
  export const getUbicacion: (id: number) => UbicacionDisyuncion | undefined;
}

declare module '$lib/infrastructure/mocks/mock-colaboracion-tipo-participacion' {
  import type { ColaboracionTipoParticipacion } from '$lib/domain/types/ColaboracionTipoParticipacion';
  export const mockColaboracionTipoParticipacion: ColaboracionTipoParticipacion[];
}
