/*
 * Está en "data" porque es una lista de datos estáticos
    -*- No son "mocks" porque no simulan nada; son fuentes fijas de verdad (truthy constants).
    -*- Como no cambian (o muy raramente) tampoco se deberían consultar a una API constantemente.
**/

import type { Faq } from '$lib/types/otros/Faq';

// ! La categoría "General" son los que aparecen en la sección de inicio (no agregar más)

export const faqs: Faq[] = [
	{
		pregunta: '¿Quién puede registrarse en la plataforma?',
		respuesta:
			'Cualquier institución que necesite ayuda o cualquier colaborador (persona u organización) interesado en brindarla.',
		categoria: 'General'
	},
	{
		pregunta: '¿Cómo se seleccionan los colaboradores para un proyecto?',
		respuesta:
			'Las instituciones revisan las postulaciones recibidas y eligen a los interesados que mejor se alinean con sus necesidades.',
		categoria: 'General'
	},
	{
		pregunta: '¿Es gratuito el uso de la plataforma?',
		respuesta: 'Sí, el registro y uso de la plataforma son completamente gratuitos.',
		categoria: 'General'
	},
	{
		pregunta: '¿Qué tipo de ayuda puedo ofrecer?',
		respuesta:
			'Podés ofrecer recursos materiales, financiamiento, voluntariado u otros tipos de apoyo según el proyecto.',
		categoria: 'General'
	},
	{
		pregunta: '¿Hay requisitos para registrarse en la plataforma?',
		respuesta:
			'Cualquier institución que necesite ayuda o cualquier colaborador (persona u organización) interesado en brindarla.',
		categoria: 'Participación e Inscripción'
	},
	{
		pregunta: '¿Cómo creo una cuenta en Conectando Corazones?',
		respuesta:
			'Primero seleccionás el tipo de usuario (Institución o Colaborador) y luego completás un formulario de registro para crear tu cuenta y acceder a todas las funcionalidades de la plataforma.',
		categoria: 'Participación e Inscripción'
	},
	{
		pregunta: '¿Existen diferentes tipos de usuario?',
		respuesta:
			'Sí, podés registrarte como Institución (para crear proyectos y recibir colaboración) o como Colaborador (para postularte para ayudar en los proyectos disponibles).',
		categoria: 'Participación e Inscripción'
	},
	{
		pregunta: '¿Puedo cambiar de tipo de usuario una vez registrado?',
		respuesta: 'No, no se puede cambiar de tipo de usuario una vez registrado.',
		categoria: 'Participación e Inscripción'
	},
	{
		pregunta: '¿Puedo proponer un proyecto si no soy una institución?',
		respuesta:
			'Por el momento, solo las instituciones registradas pueden publicar proyectos, pero podés sugerir ideas al equipo de Conectando Corazones.',
		categoria: 'Participación e Inscripción'
	},
	{
		pregunta: '¿Qué tipo de proyectos puedo encontrar en la plataforma?',
		respuesta:
			'Encontrarás proyectos de diferentes áreas, como educación, asistencia social, cultura, medio ambiente, salud y otras iniciativas orientadas a mejorar la calidad de vida de comunidades vulnerables.',
		categoria: 'Tipos de Ayuda y Proyectos'
	},
	{
		pregunta: '¿Puedo colaborar en más de un proyecto a la vez?',
		respuesta:
			'Sí, podés participar en todos los proyectos que desees, siempre que cumplas con los requerimientos y tu disponibilidad lo permita.',
		categoria: 'Tipos de Ayuda y Proyectos'
	},
	{
		pregunta: '¿Cómo sé si un proyecto sigue abierto?',
		respuesta:
			'Cada proyecto tiene un estado actualizado en la plataforma para indicar si sigue abierto, está en búsqueda de colaboradores o si ya concluyó.',
		categoria: 'Tipos de Ayuda y Proyectos'
	},
	{
		pregunta: '¿Puedo ver el progreso o resultados de los proyectos en los que colaboré?',
		respuesta:
			'Sí, cada proyecto cuenta con una sección de avances y evidencia donde las instituciones publican actualizaciones, imágenes y resultados para que los colaboradores puedan seguir el impacto generado.',
		categoria: 'Tipos de Ayuda y Proyectos'
	},
	{
		pregunta: '¿Cómo elijo en qué tipo de ayuda me gustaría participar?',
		respuesta:
			'Al registrarte como colaborador, podés indicar tus preferencias (voluntariado, materiales o aportes monetarios). Luego podrás postularte a los proyectos que coincidan con tu disponibilidad e intereses.',
		categoria: 'Tipos de Ayuda y Proyectos'
	},
	{
		pregunta: '¿Qué sucede después de enviar mi postulación?',
		respuesta:
			'La institución responsable del proyecto revisará todas las postulaciones recibidas y seleccionará a los colaboradores que mejor se adapten a los requerimientos de la iniciativa.',
		categoria: 'Postulación y Participación'
	},
	{
		pregunta: '¿Puedo cambiar o cancelar mi postulación?',
		respuesta:
			'Sí, podés editar o cancelar tu postulación en cualquier momento antes de que la institución la revise.',
		categoria: 'Postulación y Participación'
	},
	{
		pregunta: '¿Recibiré una notificación si soy seleccionado para colaborar?',
		respuesta:
			'Sí, recibirás una notificación por correo electrónico y dentro de la plataforma para confirmarte que tu postulación fue aceptada.',
		categoria: 'Postulación y Participación'
	},
	{
		pregunta: '¿Qué responsabilidades asumo al participar en un proyecto?',
		respuesta:
			'Te comprometés a cumplir con las actividades acordadas, respetar los plazos y colaborar de manera responsable para garantizar que el proyecto alcance sus objetivos.',
		categoria: 'Postulación y Participación'
	},
	{
		pregunta: '¿La plataforma tiene costo para los usuarios?',
		respuesta:
			'No, tanto para instituciones como para colaboradores, el registro y uso de la plataforma son completamente gratuitos.',
		categoria: 'Costos y Políticas de la Plataforma'
	},
	{
		pregunta: '¿Existen otros costos involucrados?',
		respuesta:
			'La plataforma no cobra ninguna comisión por donaciones o colaboraciones. Todos los aportes llegan directamente a la institución correspondiente.',
		categoria: 'Costos y Políticas de la Plataforma'
	},
	{
		pregunta: '¿Cuáles son las políticas de la comunidad?',
		respuesta:
			'Todos los usuarios deben actuar con responsabilidad, respeto y honestidad, promoviendo un ambiente seguro y colaborativo para todas las partes involucradas.',
		categoria: 'Costos y Políticas de la Plataforma'
	},
	{
		pregunta: '¿Puedo denunciar comportamientos inadecuados?',
		respuesta:
			'Sí, cualquier usuario puede reportar situaciones que no cumplan con las políticas de la comunidad a través del formulario de contacto o la sección de soporte.',
		categoria: 'Costos y Políticas de la Plataforma'
	},
	{
		pregunta: '¿Qué pasa con mis datos personales?',
		respuesta:
			'Los datos que proporcionás son utilizados únicamente para el funcionamiento de la plataforma y nunca se comparten con terceros sin tu consentimiento.',
		categoria: 'Seguridad y Privacidad'
	},
	{
		pregunta: '¿Mi información de contacto es visible para otros usuarios?',
		respuesta:
			'No. Solo se comparte la información estrictamente necesaria entre las partes cuando una colaboración es confirmada.',
		categoria: 'Seguridad y Privacidad'
	},
	{
		pregunta: '¿Cómo puedo eliminar mi cuenta?',
		respuesta:
			'Podés solicitar la baja de tu cuenta en cualquier momento desde tu perfil o contactando a soporte.',
		categoria: 'Seguridad y Privacidad'
	}
];
