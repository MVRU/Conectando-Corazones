import type { Resena } from '$lib/types/Resena';

// Reseñas pendientes de moderación (aprobado: undefined o false)
export const mockResenasPendientes: Resena[] = [
	{
		id_resena: 101,
		tipo_objeto: 'Proyecto',
		id_objeto: 1,
		contenido: 'Excelente proyecto, muy bien organizado y con resultados visibles. Recomiendo totalmente participar.',
		puntaje: 5,
		aprobado: undefined, // Pendiente
		username: 'maria_g'
	},
	{
		id_resena: 102,
		tipo_objeto: 'Proyecto',
		id_objeto: 2,
		contenido: 'El proyecto no cumplió con lo prometido. No recomiendo.',
		puntaje: 1,
		aprobado: undefined, // Pendiente
		username: 'ana_m'
	},
	{
		id_resena: 103,
		tipo_objeto: 'Usuario',
		id_objeto: 3,
		contenido: 'Muy profesional y comprometido. Excelente colaboración.',
		puntaje: 5,
		aprobado: undefined, // Pendiente
		username: 'escuela_esperanza'
	},
	{
		id_resena: 104,
		tipo_objeto: 'Proyecto',
		id_objeto: 3,
		contenido: 'Contenido inapropiado con lenguaje ofensivo y spam.',
		puntaje: 1,
		aprobado: false, // Rechazada
		username: 'usuario_anonimo'
	},
	{
		id_resena: 105,
		tipo_objeto: 'Usuario',
		id_objeto: 6,
		contenido: 'Gran trabajo en el proyecto. Muy satisfecho con los resultados.',
		puntaje: 4,
		aprobado: undefined, // Pendiente
		username: 'hospital_garrahan'
	}
];
