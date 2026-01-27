import type { Resena } from '$lib/domain/types/Resena';

export const mockResenas: Resena[] = [
	{
		id_resena: 101,
		tipo_objeto: 'usuario',
		id_objeto: 2, // Escuela Esperanza
		puntaje: 5,
		contenido:
			'Una experiencia maravillosa colaborar con la Escuela Esperanza. Su compromiso con los niños es total y el proyecto de la biblioteca fue super transparente.',
		username: 'biblioteca_popular',
		aprobado: true
	},
	{
		id_resena: 102,
		tipo_objeto: 'usuario',
		id_objeto: 2, // Escuela Esperanza
		puntaje: 5,
		contenido:
			'Excelente gestión de los recursos. Donamos materiales deportivos y nos enviaron fotos de todo el proceso. Da gusto colaborar con instituciones tan serias.',
		username: 'fundacion_manos',
		aprobado: true
	},
	{
		id_resena: 103,
		tipo_objeto: 'usuario',
		id_objeto: 2, // Escuela Esperanza
		puntaje: 4,
		contenido:
			'Participamos en la jornada de pintura y fue muy emotivo. La directora y los maestros nos recibieron con los brazos abiertos. Muy recomendados.',
		username: 'empresa_solidaria',
		aprobado: true
	},
	{
		id_resena: 104,
		tipo_objeto: 'usuario',
		id_objeto: 2, // Escuela Esperanza
		puntaje: 5,
		contenido:
			'Siempre es un placer aportar a sus causas. La claridad con la que comunican sus necesidades hace que sea muy fácil ayudar donde realmente hace falta.',
		username: 'maria_g',
		aprobado: true
	},
	{
		id_resena: 201,
		tipo_objeto: 'proyecto',
		id_objeto: 10, // Huerta Escolar Rosario (en revisión)
		puntaje: 4,
		contenido:
			'La huerta avanzó con buen ritmo y los talleres motivaron a los estudiantes. Sugiero sumar más instancias prácticas y un calendario semanal de riego para mejorar la continuidad.',
		username: 'maria_g',
		aprobado: true
	},
	{
		id_resena: 202,
		tipo_objeto: 'proyecto',
		id_objeto: 10, // Huerta Escolar Rosario (en revisión)
		puntaje: 5,
		contenido:
			'Se logró incorporar verduras al comedor y los chicos se involucraron mucho. Como mejora, sería útil medir resultados con un registro simple por semana.',
		username: 'biblioteca_popular',
		aprobado: true
	}
];
