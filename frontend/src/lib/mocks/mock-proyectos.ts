import type { Proyecto } from '$lib/types/Proyecto';
import type { ProyectoUbicacion } from '$lib/types/ProyectoUbicacion';
import type { Institucion } from '$lib/types/Usuario';
import { mockUsuarios } from '$lib/mocks/mock-usuarios';
import { mockProyectoCategorias } from '$lib/mocks/mock-proyecto-categorias';
import { mockColaboraciones } from '$lib/mocks/mock-colaboraciones';
import { mockProyectoUbicaciones } from '$lib/mocks/mock-proyecto-ubicaciones';

// ---------- Helpers ----------
// TODO: considerar pasarlos a utils

const isDefined = <T>(x: T | null | undefined): x is T => x != null;

const elementosPorId = <T, K extends keyof T>(ids: number[] = [], elementos: T[], clave: K): T[] =>
	ids.map((id) => elementos.find((e) => e[clave] === id)).filter(isDefined);

const categoriasPorProyecto = (id: number) =>
	mockProyectoCategorias
		.filter((pc) => pc.proyecto_id === id)
		.map((pc) => pc.categoria)
		.filter(isDefined);

const colaboracionesPorId = (ids: number[] = []) =>
	elementosPorId(ids, mockColaboraciones, 'id_colaboracion');

const ubicacionesPorProyecto = (id: number): ProyectoUbicacion[] =>
	mockProyectoUbicaciones.filter((u) => u.proyecto_id === id);

// ! Guard para asegurar que el objeto cumple con Institucion
const esInstitucion = (x: unknown): x is Institucion => {
	return !!x && typeof x === 'object' && 'nombre_legal' in x && 'tipo_institucion' in x;
};

