import type { Proyecto } from '$lib/types/Proyecto';
import type { Categoria } from '$lib/types/Categoria';
import type { Colaboracion } from '$lib/types/Colaboracion';
import { mockUsuarios } from '$lib/mocks/mock-usuarios';
import { mockLocalidades } from '$lib/mocks/mock-localidades';
import { mockCategorias } from '$lib/mocks/mock-categorias';
import { mockColaboraciones } from '$lib/mocks/mock-colaboraciones';

// ---------- Helpers ----------
// TODO: considerar pasarlos a utils

const isDefined = <T>(x: T | null | undefined): x is T => x != null;

const categoriasPorId = (ids: number[] = []): Categoria[] =>
  ids.map((id) => mockCategorias.find((c) => c.id_categoria === id)).filter(isDefined);

const colaboracionesPorId = (ids: number[] = []): Colaboracion[] =>
  ids.map((id) => mockColaboraciones.find((c) => c.id_colaboracion === id)).filter(isDefined);

const proyectosBase: Proyecto[] = [
  {
    id_proyecto: 1,
    titulo: 'Un libro, un sueño',
    descripcion: 'Campaña para recolectar libros infantiles y donarlos a niños de bajos recursos.',
    url_portada: '/img/proyectos-1.webp',
    created_at: new Date('2025-03-01'),
    fecha_cierre_postulaciones: new Date('2025-08-01'),
    fecha_fin_tentativa: new Date('2025-10-01'),
    modalidad: 'presencial',
    id_chat_firebase: 1001,
    participacion_permitida_ids: [1, 2],
    categoria_ids: [2, 7],
    colaboracion_ids: [1, 2],
    institucion_id: 2,
    direccion_id: 1,
    evidencia_ids: [1],
    solicitud_finalizacion_ids: [1],
    estado: "en_curso",
    participacion_permitida: [
      {
        id_proyecto: 1,
        id_tipo_participacion: 1,
        unidad: 'personas',
        objetivo: 20,
        actual: 12,
        tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Voluntariado' }
      },
      {
        id_proyecto: 1,
        id_tipo_participacion: 2,
        unidad: 'libros',
        objetivo: 200,
        actual: 150,
        tipo_participacion: { id_tipo_participacion: 2, descripcion: 'Especie' }
      }
    ],
    institucion: mockUsuarios.escuela_esperanza,
    direccion: {
      id_direccion: 1,
      calle: 'San Martín',
      numero: '456',
      piso: '1',
      departamento: 'A',
      referencia: 'Frente a la plaza principal',
      url_google_maps: 'https://maps.google.com/?q=San+Martín+456',
      localidad_id: mockLocalidades[3].id_localidad,
      localidad: mockLocalidades[3]
    },
    evidencias: [
      {
        id_evidencia: 1,
        descripcion: 'Fotos de la entrega de libros',
        created_at: new Date('2025-06-02'),
        archivos: [],
        solicitudes_finalizacion: []
      }
    ],
    solicitudes_finalizacion: [
      {
        id_solicitud: 1,
        descripcion: 'Proyecto completado con éxito',
        created_at: new Date('2025-06-03'),
        evidencia_ids: [1],
        evidencias: []
      }
    ]
  },
  {
    id_proyecto: 2,
    titulo: 'Comedores con alma',
    descripcion: 'Red de comedores comunitarios para brindar alimentos a familias vulnerables.',
    url_portada: '/img/proyectos-2.webp',
    created_at: new Date('2025-02-10'),
    fecha_cierre_postulaciones: new Date('2025-03-10'),
    fecha_fin_tentativa: new Date('2025-05-10'),
    modalidad: 'presencial',
    id_chat_firebase: 1002,
    participacion_permitida_ids: [1],
    categoria_ids: [1],
    colaboracion_ids: [3],
    institucion_id: 2,
    direccion_id: 2,
    evidencia_ids: [2],
    solicitud_finalizacion_ids: [2],
    estado: "en_curso",
    participacion_permitida: [
      {
        id_proyecto: 2,
        id_tipo_participacion: 1,
        unidad: 'personas',
        objetivo: 30,
        actual: 18,
        tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Voluntariado' }
      },
      {
        id_proyecto: 2,
        id_tipo_participacion: 2,
        unidad: 'platos',
        objetivo: 1000,
        actual: 700,
        tipo_participacion: { id_tipo_participacion: 2, descripcion: 'Especie' }
      }
    ],
    institucion: mockUsuarios.comedor_los_pinos,
    direccion: {
      id_direccion: 2,
      calle: 'Calle 8',
      numero: '456',
      referencia: 'Barrio Norte',
      url_google_maps: 'https://maps.google.com/?q=Calle+8+456',
      localidad_id: mockLocalidades[1].id_localidad,
      localidad: mockLocalidades[1]
    },
    evidencias: [
      {
        id_evidencia: 2,
        descripcion: 'Registro fotográfico de la entrega de alimentos',
        created_at: new Date('2025-05-11'),
        archivos: [],
        solicitudes_finalizacion: []
      }
    ],
    solicitudes_finalizacion: [
      {
        id_solicitud: 2,
        descripcion: 'Cierre exitoso de la campaña',
        created_at: new Date('2025-05-12'),
        evidencia_ids: [2],
        evidencias: []
      }
    ]
  },
  {
    id_proyecto: 3,
    titulo: 'Hogar de sonrisas',
    descripcion: 'Acompañamiento y contención a niños en situación de vulnerabilidad.',
    url_portada: '/img/proyectos-3.webp',
    created_at: new Date('2025-01-20'),
    fecha_cierre_postulaciones: new Date('2025-02-20'),
    fecha_fin_tentativa: new Date('2025-04-20'),
    modalidad: 'presencial',
    id_chat_firebase: 1003,
    participacion_permitida_ids: [2],
    categoria_ids: [3],
    colaboracion_ids: [4],
    institucion_id: 3,
    direccion_id: 3,
    evidencia_ids: [3],
    solicitud_finalizacion_ids: [3],
    estado: "en_revision",
    participacion_permitida: [
      {
        id_proyecto: 3,
        id_tipo_participacion: 1,
        unidad: 'personas',
        objetivo: 10,
        actual: 7,
        tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Voluntariado' }
      }
    ],
    institucion: mockUsuarios.fundacion_siempre,
    direccion: {
      id_direccion: 3,
      calle: 'Av. Belgrano',
      numero: '123',
      referencia: 'Frente a la plaza central',
      url_google_maps: 'https://maps.google.com/?q=Av+Belgrano+123',
      localidad_id: mockLocalidades[0].id_localidad,
      localidad: mockLocalidades[0]
    },
    evidencias: [
      {
        id_evidencia: 3,
        descripcion: 'Testimonios y fotos de los niños beneficiados',
        created_at: new Date('2025-04-21'),
        archivos: [],
        solicitudes_finalizacion: []
      }
    ],
    solicitudes_finalizacion: [
      {
        id_solicitud: 3,
        descripcion: 'Proyecto cerrado con éxito',
        created_at: new Date('2025-04-22'),
        evidencia_ids: [3],
        evidencias: []
      }
    ]
  },
  {
    id_proyecto: 4,
    titulo: 'Equipamiento Médico Hospitalario',
    descripcion:
      'Adquisición de equipamiento médico para mejorar la atención en hospitales públicos.',
    url_portada: '/img/proyectos-4.webp',
    created_at: new Date('2025-04-01'),
    fecha_cierre_postulaciones: new Date('2025-05-01'),
    fecha_fin_tentativa: new Date('2025-07-01'),
    modalidad: 'presencial',
    id_chat_firebase: 1004,
    participacion_permitida_ids: [1, 3],
    categoria_ids: [3],
    colaboracion_ids: [5],
    institucion_id: 4,
    direccion_id: 4,
    evidencia_ids: [4],
    solicitud_finalizacion_ids: [4],
    estado: "en_auditoria",
    participacion_permitida: [
      {
        id_proyecto: 4,
        id_tipo_participacion: 1,
        unidad: 'personas',
        objetivo: 8,
        actual: 5,
        tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Voluntariado' }
      },
      {
        id_proyecto: 4,
        id_tipo_participacion: 3,
        unidad: 'ARS',
        objetivo: 500000,
        actual: 320000,
        tipo_participacion: { id_tipo_participacion: 3, descripcion: 'Monetaria' }
      }
    ],
    institucion: mockUsuarios.hospital_sanjose,
    direccion: {
      id_direccion: 4,
      calle: 'Av. San Martín',
      numero: '789',
      referencia: 'Esquina con Av. Rivadavia',
      url_google_maps: 'https://maps.google.com/?q=Av+San+Martin+789',
      localidad_id: mockLocalidades[4].id_localidad,
      localidad: mockLocalidades[4]
    },
    evidencias: [
      {
        id_evidencia: 4,
        descripcion: 'Fotos del equipamiento entregado',
        created_at: new Date('2025-07-02'),
        archivos: [],
        solicitudes_finalizacion: []
      }
    ],
    solicitudes_finalizacion: [
      {
        id_solicitud: 4,
        descripcion: 'Entrega finalizada',
        created_at: new Date('2025-07-03'),
        evidencia_ids: [4],
        evidencias: []
      }
    ]
  },
  {
    id_proyecto: 5,
    titulo: 'Apoyo Escolar Comunitario',
    descripcion: 'Clases de apoyo escolar gratuitas para niños y adolescentes.',
    url_portada: '/img/proyectos-5.webp',
    created_at: new Date('2025-03-15'),
    fecha_cierre_postulaciones: new Date('2025-04-15'),
    fecha_fin_tentativa: new Date('2025-06-15'),
    modalidad: 'presencial',
    id_chat_firebase: 1005,
    participacion_permitida_ids: [1, 2],
    categoria_ids: [2, 4],
    colaboracion_ids: [6],
    institucion_id: 5,
    direccion_id: 5,
    evidencia_ids: [5],
    solicitud_finalizacion_ids: [5],
    estado: "cancelado",
    participacion_permitida: [
      {
        id_proyecto: 5,
        id_tipo_participacion: 1,
        unidad: 'personas',
        objetivo: 25,
        actual: 15,
        tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Voluntariado' }
      },
      {
        id_proyecto: 5,
        id_tipo_participacion: 2,
        unidad: 'cuadernos',
        objetivo: 100,
        actual: 60,
        tipo_participacion: { id_tipo_participacion: 2, descripcion: 'Especie' }
      }
    ],
    institucion: mockUsuarios.instituto_formacion,
    direccion: {
      id_direccion: 5,
      calle: 'Av. Independencia',
      numero: '321',
      referencia: 'Cerca de la estación',
      url_google_maps: 'https://maps.google.com/?q=Av+Independencia+321',
      localidad_id: mockLocalidades[5].id_localidad,
      localidad: mockLocalidades[5]
    },
    evidencias: [
      {
        id_evidencia: 5,
        descripcion: 'Fotos de las clases y testimonios',
        created_at: new Date('2025-06-16'),
        archivos: [],
        solicitudes_finalizacion: []
      }
    ],
    solicitudes_finalizacion: [
      {
        id_solicitud: 5,
        descripcion: 'Finalización del ciclo lectivo',
        created_at: new Date('2025-06-17'),
        evidencia_ids: [5],
        evidencias: []
      }
    ]
  },
  {
    id_proyecto: 6,
    titulo: 'Alimentos No Perecederos',
    descripcion:
      'Campaña de recolección de alimentos no perecederos para familias en situación de emergencia.',
    url_portada: '/img/proyectos-6.webp',
    created_at: new Date('2025-02-25'),
    fecha_cierre_postulaciones: new Date('2025-03-25'),
    fecha_fin_tentativa: new Date('2025-05-25'),
    modalidad: 'presencial',
    id_chat_firebase: 1006,
    participacion_permitida_ids: [1],
    categoria_ids: [1],
    colaboracion_ids: [7],
    institucion_id: 2,
    direccion_id: 6,
    evidencia_ids: [6],
    solicitud_finalizacion_ids: [6],
    estado: "en_curso",
    participacion_permitida: [
      {
        id_proyecto: 6,
        id_tipo_participacion: 1,
        unidad: 'personas',
        objetivo: 40,
        actual: 22,
        tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Voluntariado' }
      },
      {
        id_proyecto: 6,
        id_tipo_participacion: 2,
        unidad: 'alimentos',
        objetivo: 500,
        actual: 320,
        tipo_participacion: { id_tipo_participacion: 2, descripcion: 'Especie' }
      }
    ],
    institucion: mockUsuarios.comedor_los_pinos,
    direccion: {
      id_direccion: 6,
      calle: 'Calle 8',
      numero: '456',
      referencia: 'Barrio Norte',
      url_google_maps: 'https://maps.google.com/?q=Calle+8+456',
      localidad_id: mockLocalidades[1].id_localidad,
      localidad: mockLocalidades[1]
    },
    evidencias: [
      {
        id_evidencia: 6,
        descripcion: 'Fotos de la recolección y entrega',
        created_at: new Date('2025-05-26'),
        archivos: [],
        solicitudes_finalizacion: []
      }
    ],
    solicitudes_finalizacion: [
      {
        id_solicitud: 6,
        descripcion: 'Campaña finalizada',
        created_at: new Date('2025-05-27'),
        evidencia_ids: [6],
        evidencias: []
      }
    ]
  },
  {
    id_proyecto: 7,
    titulo: 'Ropa de Abrigo Invernal',
    descripcion: 'Donación y distribución de ropa de abrigo para personas en situación de calle.',
    url_portada: '/img/proyectos-7.webp',
    created_at: new Date('2025-05-01'),
    fecha_cierre_postulaciones: new Date('2025-06-01'),
    fecha_fin_tentativa: new Date('2025-08-01'),
    modalidad: 'presencial',
    id_chat_firebase: 1007,
    participacion_permitida_ids: [1, 2],
    categoria_ids: [6],
    colaboracion_ids: [8],
    institucion_id: 6,
    direccion_id: 7,
    evidencia_ids: [7],
    solicitud_finalizacion_ids: [7],
    estado: "en_curso",
    participacion_permitida: [
      {
        id_proyecto: 7,
        id_tipo_participacion: 1,
        unidad: 'personas',
        objetivo: 12,
        actual: 8,
        tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Voluntariado' }
      },
      {
        id_proyecto: 7,
        id_tipo_participacion: 2,
        unidad: 'prendas',
        objetivo: 200,
        actual: 120,
        tipo_participacion: { id_tipo_participacion: 2, descripcion: 'Especie' }
      }
    ],
    institucion: mockUsuarios.fundacion_calor,
    direccion: {
      id_direccion: 7,
      calle: 'Av. Mitre',
      numero: '654',
      referencia: 'A metros del hospital',
      url_google_maps: 'https://maps.google.com/?q=Av+Mitre+654',
      localidad_id: mockLocalidades[6].id_localidad,
      localidad: mockLocalidades[6]
    },
    evidencias: [
      {
        id_evidencia: 7,
        descripcion: 'Fotos de la entrega de ropa',
        created_at: new Date('2025-08-02'),
        archivos: [],
        solicitudes_finalizacion: []
      }
    ],
    solicitudes_finalizacion: [
      {
        id_solicitud: 7,
        descripcion: 'Campaña de abrigo finalizada',
        created_at: new Date('2025-08-03'),
        evidencia_ids: [7],
        evidencias: []
      }
    ]
  },
  {
    id_proyecto: 8,
    titulo: 'Cuidadores de Adultos Mayores',
    descripcion: 'Capacitación y acompañamiento a cuidadores de adultos mayores.',
    url_portada: '/img/proyectos-8.webp',
    created_at: new Date('2025-04-10'),
    fecha_cierre_postulaciones: new Date('2025-05-10'),
    fecha_fin_tentativa: new Date('2025-07-10'),
    modalidad: 'presencial',
    id_chat_firebase: 1008,
    participacion_permitida_ids: [3],
    categoria_ids: [7],
    colaboracion_ids: [9],
    institucion_id: 7,
    direccion_id: 8,
    evidencia_ids: [8],
    solicitud_finalizacion_ids: [8],
    estado: "completado",
    participacion_permitida: [
      {
        id_proyecto: 8,
        id_tipo_participacion: 1,
        unidad: 'personas',
        objetivo: 10,
        actual: 5,
        tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Voluntariado' }
      },
      {
        id_proyecto: 8,
        id_tipo_participacion: 3,
        unidad: 'ARS',
        objetivo: 100000,
        actual: 40000,
        tipo_participacion: { id_tipo_participacion: 3, descripcion: 'Monetaria' }
      }
    ],
    institucion: mockUsuarios.hogar_santa_teresa,
    direccion: {
      id_direccion: 8,
      calle: 'Calle 25',
      numero: '789',
      referencia: 'Barrio Sur',
      url_google_maps: 'https://maps.google.com/?q=Calle+25+789',
      localidad_id: mockLocalidades[7].id_localidad,
      localidad: mockLocalidades[7]
    },
    evidencias: [
      {
        id_evidencia: 8,
        descripcion: 'Fotos de las capacitaciones',
        created_at: new Date('2025-07-11'),
        archivos: [],
        solicitudes_finalizacion: []
      }
    ],
    solicitudes_finalizacion: [
      {
        id_solicitud: 8,
        descripcion: 'Cierre de ciclo de formación',
        created_at: new Date('2025-07-12'),
        evidencia_ids: [8],
        evidencias: []
      }
    ]
  }
];

export const mockProyectos: Proyecto[] = proyectosBase.map((proyecto) => ({
  ...proyecto,
  categorias: categoriasPorId(proyecto.categoria_ids ?? []),
  colaboraciones: colaboracionesPorId(proyecto.colaboracion_ids ?? [])
}));