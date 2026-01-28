import type { Proyecto } from '$lib/domain/types/Proyecto';

export const mockProyectos: Proyecto[] = [
	{
		id_proyecto: 1,
		titulo: 'Un libro, un sueño',
		beneficiarios: 50,
		descripcion: 'Campaña para recolectar libros infantiles y donarlos a niños de bajos recursos.',
		resumen: 'Reunimos libros para nutrir bibliotecas barriales.',
		aprendizajes: 'Aprendimos a coordinar puntos de acopio y a conectar voluntarios con escuelas.',
		url_portada: '/img/proyectos-1.webp',
		created_at: new Date('2025-03-01'),
		updated_at: new Date('2025-03-05'),
		fecha_cierre_postulaciones: new Date('2025-08-01'),
		fecha_fin_tentativa: new Date('2026-01-10'),
		id_chat_firebase: 1001,
		participacion_permitida_ids: [1, 2],
		colaboracion_ids: [1, 2, 25],
		institucion_id: 2,
		solicitud_finalizacion_ids: [1],
		estado: 'en_revision',
		participacion_permitida: [
			{
				id_participacion_permitida: 1,
				id_proyecto: 1,
				id_tipo_participacion: 1,
				unidad_medida: 'unidades',
				especie: 'libros',
				objetivo: 20,
				actual: 12,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
			},
			{
				id_participacion_permitida: 2,
				id_proyecto: 1,
				id_tipo_participacion: 2,
				unidad_medida: 'personas',
				objetivo: 10,
				actual: 2,
				tipo_participacion: { id_tipo_participacion: 2, descripcion: 'Voluntariado' }
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
		participacion_permitida_ids: [3, 4, 5],
		colaboracion_ids: [3],
		institucion_id: 11,
		solicitud_finalizacion_ids: [2],
		estado: 'en_curso',
		participacion_permitida: [
			{
				id_participacion_permitida: 3,
				id_proyecto: 2,
				id_tipo_participacion: 1,
				unidad_medida: 'personas',
				objetivo: 30,
				actual: 18,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Voluntariado' }
			},
			{
				id_participacion_permitida: 4,
				id_proyecto: 2,
				id_tipo_participacion: 2,
				unidad_medida: 'kg',
				especie: 'de harina',
				objetivo: 10,
				actual: 15,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
			},
			{
				id_participacion_permitida: 5,
				id_proyecto: 2,
				id_tipo_participacion: 3,
				unidad_medida: 'docenas',
				especie: 'de huevos',
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
		resumen: 'Acompañamos niños con actividades recreativas y contención.',
		aprendizajes: 'Trabajamos en protocolos de cuidado junto a las familias.',
		url_portada: '/img/proyectos-3.webp',
		created_at: new Date('2025-01-20'),
		fecha_cierre_postulaciones: new Date('2025-02-20'),
		fecha_fin_tentativa: new Date('2025-04-20'),
		id_chat_firebase: 1003,
		participacion_permitida_ids: [6],
		colaboracion_ids: [4, 25],
		institucion_id: 3,
		solicitud_finalizacion_ids: [3],
		estado: 'en_revision',
		participacion_permitida: [
			{
				id_participacion_permitida: 6,
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
		fecha_cierre_postulaciones: new Date('2025-10-01'),
		fecha_fin_tentativa: new Date('2026-02-01'),
		id_chat_firebase: 1004,
		participacion_permitida_ids: [7],
		colaboracion_ids: [5],
		institucion_id: 9,
		solicitud_finalizacion_ids: [4],
		estado: 'en_auditoria',
		participacion_permitida: [
			{
				id_participacion_permitida: 7,
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
		aprendizajes: 'Compartimos técnicas agroecológicas y cultivamos en colectivo.',
		url_portada: '/img/proyectos-5.webp',
		created_at: new Date('2025-03-15'),
		fecha_cierre_postulaciones: new Date('2025-04-15'),
		fecha_fin_tentativa: new Date('2025-06-15'),
		id_chat_firebase: 1005,
		participacion_permitida_ids: [8],
		colaboracion_ids: [6],
		institucion_id: 2,
		solicitud_finalizacion_ids: [5],
		estado: 'cancelado',
		participacion_permitida: [
			{
				id_participacion_permitida: 8,
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
		participacion_permitida_ids: [9],
		colaboracion_ids: [7],
		institucion_id: 11,
		solicitud_finalizacion_ids: [6],
		estado: 'en_curso',
		participacion_permitida: [
			{
				id_participacion_permitida: 9,
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
		aprendizajes:
			'Fortalecimos la red de voluntarios y aprendimos a mantener inventarios rotativos.',
		url_portada: '/img/proyectos-7.webp',
		created_at: new Date('2025-05-01'),
		fecha_cierre_postulaciones: new Date('2025-06-01'),
		fecha_fin_tentativa: new Date('2025-08-01'),
		id_chat_firebase: 1007,
		participacion_permitida_ids: [10],
		colaboracion_ids: [8],
		institucion_id: 14,
		solicitud_finalizacion_ids: [7],
		estado: 'en_curso',
		participacion_permitida: [
			{
				id_participacion_permitida: 10,
				id_proyecto: 7,
				id_tipo_participacion: 1,
				unidad_medida: 'unidades',
				especie: 'abrigo',
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
		aprendizajes: 'Profundizamos en el cuidado domiciliario y la comunicación con las familias.',
		url_portada: '/img/proyectos-8.webp',
		created_at: new Date('2025-04-10'),
		fecha_cierre_postulaciones: new Date('2025-05-10'),
		fecha_fin_tentativa: new Date('2025-07-10'),
		id_chat_firebase: 1008,
		participacion_permitida_ids: [11],
		colaboracion_ids: [9],
		institucion_id: 15,
		solicitud_finalizacion_ids: [8],
		estado: 'completado',
		participacion_permitida: [
			{
				id_participacion_permitida: 11,
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
		descripcion:
			'Proyecto completado de creación de una biblioteca digital con acceso libre para la comunidad educativa.',
		url_portada: '/img/proyectos-9.webp',
		created_at: new Date('2024-08-15'),
		fecha_cierre_postulaciones: new Date('2024-09-15'),
		fecha_fin_tentativa: new Date('2024-12-15'),
		id_chat_firebase: 1009,
		participacion_permitida_ids: [12, 13],
		colaboracion_ids: [10],
		institucion_id: 2,
		solicitud_finalizacion_ids: [9],
		estado: 'completado',
		participacion_permitida: [
			{
				id_participacion_permitida: 12,
				id_proyecto: 9,
				id_tipo_participacion: 1,
				unidad_medida: 'libros',
				objetivo: 500,
				actual: 500,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
			},
			{
				id_participacion_permitida: 13,
				id_proyecto: 9,
				id_tipo_participacion: 2,
				unidad_medida: 'ARS',
				objetivo: 50000,
				actual: 50000,
				tipo_participacion: { id_tipo_participacion: 2, descripcion: 'Monetaria' }
			}
		]
	},
	{
		id_proyecto: 10,
		titulo: 'Huerta Escolar Rosario',
		descripcion:
			'Creación de huertas orgánicas en escuelas públicas de Rosario para comedores escolares. Buscamos enseñar a los chicos sobre soberanía alimentaria y proveer verduras frescas al comedor.',
		resumen: 'Huertas escolares para alimentación saludable y aprendizaje.',
		aprendizajes: 'Los alumnos se involucran activamente en el cuidado de la tierra.',
		url_portada: '/img/proyectos-10.jpg',
		created_at: new Date('2025-08-01'),
		fecha_cierre_postulaciones: new Date('2025-09-01'),
		fecha_fin_tentativa: new Date('2026-03-01'),
		id_chat_firebase: 1010,
		participacion_permitida_ids: [14, 15, 16],
		colaboracion_ids: [],
		institucion_id: 2,
		solicitud_finalizacion_ids: [],
		estado: 'en_revision',
		participacion_permitida: [
			{
				id_participacion_permitida: 14,
				id_proyecto: 10,
				id_tipo_participacion: 1,
				unidad_medida: 'palas',
				objetivo: 15,
				actual: 5,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
			},
			{
				id_participacion_permitida: 15,
				id_proyecto: 10,
				id_tipo_participacion: 1,
				unidad_medida: 'semillas (paquetes)',
				objetivo: 50,
				actual: 20,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
			},
			{
				id_participacion_permitida: 16,
				id_proyecto: 10,
				id_tipo_participacion: 1,
				unidad_medida: 'tutores voluntarios',
				objetivo: 5,
				actual: 1,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Voluntariado' }
			}
		]
	},
	{
		id_proyecto: 11,
		titulo: 'Abrigo para la Puna',
		descripcion:
			'Recolección de ropa de invierno y mantas para comunidades de la Puna Jujeña. Las temperaturas bajan de 0 grados y muchas familias no tienen calefacción.',
		resumen: 'Llevamos abrigo a zonas de alta montaña.',
		aprendizajes: 'La logística es clave para llegar a los parajes más aislados.',
		url_portada: '/img/proyectos-11.jpg',
		created_at: new Date('2025-04-01'),
		fecha_cierre_postulaciones: new Date('2025-05-15'),
		fecha_fin_tentativa: new Date('2025-07-30'),
		id_chat_firebase: 1011,
		participacion_permitida_ids: [17, 18],
		colaboracion_ids: [],
		institucion_id: 6,
		solicitud_finalizacion_ids: [],
		estado: 'completado',
		participacion_permitida: [
			{
				id_participacion_permitida: 17,
				id_proyecto: 11,
				id_tipo_participacion: 1,
				unidad_medida: 'mantas',
				objetivo: 100,
				actual: 100,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
			},
			{
				id_participacion_permitida: 18,
				id_proyecto: 11,
				id_tipo_participacion: 1,
				unidad_medida: 'voluntarios clasificación',
				objetivo: 10,
				actual: 10,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Voluntariado' }
			}
		]
	},
	{
		id_proyecto: 12,
		titulo: 'Alfabetización Digital',
		descripcion:
			'Talleres de uso de celular y computadora para adultos mayores en CABA. Reducimos la brecha digital y la soledad.',
		resumen: 'Inclusión digital para la tercera edad.',
		aprendizajes: 'La paciencia y la práctica constante son fundamentales.',
		url_portada: '/img/proyectos-12.jpg',
		created_at: new Date('2026-01-05'),
		fecha_cierre_postulaciones: new Date('2026-02-01'),
		fecha_fin_tentativa: new Date('2026-06-01'),
		id_chat_firebase: 1012,
		participacion_permitida_ids: [19, 20],
		colaboracion_ids: [],
		institucion_id: 13,
		solicitud_finalizacion_ids: [],
		estado: 'en_curso',
		participacion_permitida: [
			{
				id_participacion_permitida: 19,
				id_proyecto: 12,
				id_tipo_participacion: 1,
				unidad_medida: 'voluntarios',
				objetivo: 5,
				actual: 1,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Voluntariado' }
			},
			{
				id_participacion_permitida: 20,
				id_proyecto: 12,
				id_tipo_participacion: 1,
				unidad_medida: 'notebooks usadas',
				objetivo: 5,
				actual: 0,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
			}
		]
	},
	{
		id_proyecto: 13,
		titulo: 'Reciclaje en el Barrio',
		descripcion:
			'Puntos de reciclaje gestionados por vecinos para reducir basura en Córdoba Capital. Buscamos concientizar y limpiar nuestros espacios comunes.',
		resumen: 'Gestionamos residuos reciclables vecinales.',
		aprendizajes: 'La educación ambiental empieza por el ejemplo cotidiano.',
		url_portada: '/img/proyectos-13.jpg',
		created_at: new Date('2025-09-10'),
		fecha_cierre_postulaciones: new Date('2025-10-10'),
		fecha_fin_tentativa: new Date('2025-12-20'),
		id_chat_firebase: 1013,
		participacion_permitida_ids: [21, 22],
		colaboracion_ids: [],
		institucion_id: 17,
		solicitud_finalizacion_ids: [],
		estado: 'cancelado',
		participacion_permitida: [
			{
				id_participacion_permitida: 21,
				id_proyecto: 13,
				id_tipo_participacion: 1,
				unidad_medida: 'voluntarios',
				objetivo: 20,
				actual: 4,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Voluntariado' }
			},
			{
				id_participacion_permitida: 22,
				id_proyecto: 13,
				id_tipo_participacion: 1,
				unidad_medida: 'contenedores plásticos',
				objetivo: 10,
				actual: 2,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
			}
		]
	},
	{
		id_proyecto: 14,
		titulo: 'Refugio Patitas Felices',
		descripcion:
			'Construcción de caniles nuevos para el refugio de perros en Quilmes. Necesitamos mejorar las condiciones de vida de nuestros 150 animales rescatados.',
		resumen: 'Mejoramos la infraestructura del refugio.',
		aprendizajes: 'El trabajo en equipo permite grandes construcciones con pocos recursos.',
		url_portada: '/img/proyectos-14.jpg',
		created_at: new Date('2025-11-01'),
		fecha_cierre_postulaciones: new Date('2025-12-01'),
		fecha_fin_tentativa: new Date('2026-04-01'),
		id_chat_firebase: 1014,
		participacion_permitida_ids: [23, 24, 25],
		colaboracion_ids: [],
		institucion_id: 16,
		solicitud_finalizacion_ids: [],
		estado: 'en_curso',
		participacion_permitida: [
			{
				id_participacion_permitida: 23,
				id_proyecto: 14,
				id_tipo_participacion: 2,
				unidad_medida: 'ladrillos',
				objetivo: 1000,
				actual: 200,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
			},
			{
				id_participacion_permitida: 24,
				id_proyecto: 14,
				id_tipo_participacion: 1,
				unidad_medida: 'ARS',
				objetivo: 200000,
				actual: 45000,
				tipo_participacion: { id_tipo_participacion: 2, descripcion: 'Monetaria' }
			},
			{
				id_participacion_permitida: 25,
				id_proyecto: 14,
				id_tipo_participacion: 1,
				unidad_medida: 'kg alimento balanceado',
				objetivo: 500,
				actual: 100,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
			}
		]
	},
	{
		id_proyecto: 15,
		titulo: 'Mochilas Solidarias',
		descripcion:
			'Armado de kits escolares completos para inicio de clases en escuelas rurales de Catamarca. Queremos que 50 chicos empiecen el año con todo lo necesario.',
		resumen: 'Kits escolares para igualdad de oportunidades.',
		aprendizajes: 'Cada kit entregado es una sonrisa y una oportunidad de estudiar.',
		url_portada: '/img/proyectos-15.jpg',
		created_at: new Date('2026-01-15'),
		fecha_cierre_postulaciones: new Date('2026-02-15'),
		fecha_fin_tentativa: new Date('2026-03-10'),
		id_chat_firebase: 1015,
		participacion_permitida_ids: [26, 27],
		colaboracion_ids: [],
		institucion_id: 2,
		solicitud_finalizacion_ids: [],
		estado: 'pendiente_solicitud_cierre',
		participacion_permitida: [
			{
				id_participacion_permitida: 26,
				id_proyecto: 15,
				id_tipo_participacion: 1,
				unidad_medida: 'mochilas',
				objetivo: 50,
				actual: 50,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
			},
			{
				id_participacion_permitida: 27,
				id_proyecto: 15,
				id_tipo_participacion: 1,
				unidad_medida: 'sets de útiles escolares',
				objetivo: 50,
				actual: 50,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
			}
		]
	},
	{
		id_proyecto: 16,
		titulo: 'Forestando Futuro',
		descripcion:
			'Plantación de árboles nativos en zonas afectadas por incendios en las sierras. Restauramos el ecosistema con tabaquillos y maitenes.',
		resumen: 'Recuperamos el bosque nativo local.',
		aprendizajes: 'La naturaleza tiene sus tiempos y debemos respetarlos.',
		url_portada: '/img/proyectos-16.jpg',
		created_at: new Date('2025-07-20'),
		fecha_cierre_postulaciones: new Date('2025-08-20'),
		fecha_fin_tentativa: new Date('2025-11-20'),
		id_chat_firebase: 1016,
		participacion_permitida_ids: [28, 29],
		colaboracion_ids: [],
		institucion_id: 17,
		solicitud_finalizacion_ids: [],
		estado: 'completado',
		participacion_permitida: [
			{
				id_participacion_permitida: 28,
				id_proyecto: 16,
				id_tipo_participacion: 1,
				unidad_medida: 'árboles',
				objetivo: 200,
				actual: 215,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
			},
			{
				id_participacion_permitida: 29,
				id_proyecto: 16,
				id_tipo_participacion: 1,
				unidad_medida: 'ARS',
				objetivo: 50000,
				actual: 55000,
				tipo_participacion: { id_tipo_participacion: 2, descripcion: 'Monetaria' }
			}
		]
	},
	{
		id_proyecto: 17,
		titulo: 'Taller de Costura Solidaria',
		descripcion:
			'Enseñanza de costura y confección para mujeres jefas de hogar en Rosario. Empoderamos a través del oficio.',
		resumen: 'Oficio y salida laboral para mujeres.',
		aprendizajes: 'El empoderamiento económico transforma familias enteras.',
		url_portada: '/img/proyectos-17.jpg',
		created_at: new Date('2025-10-05'),
		fecha_cierre_postulaciones: new Date('2025-11-05'),
		fecha_fin_tentativa: new Date('2026-05-05'),
		id_chat_firebase: 1017,
		participacion_permitida_ids: [30, 31, 32],
		colaboracion_ids: [],
		institucion_id: 13,
		solicitud_finalizacion_ids: [],
		estado: 'en_curso',
		participacion_permitida: [
			{
				id_participacion_permitida: 30,
				id_proyecto: 17,
				id_tipo_participacion: 1,
				unidad_medida: 'máquinas de coser',
				objetivo: 3,
				actual: 1,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
			},
			{
				id_participacion_permitida: 31,
				id_proyecto: 17,
				id_tipo_participacion: 1,
				unidad_medida: 'telas (metros)',
				objetivo: 100,
				actual: 30,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
			},
			{
				id_participacion_permitida: 32,
				id_proyecto: 17,
				id_tipo_participacion: 1,
				unidad_medida: 'hilos (bobinas)',
				objetivo: 50,
				actual: 10,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
			}
		]
	},
	{
		id_proyecto: 18,
		titulo: 'Biblioteca Móvil',
		descripcion:
			'Camioneta equipada con libros que recorre barrios periféricos fomentando la lectura. Llevamos mundos de fantasía a quienes no pueden acceder a una biblioteca.',
		resumen: 'Cultura sobre ruedas para todos.',
		aprendizajes: 'Los niños esperan con ansias la llegada de la biblioteca cada semana.',
		url_portada: '/img/proyectos-18.jpg',
		created_at: new Date('2026-01-10'),
		fecha_cierre_postulaciones: new Date('2026-02-28'),
		fecha_fin_tentativa: new Date('2026-12-01'),
		id_chat_firebase: 1018,
		participacion_permitida_ids: [33, 34],
		colaboracion_ids: [],
		institucion_id: 18,
		solicitud_finalizacion_ids: [],
		estado: 'en_curso',
		participacion_permitida: [
			{
				id_participacion_permitida: 33,
				id_proyecto: 18,
				id_tipo_participacion: 1,
				unidad_medida: 'libros infantiles',
				objetivo: 300,
				actual: 45,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
			},
			{
				id_participacion_permitida: 34,
				id_proyecto: 18,
				id_tipo_participacion: 1,
				unidad_medida: 'BRL',
				objetivo: 60000,
				actual: 10000,
				tipo_participacion: { id_tipo_participacion: 2, descripcion: 'Monetaria' }
			}
		]
	},
	{
		id_proyecto: 19,
		titulo: 'Juegoteca Barrial',
		descripcion:
			'Espacio de juego seguro y acompañado para niños y niñas del barrio. Promovemos el derecho al juego y la socialización saludable.',
		resumen: 'Derecho al juego en un entorno seguro.',
		aprendizajes: 'El juego es fundamental para el desarrollo sano de la infancia.',
		url_portada: '/img/proyectos-19.jpg',
		created_at: new Date('2025-12-01'),
		fecha_cierre_postulaciones: new Date('2026-01-30'),
		fecha_fin_tentativa: new Date('2026-06-30'),
		id_chat_firebase: 1019,
		participacion_permitida_ids: [35, 36],
		colaboracion_ids: [],
		institucion_id: 11,
		solicitud_finalizacion_ids: [],
		estado: 'en_curso',
		participacion_permitida: [
			{
				id_participacion_permitida: 35,
				id_proyecto: 19,
				id_tipo_participacion: 1,
				unidad_medida: 'juguetes',
				objetivo: 50,
				actual: 15,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
			},
			{
				id_participacion_permitida: 36,
				id_proyecto: 19,
				id_tipo_participacion: 1,
				unidad_medida: 'juegos de mesa',
				objetivo: 20,
				actual: 5,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
			}
		]
	},
	{
		id_proyecto: 20,
		titulo: 'Comedor Nocturno',
		descripcion: 'Cenas calientes para personas en situación de calle durante el invierno.',
		resumen: 'Alimento caliente en noches frías.',
		aprendizajes: 'La regularidad genera confianza con las personas asistidas.',
		url_portada: '/img/proyectos-20.jpg',
		created_at: new Date('2026-02-01'),
		fecha_cierre_postulaciones: new Date('2026-03-01'),
		fecha_fin_tentativa: new Date('2026-08-01'),
		id_chat_firebase: 1020,
		participacion_permitida_ids: [37],
		colaboracion_ids: [],
		institucion_id: 11,
		solicitud_finalizacion_ids: [],
		estado: 'en_curso',
		participacion_permitida: [
			{
				id_participacion_permitida: 37,
				id_proyecto: 20,
				id_tipo_participacion: 1,
				unidad_medida: 'viandas',
				objetivo: 100,
				actual: 20,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
			}
		]
	},
	{
		id_proyecto: 21,
		titulo: 'Taller de Oficios',
		descripcion: 'Capacitación en carpintería básica para jóvenes del barrio.',
		resumen: 'Herramientas para el primer empleo.',
		aprendizajes: 'El oficio dignifica y abre puertas.',
		url_portada: '/img/proyectos-21.jpg',
		created_at: new Date('2026-02-15'),
		fecha_cierre_postulaciones: new Date('2026-03-15'),
		fecha_fin_tentativa: new Date('2026-09-15'),
		id_chat_firebase: 1021,
		participacion_permitida_ids: [38],
		colaboracion_ids: [],
		institucion_id: 11,
		solicitud_finalizacion_ids: [],
		estado: 'en_curso',
		participacion_permitida: [
			{
				id_participacion_permitida: 38,
				id_proyecto: 21,
				id_tipo_participacion: 1,
				unidad_medida: 'voluntarios capacitadores',
				objetivo: 2,
				actual: 1,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Voluntariado' }
			}
		]
	},
	{
		id_proyecto: 22,
		titulo: 'Apoyo escolar en contraturno',
		beneficiarios: 35,
		descripcion:
			'Acompañamiento educativo para estudiantes con dificultades de aprendizaje. Clases de apoyo en matemática y lengua durante las tardes.',
		resumen: 'Reforzamos contenidos clave para evitar el abandono escolar.',
		aprendizajes: 'El apoyo individualizado marca la diferencia en el rendimiento académico.',
		url_portada: '/img/proyectos-22.webp',
		created_at: new Date('2025-09-10'),
		updated_at: new Date('2025-12-20'),
		fecha_cierre_postulaciones: new Date('2025-10-15'),
		fecha_fin_tentativa: new Date('2025-12-30'),
		id_chat_firebase: 1022,
		participacion_permitida_ids: [39, 40],
		colaboracion_ids: [],
		institucion_id: 2,
		solicitud_finalizacion_ids: [10, 11, 12],
		estado: 'pendiente_solicitud_cierre',
		participacion_permitida: [
			{
				id_participacion_permitida: 39,
				id_proyecto: 22,
				id_tipo_participacion: 1,
				unidad_medida: 'docentes voluntarios',
				objetivo: 5,
				actual: 5,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Voluntariado' }
			},
			{
				id_participacion_permitida: 40,
				id_proyecto: 22,
				id_tipo_participacion: 1,
				unidad_medida: 'unidades',
				especie: 'útiles escolares',
				objetivo: 40,
				actual: 38,
				tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
			}
		]
	}
];