const proyectosBase: Proyecto[] = [
	{
		id_proyecto: 1,
		titulo: 'Un libro, un sueño',
		beneficiarios: 50,
		descripcion: 'Campaña para recolectar libros infantiles y donarlos a niños de bajos recursos.',
		resumen: 'Reunimos libros para nutrir bibliotecas barriales.',
		aprendizajes: 'Aprendimos a coordinar puntos de acopio y a conectar voluntarios con escuelas.',
		url_portada: '/img/proyectos-1.webp',
		created_at: new Date('2025-03-01'),
		fecha_cierre_postulaciones: new Date('2025-08-01'),
		fecha_fin_tentativa: new Date('2025-10-01'),
		id_chat_firebase: 1001,
		participacion_permitida_ids: [1, 2],
		colaboracion_ids: [1, 2],
		institucion_id: 2,
		evidencia_ids: [1],
		solicitud_finalizacion_ids: [1],
		estado: 'en_curso',
		participacion_permitida: [
			{
				id_participacion_permitida: 1,
				id_proyecto: 1,
				id_tipo_participacion: 1,
				unidad_medida: 'libros',
				objetivo: 20,
				actual: 12,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
			},
			{
				id_participacion_permitida: 2,
				id_proyecto: 1,
				id_tipo_participacion: 1,
				unidad_medida: 'docentes',
				objetivo: 10,
				actual: 2,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Voluntariado' }
			}
		]
	},
	{
		id_proyecto: 2,
		titulo: 'Comedores con alma',
		descripcion: 'Red de comedores comunitarios para brindar alimentos a familias vulnerables.',
		resumen: 'Fortalecemos comedores comunitarios con donaciones organizadas.',
		aprendizajes: 'Mejoramos la cadena de donaciones y el compromiso de voluntarios locales.',
		url_portada: '/img/proyectos-2.webp',
		created_at: new Date('2025-06-10'),
		fecha_cierre_postulaciones: new Date('2025-06-25'),
		fecha_fin_tentativa: new Date('2025-10-10'),
		id_chat_firebase: 1002,
		participacion_permitida_ids: [1, 2],
		colaboracion_ids: [3],
		institucion_id: 11,
		evidencia_ids: [2],
		solicitud_finalizacion_ids: [2],
		estado: 'en_curso',
		participacion_permitida: [
			{
				id_participacion_permitida: 1,
				id_proyecto: 2,
				id_tipo_participacion: 1,
				unidad_medida: 'personas',
				objetivo: 30,
				actual: 18,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Voluntariado' }
			},
			{
				id_participacion_permitida: 2,
				id_proyecto: 2,
				id_tipo_participacion: 2,
				unidad_medida: 'kg de harina',
				objetivo: 10,
				actual: 15,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
			},
			{
				id_participacion_permitida: 3,
				id_proyecto: 2,
				id_tipo_participacion: 3,
				unidad_medida: 'docenas de huevos',
				objetivo: 6,
				actual: 3,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
			}
		]
	},
	{
		id_proyecto: 3,
		titulo: 'Hogar de sonrisas',
		descripcion: 'Acompañamiento y contención a niños en situación de vulnerabilidad.',
		resumen: 'Acompañamos niños con actividades recreativas y contencion.',
		aprendizajes: 'Trabajamos en protocolos de cuidado junto a las familias.',
		url_portada: '/img/proyectos-3.webp',
		created_at: new Date('2025-01-20'),
		fecha_cierre_postulaciones: new Date('2025-02-20'),
		fecha_fin_tentativa: new Date('2025-04-20'),
		id_chat_firebase: 1003,
		participacion_permitida_ids: [1],
		colaboracion_ids: [4],
		institucion_id: 3,
		evidencia_ids: [3],
		solicitud_finalizacion_ids: [3],
		estado: 'en_revision',
		participacion_permitida: [
			{
				id_participacion_permitida: 3,
				id_proyecto: 3,
				id_tipo_participacion: 1,
				unidad_medida: 'personas',
				objetivo: 10,
				actual: 7,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Voluntariado' }
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
		id_chat_firebase: 1004,
		participacion_permitida_ids: [1, 3],
		colaboracion_ids: [5],
		institucion_id: 9,
		evidencia_ids: [4],
		solicitud_finalizacion_ids: [4],
		estado: 'en_auditoria',
		participacion_permitida: [
			{
				id_participacion_permitida: 4,
				id_proyecto: 4,
				id_tipo_participacion: 1,
				unidad_medida: 'ARS',
				objetivo: 500000,
				actual: 100000,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Monetaria' }
			}
		]
	},
	{
		id_proyecto: 5,
		titulo: 'Apoyo Escolar Comunitario',
		descripcion: 'Clases de apoyo escolar gratuitas para niños y adolescentes.',
		resumen: 'Convertimos terrenos urbanos en huertas comunitarias vivas.',
		aprendizajes: 'Compartimos tecnicas agroecologicas y cultivamos en colectivo.',
		url_portada: '/img/proyectos-5.webp',
		created_at: new Date('2025-03-15'),
		fecha_cierre_postulaciones: new Date('2025-04-15'),
		fecha_fin_tentativa: new Date('2025-06-15'),
		id_chat_firebase: 1005,
		participacion_permitida_ids: [1, 2],
		colaboracion_ids: [6],
		institucion_id: 2,
		evidencia_ids: [5],
		solicitud_finalizacion_ids: [5],
		estado: 'cancelado',
		participacion_permitida: [
			{
				id_participacion_permitida: 5,
				id_proyecto: 5,
				id_tipo_participacion: 1,
				unidad_medida: 'personas',
				objetivo: 25,
				actual: 15,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Voluntariado' }
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
		id_chat_firebase: 1006,
		participacion_permitida_ids: [1, 2],
		colaboracion_ids: [7],
		institucion_id: 11,
		evidencia_ids: [6],
		solicitud_finalizacion_ids: [6],
		estado: 'en_curso',
		participacion_permitida: [
			{
				id_participacion_permitida: 6,
				id_proyecto: 6,
				id_tipo_participacion: 1,
				unidad_medida: 'personas',
				objetivo: 40,
				actual: 22,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Voluntariado' }
			}
		]
	},
	{
		id_proyecto: 7,
		titulo: 'Ropa de Abrigo Invernal',
		descripcion: 'Donación y distribución de ropa de abrigo para personas en situación de calle.',
		resumen: 'Distribuimos ropa termica para personas en situacion de calle.',
		aprendizajes: 'Fortalecimos la red de voluntarios y aprendimos a mantener inventarios rotativos.',
		url_portada: '/img/proyectos-7.webp',
		created_at: new Date('2025-05-01'),
		fecha_cierre_postulaciones: new Date('2025-06-01'),
		fecha_fin_tentativa: new Date('2025-08-01'),
		id_chat_firebase: 1007,
		participacion_permitida_ids: [1, 2],
		colaboracion_ids: [8],
		institucion_id: 14,
		evidencia_ids: [7],
		solicitud_finalizacion_ids: [7],
		estado: 'en_curso',
		participacion_permitida: [
			{
				id_participacion_permitida: 7,
				id_proyecto: 7,
				id_tipo_participacion: 1,
				unidad_medida: 'abrigos',
				objetivo: 50,
				actual: 8,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
			}
		]
	},
	{
		id_proyecto: 8,
		titulo: 'Cuidadores de Adultos Mayores',
		descripcion: 'Capacitación y acompañamiento a cuidadores de adultos mayores.',
		resumen: 'Capacitamos cuidadores de adultos mayores y articulamos redes.',
		aprendizajes: 'Profundizamos en el cuidado domiciliario y la comunicacion con las familias.',
		fecha_cierre_postulaciones: new Date('2025-05-10'),
		fecha_fin_tentativa: new Date('2025-07-10'),
		id_chat_firebase: 1008,
		participacion_permitida_ids: [1, 3],
		colaboracion_ids: [9],
		institucion_id: 15,
		evidencia_ids: [8],
		solicitud_finalizacion_ids: [8],
		estado: 'completado',
		participacion_permitida: [
			{
				id_participacion_permitida: 8,
				id_proyecto: 8,
				id_tipo_participacion: 1,
				unidad_medida: 'personas',
				objetivo: 10,
				actual: 5,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Voluntariado' }
			}
		]
	},
	{
		id_proyecto: 9,
		titulo: 'Biblioteca Digital Comunitaria',
		descripcion: 'Proyecto completado de creación de una biblioteca digital con acceso libre para la comunidad educativa.',
		url_portada: '/img/proyectos-9.webp',
		created_at: new Date('2024-08-15'),
		fecha_cierre_postulaciones: new Date('2024-09-15'),
		fecha_fin_tentativa: new Date('2024-12-15'),
		id_chat_firebase: 1009,
		participacion_permitida_ids: [1, 2],
		colaboracion_ids: [10],
		institucion_id: 2,
		evidencia_ids: [9],
		solicitud_finalizacion_ids: [9],
		estado: 'completado',
		participacion_permitida: [
			{
				id_participacion_permitida: 9,
				id_proyecto: 9,
				id_tipo_participacion: 1,
				unidad_medida: 'libros',
				objetivo: 500,
				actual: 500,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
			},
			{
				id_participacion_permitida: 10,
				id_proyecto: 9,
				id_tipo_participacion: 2,
				unidad_medida: 'pesos',
				objetivo: 50000,
				actual: 50000,
				tipo_participacion: { id_tipo_participacion: 2, descripcion: 'Monetaria' }
			}
		]
	}
];

export const mockProyectos: Proyecto[] = proyectosBase.map((proyecto) => {
	const posibleInstitucion = Object.values(mockUsuarios).find(
		(u) => u.id_usuario === proyecto.institucion_id
	);

	// ! Solo asignamos si realmente es una Institución; si no, queda undefined
	const institucion: Institucion | undefined = esInstitucion(posibleInstitucion)
		? posibleInstitucion
		: undefined;

	return {
		...proyecto,
		categorias: categoriasPorProyecto(proyecto.id_proyecto ?? 0),
		colaboraciones: colaboracionesPorId(proyecto.colaboracion_ids ?? []),
		ubicaciones: ubicacionesPorProyecto(proyecto.id_proyecto ?? 0),
		institucion
	};
});
