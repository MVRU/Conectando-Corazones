import type { Chat } from '$lib/domain/types/Chat';
import { mockProyectos } from './mock-proyectos';

// Helper para obtener fecha relativa con hora específica
const getDate = (daysAgo: number, hours: number, minutes: number) => {
	const date = new Date();
	date.setDate(date.getDate() - daysAgo);
	date.setHours(hours, minutes, 0, 0);
	return date;
};

export const mockChats: Chat[] = [
	{
		id_chat: 1,
		proyecto_id: 1, // Un libro, un sueño
		titulo: mockProyectos.find((p) => p.id_proyecto === 1)?.titulo || 'Proyecto 1',
		participantes_ids: [2, 4, 7], // Institución (2), Colaboradores aprobados (4, 7)
		created_at: getDate(10, 9, 0),
		updated_at: getDate(0, 15, 30),
		mensajes: [
			{
				id_mensaje: 1,
				chat_id: 1,
				remitente_id: 2, // Escuela Esperanza
				contenido:
					'¡Buenas! Bienvenidos al chat del proyecto. Muchísimas gracias por sumarse a esta movida por los chicos.',
				created_at: getDate(5, 10, 15)
			},
			{
				id_mensaje: 2,
				chat_id: 1,
				remitente_id: 4, // María González
				contenido:
					'¡Hola a todos! Qué linda iniciativa. Yo ya estuve juntando un par de cuentos infantiles que estaban impecables.',
				created_at: getDate(5, 11, 20)
			},
			{
				id_mensaje: 3,
				chat_id: 1,
				remitente_id: 7, // Empresa Solidaria
				contenido:
					'Hola María, hola Escuela. Nosotros desde la empresa pusimos un canasto en la recepción y los empleados ya trajeron un montón de libros de texto.',
				created_at: getDate(4, 14, 45)
			},
			{
				id_mensaje: 4,
				chat_id: 1,
				remitente_id: 2, // Escuela Esperanza
				contenido:
					'¡Qué grande! Los libros de texto nos vienen bárbaro para la biblioteca escolar. ¿Les parece si coordinamos para que los traigan el jueves que viene?',
				created_at: getDate(3, 9, 30)
			},
			{
				id_mensaje: 5,
				chat_id: 1,
				remitente_id: 4, // María González
				contenido: 'A mí me queda joya el jueves. ¿A qué hora les viene mejor que pase?',
				created_at: getDate(3, 16, 10)
			},
			{
				id_mensaje: 6,
				chat_id: 1,
				remitente_id: 2, // Escuela Esperanza
				contenido: 'Pueden pasar de 8 a 12 o de 13 a 17, que es cuando estamos en la secretaría.',
				created_at: getDate(2, 10, 0)
			},
			{
				id_mensaje: 7,
				chat_id: 1,
				remitente_id: 7, // Empresa Solidaria
				contenido:
					'Dale, yo mando a uno de los chicos de logística tipo 10 de la mañana con todas las cajas. ¡Nos vemos!',
				created_at: getDate(1, 11, 20)
			},
			{
				id_mensaje: 8,
				chat_id: 1,
				remitente_id: 4, // María González
				contenido: 'Buenísimo, yo paso un ratito después de almorzar entonces. ¡Abrazo!',
				created_at: getDate(0, 15, 30)
			}
		]
	},
	{
		id_chat: 2,
		proyecto_id: 2, // Comedores con alma
		titulo: mockProyectos.find((p) => p.id_proyecto === 2)?.titulo || 'Proyecto 2',
		participantes_ids: [11, 6], // Institución (11), Colaborador aprobado (6)
		created_at: getDate(15, 8, 30),
		updated_at: getDate(1, 18, 45),
		mensajes: [
			{
				id_mensaje: 101,
				chat_id: 2,
				remitente_id: 11, // Comedor Los Pinos
				contenido:
					'Hola gente de la Fundación, ¿cómo andan? Les quería agradecer por la mano que nos están dando.',
				created_at: getDate(10, 10, 0)
			},
			{
				id_mensaje: 102,
				chat_id: 2,
				remitente_id: 6, // Fundación Manos Unidas
				contenido:
					'¡Hola Silvia! No es nada, estamos para eso. ¿Cómo vienen con el stock de mercadería?',
				created_at: getDate(9, 11, 30)
			},
			{
				id_mensaje: 103,
				chat_id: 2,
				remitente_id: 11, // Comedor Los Pinos
				contenido:
					'Mirá, estamos medio cortos de aceite y fideos. Si pueden conseguir algo de eso sería un golazo.',
				created_at: getDate(1, 18, 45)
			}
		]
	},
	{
		id_chat: 3,
		proyecto_id: 3, // Hogar de sonrisas
		titulo: mockProyectos.find((p) => p.id_proyecto === 3)?.titulo || 'Proyecto 3',
		participantes_ids: [3, 7, 4], // Institución (3), Colaboradores (7, 4)
		created_at: getDate(20, 10, 0),
		updated_at: getDate(5, 14, 20),
		mensajes: [
			{
				id_mensaje: 301,
				chat_id: 3,
				remitente_id: 3, // Hospital Garrahan
				contenido:
					'Hola a todos, abrimos este espacio para coordinar las actividades recreativas en el hogar.',
				created_at: getDate(15, 9, 0)
			},
			{
				id_mensaje: 302,
				chat_id: 3,
				remitente_id: 7, // Empresa Solidaria
				contenido:
					'¡Excelente! Nosotros podemos llevar algunos juegos de mesa y materiales para dibujar.',
				created_at: getDate(14, 15, 30)
			},
			{
				id_mensaje: 303,
				chat_id: 3,
				remitente_id: 4, // María González
				contenido:
					'Yo me prendo para ayudar con los talleres de lectura. ¿Qué día tienen pensado arrancar?',
				created_at: getDate(5, 14, 20)
			}
		]
	},
	{
		id_chat: 4,
		proyecto_id: 4, // Equipamiento Médico Hospitalario
		titulo: mockProyectos.find((p) => p.id_proyecto === 4)?.titulo || 'Proyecto 4',
		participantes_ids: [9, 8], // Institución (9), Colaborador (8)
		created_at: getDate(10, 10, 0),
		updated_at: getDate(5, 11, 30),
		mensajes: [
			{
				id_mensaje: 401,
				chat_id: 4,
				remitente_id: 9, // Clínica San Jorge
				contenido:
					'Hola Ana, recibimos tu donación para el equipamiento. ¡Muchas gracias por colaborar!',
				created_at: getDate(5, 11, 30)
			}
		]
	},
	{
		id_chat: 5,
		proyecto_id: 5, // Apoyo Escolar Comunitario
		titulo: mockProyectos.find((p) => p.id_proyecto === 5)?.titulo || 'Proyecto 5',
		participantes_ids: [2, 4], // Institución (2), Colaborador (4)
		created_at: getDate(20, 9, 0),
		updated_at: getDate(15, 10, 0),
		mensajes: [
			{
				id_mensaje: 501,
				chat_id: 5,
				remitente_id: 2, // Escuela Esperanza
				contenido: 'Hola María, ¿cómo venís con los preparativos para las clases de apoyo?',
				created_at: getDate(15, 10, 0)
			}
		]
	},
	{
		id_chat: 6,
		proyecto_id: 6, // Alimentos No Perecederos
		titulo: mockProyectos.find((p) => p.id_proyecto === 6)?.titulo || 'Proyecto 6',
		participantes_ids: [11, 6], // Institución (11), Colaborador (6)
		created_at: getDate(12, 11, 0),
		updated_at: getDate(2, 16, 10),
		mensajes: [
			{
				id_mensaje: 601,
				chat_id: 6,
				remitente_id: 6, // Fundación Manos Unidas
				contenido:
					'Hola Silvia, ya tenemos el primer lote de donaciones listo para retirar. ¿Cuándo les queda bien?',
				created_at: getDate(3, 10, 45)
			},
			{
				id_mensaje: 602,
				chat_id: 6,
				remitente_id: 11, // Comedor Los Pinos
				contenido:
					'¡Hola Patricia! Mañana a la tarde estamos, si quieren pueden pasar después de las 15.',
				created_at: getDate(2, 16, 10)
			}
		]
	},
	{
		id_chat: 7,
		proyecto_id: 7, // Ropa de Abrigo Invernal
		titulo: mockProyectos.find((p) => p.id_proyecto === 7)?.titulo || 'Proyecto 7',
		participantes_ids: [14, 6, 8], // Institución (14), Colaboradores (6, 8)
		created_at: getDate(8, 14, 0),
		updated_at: getDate(0, 10, 15),
		mensajes: [
			{
				id_mensaje: 701,
				chat_id: 7,
				remitente_id: 14, // Fundación Calor
				contenido:
					'Hola a todos, ¿cómo va? Vimos que se sumaron para ayudar con la ropa de abrigo. ¡Bienvenidos!',
				created_at: getDate(5, 11, 0)
			},
			{
				id_mensaje: 702,
				chat_id: 7,
				remitente_id: 8, // Ana Martínez
				contenido:
					'¡Hola! Sí, estuve juntando varias camperas y frazadas que están impecables. Mañana las acerco.',
				created_at: getDate(0, 10, 15)
			}
		]
	}
];
