import type { Resena } from '$lib/domain/types/Resena';

export const mockResenas: Resena[] = [
	{
		id_resena: 1,
		username: 'Lucía Fernández',
		rol: 'Voluntaria',
		contenido:
			'La plataforma me permitió encontrar proyectos cerca de casa que realmente necesitaban ayuda. Es muy intuitiva y transparente en cuanto al impacto de las donaciones.',
		puntaje: 5,
		tipo_objeto: 'plataforma'
	},
	{
		id_resena: 2,
		username: 'Escuela N° 12 "Sarmiento"',
		rol: 'Institución',
		contenido:
			'Gracias a Conectando Corazones logramos completar la biblioteca escolar en tiempo récord. La comunicación con los donantes es directa y fluida.',
		puntaje: 5,
		tipo_objeto: 'plataforma'
	},
	{
		id_resena: 3,
		username: 'Marcos Benítez',
		rol: 'Donante',
		contenido:
			'Poder ver la evidencia del cierre de los proyectos me da la tranquilidad de que mi aporte llegó a donde tenía que llegar. Una iniciativa excelente.',
		puntaje: 5,
		tipo_objeto: 'plataforma'
	},
	{
		id_resena: 4,
		username: 'ONG Manos Solidarias',
		rol: 'Organización',
		contenido:
			'Gestionar nuestras campañas de recaudación de materiales nunca fue tan sencillo. El sistema de seguimiento es una herramienta fundamental para nosotros.',
		puntaje: 4,
		tipo_objeto: 'plataforma'
	},
	{
		id_resena: 5,
		username: 'Sofía Martínez',
		rol: 'Voluntaria',
		contenido:
			'Me encanta la comunidad que se está formando. No solo ayudamos a otros, sino que también nos conectamos con personas que comparten nuestros valores.',
		puntaje: 5,
		tipo_objeto: 'plataforma'
	}
];
