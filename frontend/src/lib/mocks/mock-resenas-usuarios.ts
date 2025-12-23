import type { Resena } from '$lib/types/Resena';

// Reseñas sobre usuarios (colaboradores e instituciones)
export const mockResenasUsuarios: Resena[] = [
	// Usuario 4 - María González - Calificación promedio: 2.0 (baja)
	{
		id_resena: 1,
		tipo_objeto: 'Usuario',
		id_objeto: 4,
		contenido: 'No cumplió con los compromisos acordados. Abandonó el proyecto a mitad de camino sin avisar.',
		puntaje: 1,
		aprobado: true,
		username: 'escuela_esperanza'
	},
	{
		id_resena: 2,
		tipo_objeto: 'Usuario',
		id_objeto: 4,
		contenido: 'La comunicación fue muy deficiente. No respondía mensajes y cuando lo hacía era muy tarde.',
		puntaje: 2,
		aprobado: true,
		username: 'hospital_garrahan'
	},
	{
		id_resena: 3,
		tipo_objeto: 'Usuario',
		id_objeto: 4,
		contenido: 'Participó pero con muy poco compromiso. No aportó lo que prometió inicialmente.',
		puntaje: 3,
		aprobado: true,
		username: 'biblioteca_popular'
	},

	// Usuario 7 - Empresa Solidaria S.A. - Calificación promedio: 2.3 (baja)
	{
		id_resena: 4,
		tipo_objeto: 'Usuario',
		id_objeto: 7,
		contenido: 'Comportamiento inapropiado en el chat. Mensajes ofensivos hacia otros colaboradores.',
		puntaje: 1,
		aprobado: true,
		username: 'maria_g'
	},
	{
		id_resena: 5,
		tipo_objeto: 'Usuario',
		id_objeto: 7,
		contenido: 'Los recursos prometidos nunca llegaron. Muy desconfiable.',
		puntaje: 2,
		aprobado: true,
		username: 'escuela_esperanza'
	},
	{
		id_resena: 6,
		tipo_objeto: 'Usuario',
		id_objeto: 7,
		contenido: 'Participación mínima. Parecía más interesado en publicidad que en ayudar realmente.',
		puntaje: 4,
		aprobado: true,
		username: 'fundacion_manos'
	},

	// Usuario 8 - Ana Martínez - Calificación promedio: 2.5 (baja)
	{
		id_resena: 7,
		tipo_objeto: 'Usuario',
		id_objeto: 8,
		contenido: 'Publicó proyectos duplicados y con información confusa. Parece spam.',
		puntaje: 2,
		aprobado: true,
		username: 'hospital_garrahan'
	},
	{
		id_resena: 8,
		tipo_objeto: 'Usuario',
		id_objeto: 8,
		contenido: 'No mantuvo contacto después de iniciar la colaboración. Desapareció del proyecto.',
		puntaje: 3,
		aprobado: true,
		username: 'clinica_san_jorge'
	},
	{
		id_resena: 9,
		tipo_objeto: 'Usuario',
		id_objeto: 8,
		contenido: 'La calidad del trabajo entregado no cumplió con las expectativas mínimas.',
		puntaje: 2,
		aprobado: true,
		username: 'fundacion_siempre'
	},

	// Usuario 5 - Biblioteca Popular - Calificación promedio: 4.2 (buena, no baja)
	{
		id_resena: 10,
		tipo_objeto: 'Usuario',
		id_objeto: 5,
		contenido: 'Excelente colaboración. Muy comprometidos y profesionales.',
		puntaje: 5,
		aprobado: true,
		username: 'escuela_esperanza'
	},
	{
		id_resena: 11,
		tipo_objeto: 'Usuario',
		id_objeto: 5,
		contenido: 'Buen trabajo, aunque hubo algunos retrasos menores.',
		puntaje: 4,
		aprobado: true,
		username: 'hospital_garrahan'
	},
	{
		id_resena: 12,
		tipo_objeto: 'Usuario',
		id_objeto: 5,
		contenido: 'Muy responsables y cumplieron con todo lo acordado.',
		puntaje: 4,
		aprobado: true,
		username: 'comedor_los_pinos'
	}
];
