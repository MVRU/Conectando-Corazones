import type { Resena } from '$lib/types/Resena';

export const mockTestimonios: Resena[] = [
	{
		puntaje: 4,
		contenido: 'Siento que mis ganas de ayudar encontraron el mejor lugar posible.',
		username: 'Lucía M.',
		rol: 'Voluntaria'
	},
	{
		puntaje: 3,
		contenido:
			'Nuestro equipo ha podido colaborar en proyectos que antes ni conocíamos. La plataforma nos guía hacia oportunidades que realmente importan.',
		username: 'Rotaract Club Local',
		rol: ''
	},
	{
		puntaje: 5,
		contenido:
			'Gracias a Conectando Corazones recibimos los libros que necesitábamos. Ahora nuestros niños pueden aprender con libros y sueños renovados.',
		username: 'María G.',
		rol: 'Directora de una escuela rural'
	},
	{
		puntaje: 5,
		contenido:
			'Encontré una causa que realmente me apasiona. Esta plataforma me conectó con personas que, como yo, quieren hacer la diferencia.',
		username: 'Juan P.',
		rol: 'Voluntario en un comedor comunitario'
	},
	{
		puntaje: 5,
		contenido: 'Participar fue fácil y el impacto fue real. Lo recomiendo a todas las ONGs.',
		username: 'Ana R.',
		rol: 'ONG Pequeños Corazones'
	},
	{
		puntaje: 5,
		contenido: 'El sitio es súper simple y logramos sumar donaciones en poco tiempo.',
		username: 'Carlos F.',
		rol: 'Referente barrial'
	},
	// Reseñas específicas para María G. (usuario ID: 4)
	{
		id_resena: 7,
		puntaje: 4,
		contenido:
			'María es una colaboradora excepcional. Su dedicación y compromiso con los proyectos educativos es admirable. Siempre está dispuesta a ayudar y aporta ideas muy valiosas.',
		username: 'Ana R.',
		rol: 'ONG Pequeños Corazones',
		tipo_objeto: 'usuario',
		id_objeto: 4
	},
	{
		id_resena: 8,
		puntaje: 5,
		contenido:
			'Trabajar con María ha sido una experiencia muy positiva. Su profesionalismo y su pasión por la educación rural se nota en cada proyecto que apoya.',
		username: 'Carlos F.',
		rol: 'Referente barrial',
		tipo_objeto: 'usuario',
		id_objeto: 4
	},
	{
		id_resena: 9,
		puntaje: 5,
		contenido:
			'María es una persona muy comprometida con las causas sociales. Su experiencia en educación rural aporta mucho valor a los proyectos. La recomiendo totalmente.',
		username: 'Lucía M.',
		rol: 'Voluntaria',
		tipo_objeto: 'usuario',
		id_objeto: 4
	},
	{
		id_resena: 10,
		puntaje: 4,
		contenido:
			'Excelente colaboradora. María siempre cumple con sus compromisos y aporta una perspectiva muy valiosa desde su experiencia en educación rural.',
		username: 'Rotaract Club Local',
		rol: 'Club de servicio',
		tipo_objeto: 'usuario',
		id_objeto: 4
	}
];
