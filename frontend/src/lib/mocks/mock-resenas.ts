import type { Resena } from '$lib/types/Resena';

export const mockResenas: Resena[] = [
	{
		id_resena: 101,
		tipo_objeto: 'usuario',
		id_objeto: 2, // Escuela Esperanza
		puntaje: 5,
		contenido: 'Una experiencia maravillosa colaborar con la Escuela Esperanza. Su compromiso con los niños es total y el proyecto de la biblioteca fue super transparente.',
		username: 'biblioteca_popular',
		aprobado: true
	},
	{
		id_resena: 102,
		tipo_objeto: 'usuario',
		id_objeto: 2, // Escuela Esperanza
		puntaje: 5,
		contenido: 'Excelente gestión de los recursos. Donamos materiales deportivos y nos enviaron fotos de todo el proceso. Da gusto colaborar con instituciones tan serias.',
		username: 'fundacion_manos',
		aprobado: true
	},
	{
		id_resena: 103,
		tipo_objeto: 'usuario',
		id_objeto: 2, // Escuela Esperanza
		puntaje: 4,
		contenido: 'Participamos en la jornada de pintura y fue muy emotivo. La directora y los maestros nos recibieron con los brazos abiertos. Muy recomendados.',
		username: 'empresa_solidaria',
		aprobado: true
	},
	{
		id_resena: 104,
		tipo_objeto: 'usuario',
		id_objeto: 2, // Escuela Esperanza
		puntaje: 5,
		contenido: 'Siempre es un placer aportar a sus causas. La claridad con la que comunican sus necesidades hace que sea muy fácil ayudar donde realmente hace falta.',
		username: 'maria_g',
		aprobado: true
	}
];
