import type { Administrador, Institucion, Organizacion, Unipersonal } from '$lib/types/Usuario';

import { mockCategorias } from '$lib/mocks/mock-categorias';
import { mockLocalidades } from '$lib/mocks/mock-localidades';

export const mockUsuarios = {
	admin1: {
		id_usuario: 1,
		username: 'admin_conectando',
		password: '123456',
		nombre: 'Alexis',
		apellido: 'Sklate',
		fecha_nacimiento: new Date('2005-03-15'),
		estado: 'activo',
		created_at: new Date('2020-01-01'),
		rol: 'administrador',
		url_foto: '/users/user-default.png',
		localidad_id: 4,
		localidad: mockLocalidades[3],
		descripcion:
			'Administrador principal de la plataforma Conectando Corazones. Encargado de la supervisión, gestión de usuarios y validación de contenidos para asegurar el correcto funcionamiento de la comunidad.',

		contactos: [
			{ tipo_contacto: 'email', valor: 'admin@conectandocorazones.org', etiqueta: 'principal' }
		],
		consentimientos: [
			{
				id_consentimiento: 1,
				tipo: 'terminos',
				version: '1.0',
				created_at: new Date('2024-01-01')
			},
			{
				id_consentimiento: 2,
				tipo: 'privacidad',
				version: '1.0',
				created_at: new Date('2024-01-01')
			},
			{ id_consentimiento: 3, tipo: 'conducta', version: '1.0', created_at: new Date('2024-01-01') }
		]
	} satisfies Administrador,

	escuela_esperanza: {
		id_usuario: 2,
		username: 'escuela_esperanza',
		password: '123456',
		nombre: 'María Elena',
		apellido: 'Rodríguez',
		fecha_nacimiento: new Date('1970-06-10'),
		estado: 'activo',
		created_at: new Date('2024-01-15'),
		rol: 'institucion',
		url_foto: '/users/escuela-esperanza.jpg',
		nombre_legal: 'Escuela Primaria Esperanza',
		tipo_institucion: 'Educación pública',
		localidad_id: 4,
		localidad: mockLocalidades[3],
		descripcion:
			'Somos una institución educativa comprometida con la formación integral de niños y jóvenes. Nuestro objetivo es brindar educación de calidad y fomentar valores solidarios en la comunidad de Rosario.',

		contactos: [
			{ tipo_contacto: 'email', valor: 'direccion@escuelaesperanza.edu.ar', etiqueta: 'principal' },
			{
				tipo_contacto: 'email',
				valor: 'direccion2@escuelaesperanza.edu.ar',
				etiqueta: 'secundario'
			},
			{ tipo_contacto: 'telefono', valor: '341 1234567', etiqueta: 'celular' }
		],
		consentimientos: [
			{
				id_consentimiento: 4,
				tipo: 'terminos',
				version: '1.0',
				created_at: new Date('2024-01-15')
			},
			{
				id_consentimiento: 5,
				tipo: 'privacidad',
				version: '1.0',
				created_at: new Date('2024-01-15')
			},
			{
				id_consentimiento: 6,
				tipo: 'evidencia',
				version: '1.0',
				created_at: new Date('2024-01-15')
			}
		]
	} satisfies Institucion,

	hospital_garrahan: {
		id_usuario: 3,
		username: 'hospital_garrahan',
		password: '123456',
		nombre: 'Dr. Roberto',
		apellido: 'García',
		fecha_nacimiento: new Date('1965-11-20'),
		estado: 'activo',
		created_at: new Date('2024-02-10'),
		rol: 'institucion',
		url_foto: '/users/user-default.png',
		nombre_legal: 'Hospital de Pediatría Prof. Dr. Juan P. Garrahan',
		tipo_institucion: 'Salud pública',
		localidad_id: 3,
		localidad: mockLocalidades[2],
		descripcion:
			'Centro de referencia nacional en salud pública pediátrica. Nos dedicamos a la atención integral de niños y adolescentes, promoviendo la investigación y la docencia para garantizar el bienestar infantil.',

		contactos: [
			{ tipo_contacto: 'email', valor: 'proyectos@garrahan.gov.ar', etiqueta: 'principal' }
		],
		consentimientos: [
			{
				id_consentimiento: 7,
				tipo: 'terminos',
				version: '1.0',
				created_at: new Date('2024-02-10')
			},
			{
				id_consentimiento: 8,
				tipo: 'privacidad',
				version: '1.0',
				created_at: new Date('2024-02-10')
			}
		]
	} satisfies Institucion,

	maria_gonzalez: {
		id_usuario: 4,
		username: 'maria_g',
		password: '123456',
		nombre: 'María',
		apellido: 'González',
		fecha_nacimiento: new Date('1985-05-20'),
		estado: 'activo',
		created_at: new Date('2024-02-01'),
		rol: 'colaborador',
		url_foto: '/users/user-default.png',
		tipo_colaborador: 'unipersonal',
		descripcion:
			'Apasionada por la educación y el arte. Me encanta colaborar en proyectos que promuevan el desarrollo cultural y educativo de la comunidad. Tengo experiencia en organización de eventos y talleres para niños.',
		localidad_id: 5,
		localidad: mockLocalidades[4],
		contactos: [
			{ tipo_contacto: 'email', valor: 'maria.gonzalez@gmail.com', etiqueta: 'principal' },
			{ tipo_contacto: 'telefono', valor: '341 22233665', etiqueta: 'celular' },
			{ tipo_contacto: 'telefono', valor: '341 44443665', etiqueta: 'celular secundario' },
			{ tipo_contacto: 'web', valor: 'https://www.maria-gonzalez.com.ar', etiqueta: 'principal' }
		],
		categorias_preferidas: [
			mockCategorias[4], // Educación
			mockCategorias[2], // Cultura y arte
			mockCategorias[16], // Salud
			mockCategorias[0] // Alimentación y nutrición
		],
		tipos_participacion_preferidas: [{ descripcion: 'Voluntariado' }, { descripcion: 'Especie' }],

		consentimientos: [
			{
				id_consentimiento: 9,
				tipo: 'terminos',
				version: '1.0',
				created_at: new Date('2024-02-01')
			},
			{
				id_consentimiento: 10,
				tipo: 'privacidad',
				version: '1.0',
				created_at: new Date('2024-02-01')
			}
		]
	} satisfies Unipersonal,

	biblioteca_popular: {
		id_usuario: 5,
		username: 'biblioteca_popular',
		password: '123456',
		nombre: 'Lucía',
		apellido: 'Fernández',
		fecha_nacimiento: new Date('1975-08-20'),
		estado: 'activo',
		created_at: new Date('2024-02-15'),
		rol: 'colaborador',
		url_foto: '/users/user-default.png',
		tipo_colaborador: 'organizacion',
		razon_social: 'Biblioteca Popular Los Libros',
		con_fines_de_lucro: false,
		localidad_id: 2,
		localidad: mockLocalidades[1],
		descripcion:
			'Espacio cultural abierto a la comunidad de La Plata. Incentivamos la lectura, el aprendizaje y el acceso libre a la información a través de talleres y actividades para todas las edades.',

		contactos: [{ tipo_contacto: 'email', valor: 'info@bploslibros.org', etiqueta: 'principal' }],
		categorias_preferidas: [
			mockCategorias[4], // Educación (índice 4)
			mockCategorias[2], // Cultura y arte (índice 2)
			mockCategorias[9] // Liderazgo (índice 9)
		],
		tipos_participacion_preferidas: [{ descripcion: 'Especie' }, { descripcion: 'Monetaria' }],

		consentimientos: [
			{
				id_consentimiento: 11,
				tipo: 'terminos',
				version: '1.0',
				created_at: new Date('2024-02-15')
			},
			{
				id_consentimiento: 12,
				tipo: 'privacidad',
				version: '1.0',
				created_at: new Date('2024-02-15')
			}
		]
	} satisfies Organizacion,

	fundacion_manos_unidas: {
		id_usuario: 6,
		username: 'fundacion_manos',
		password: '123456',
		nombre: 'Patricia',
		apellido: 'Morales',
		fecha_nacimiento: new Date('1975-04-15'),
		estado: 'activo',
		created_at: new Date('2024-01-20'),
		rol: 'colaborador',
		url_foto: '/users/user-default.png',
		tipo_colaborador: 'organizacion',
		razon_social: 'Fundación Manos Unidas Argentina',
		con_fines_de_lucro: false,
		localidad_id: 6,
		localidad: mockLocalidades[5],
		descripcion:
			'Organización sin fines de lucro dedicada a la asistencia social en Santa Fe. Trabajamos incansablemente para mejorar la calidad de vida de familias vulnerables mediante programas de alimentación y apoyo escolar.',

		contactos: [
			{ tipo_contacto: 'email', valor: 'contacto@manosunidas.org.ar', etiqueta: 'principal' }
		],
		tipos_participacion_preferidas: [
			{ descripcion: 'Voluntariado' },
			{ descripcion: 'Especie' },
			{ descripcion: 'Monetaria' }
		],

		consentimientos: [
			{
				id_consentimiento: 12,
				tipo: 'terminos',
				version: '1.0',
				created_at: new Date('2024-01-20')
			},
			{
				id_consentimiento: 13,
				tipo: 'privacidad',
				version: '1.0',
				created_at: new Date('2024-01-20')
			},
			{
				id_consentimiento: 14,
				tipo: 'evidencia',
				version: '1.0',
				created_at: new Date('2024-01-20')
			},
			{
				id_consentimiento: 15,
				tipo: 'conducta',
				version: '1.0',
				created_at: new Date('2024-01-20')
			}
		]
	} satisfies Organizacion,

	empresa_solidaria_sa: {
		id_usuario: 7,
		username: 'empresa_solidaria',
		password: '123456',
		nombre: 'Juan Carlos',
		apellido: 'Mendoza',
		fecha_nacimiento: new Date('1978-03-22'),
		estado: 'activo',
		created_at: new Date('2024-02-05'),
		rol: 'colaborador',
		url_foto: '/users/user-default.png',
		tipo_colaborador: 'organizacion',
		razon_social: 'Empresa Solidaria S.A.',
		con_fines_de_lucro: true,
		localidad_id: 7,
		localidad: mockLocalidades[6],
		descripcion:
			'Empresa comprometida con la Responsabilidad Social Empresarial en Mendoza. Apoyamos financiamiento de proyectos sustentables y de alto impacto social para devolver a la comunidad parte de nuestro crecimiento.',

		contactos: [
			{
				tipo_contacto: 'email',
				valor: 'rse@empresasolidaria.com.ar',
				etiqueta: 'principal'
			}
		],
		tipos_participacion_preferidas: [{ descripcion: 'Monetaria' }],

		consentimientos: [
			{
				id_consentimiento: 16,
				tipo: 'terminos',
				version: '1.0',
				created_at: new Date('2024-02-05')
			},
			{
				id_consentimiento: 17,
				tipo: 'privacidad',
				version: '1.0',
				created_at: new Date('2024-02-05')
			}
		]
	} satisfies Organizacion,

	ana_martinez: {
		id_usuario: 8,
		username: 'ana_m',
		password: '123456',
		nombre: 'Ana',
		apellido: 'Martínez',
		fecha_nacimiento: new Date('1982-09-14'),
		estado: 'activo',
		created_at: new Date('2024-03-01'),
		rol: 'colaborador',
		url_foto: '/users/user-default.png',
		tipo_colaborador: 'unipersonal',
		localidad_id: 8,
		localidad: mockLocalidades[7],
		descripcion:
			'Profesional de la salud y voluntaria activa. Busco oportunidades para aportar mis conocimientos y tiempo en campañas de vacunación y asistencia primaria en zonas rurales de Mar del Plata.',
		contactos: [
			{
				tipo_contacto: 'email',
				valor: 'ana.martinez@outlook.com',
				etiqueta: 'principal'
			}
		],
		tipos_participacion_preferidas: [{ descripcion: 'Voluntariado' }],

		consentimientos: [
			{
				id_consentimiento: 18,
				tipo: 'terminos',
				version: '1.0',
				created_at: new Date('2024-03-01')
			},
			{
				id_consentimiento: 19,
				tipo: 'privacidad',
				version: '1.0',
				created_at: new Date('2024-03-01')
			},
			{
				id_consentimiento: 20,
				tipo: 'conducta',
				version: '1.0',
				created_at: new Date('2024-03-01')
			}
		]
	} satisfies Unipersonal,

	clinica_san_jorge: {
		id_usuario: 9,
		username: 'clinica_sj',
		password: '123456',
		nombre: 'Dra. Carmen',
		apellido: 'Vega',
		fecha_nacimiento: new Date('1972-07-18'),
		estado: 'activo',
		created_at: new Date('2024-02-20'),
		rol: 'institucion',
		url_foto: '/users/user-default.png',
		nombre_legal: 'Clínica San Jorge S.A.',
		tipo_institucion: 'Salud privada',
		localidad_id: 9,
		localidad: mockLocalidades[8],
		descripcion:
			'Institución de salud privada en Salta con un fuerte compromiso social. Colaboramos con campañas de prevención y ofrecemos asistencia médica gratuita a sectores carenciados.',
		contactos: [
			{
				tipo_contacto: 'email',
				valor: 'responsabilidad.social@clinicasanjorge.com.ar',
				etiqueta: 'principal'
			}
		],
		consentimientos: [
			{
				id_consentimiento: 21,
				tipo: 'terminos',
				version: '1.0',
				created_at: new Date('2024-02-20')
			},
			{
				id_consentimiento: 22,
				tipo: 'privacidad',
				version: '1.0',
				created_at: new Date('2024-02-20')
			},
			{
				id_consentimiento: 23,
				tipo: 'evidencia',
				version: '1.0',
				created_at: new Date('2024-02-20')
			}
		]
	} satisfies Institucion,

	fundacion_siempre: {
		id_usuario: 10,
		username: 'fundacion_siempre',
		password: '123456',
		nombre: 'Gabriela',
		apellido: 'López',
		fecha_nacimiento: new Date('1980-04-12'),
		estado: 'activo',
		created_at: new Date('2024-03-10'),
		rol: 'institucion',
		url_foto: '/users/user-default.png',
		nombre_legal: 'Fundación Siempre',
		tipo_institucion: 'Fundación',
		localidad_id: 10,
		localidad: mockLocalidades[9],
		descripcion:
			'Somos una fundación en San Miguel de Tucumán dedicada al apoyo integral de adultos mayores. Promovemos su inclusión social, bienestar físico y emocional a través de diversas actividades recreativas.',
		contactos: [
			{
				tipo_contacto: 'email',
				valor: 'info@fundacionsiempre.org',
				etiqueta: 'principal'
			}
		],
		consentimientos: []
	} satisfies Institucion,

	comedor_los_pinos: {
		id_usuario: 11,
		username: 'comedor_los_pinos',
		password: '123456',
		nombre: 'Silvia',
		apellido: 'Pineda',
		fecha_nacimiento: new Date('1975-09-15'),
		estado: 'activo',
		created_at: new Date('2024-02-20'),
		rol: 'institucion',
		url_foto: '/users/user-default.png',
		nombre_legal: 'Comedor Los Pinos',
		tipo_institucion: 'Comedor',
		localidad_id: 11,
		localidad: mockLocalidades[10],
		descripcion:
			'Comedor comunitario en Corrientes Capital. Brindamos almuerzos y meriendas nutritivas a más de 100 niños diariamente, funcionando también como un centro de contención y apoyo escolar.',
		contactos: [
			{
				tipo_contacto: 'email',
				valor: 'contacto@comedoreslospinos.org',
				etiqueta: 'principal'
			}
		],
		consentimientos: []
	} satisfies Institucion,

	hospital_sanjose: {
		id_usuario: 12,
		username: 'hospital_sanjose',
		password: '123456',
		nombre: 'Ricardo',
		apellido: 'Martínez',
		fecha_nacimiento: new Date('1968-12-05'),
		estado: 'activo',
		created_at: new Date('2024-04-01'),
		rol: 'institucion',
		url_foto: '/users/user-default.png',
		nombre_legal: 'Hospital General San José',
		tipo_institucion: 'Hospital',
		localidad_id: 12,
		localidad: mockLocalidades[11],
		descripcion:
			'Hospital público en Posadas enfocado en la atención de emergencias y especialidades médicas. Nuestro compromiso es garantizar el acceso a la salud pública de calidad para todos los habitantes de la región.',
		contactos: [
			{
				tipo_contacto: 'email',
				valor: 'info@hospitalsanjose.org',
				etiqueta: 'principal'
			}
		],
		consentimientos: []
	} satisfies Institucion,

	instituto_formacion: {
		id_usuario: 13,
		username: 'instituto_formacion',
		password: '123456',
		nombre: 'Patricia',
		apellido: 'Suárez',
		fecha_nacimiento: new Date('1972-07-22'),
		estado: 'activo',
		created_at: new Date('2024-05-01'),
		rol: 'institucion',
		url_foto: '/users/user-default.png',
		nombre_legal: 'Instituto de Formación Laboral',
		tipo_institucion: 'Instituto',
		localidad_id: 13,
		localidad: mockLocalidades[12],
		descripcion:
			'Centro educativo en Neuquén Capital dedicado a la capacitación técnica y profesional. Nuestro objetivo es mejorar la empleabilidad de jóvenes y adultos mediante cursos de oficios y habilidades digitales.',
		contactos: [
			{
				tipo_contacto: 'email',
				valor: 'info@institutoformacion.org',
				etiqueta: 'principal'
			}
		],
		consentimientos: []
	} satisfies Institucion,

	fundacion_calor: {
		id_usuario: 14,
		username: 'fundacion_calor',
		password: '123456',
		nombre: 'Esteban',
		apellido: 'Moreno',
		fecha_nacimiento: new Date('1978-10-30'),
		estado: 'activo',
		created_at: new Date('2024-06-01'),
		rol: 'institucion',
		url_foto: '/users/user-default.png',
		nombre_legal: 'Fundación Calor Humano',
		tipo_institucion: 'Fundación',
		localidad_id: 14,
		localidad: mockLocalidades[13],
		descripcion:
			'Organización en Bariloche que asiste a personas en situación de calle durante el invierno. Proveemos abrigo, alimentos calientes y un espacio seguro para quienes más lo necesitan.',
		contactos: [
			{
				tipo_contacto: 'email',
				valor: 'info@fundacioncalor.org',
				etiqueta: 'principal'
			}
		],
		consentimientos: []
	} satisfies Institucion,

	hogar_santa_teresa: {
		id_usuario: 15,
		username: 'hogar_santa_teresa',
		password: '123456',
		nombre: 'Teresa',
		apellido: 'Giménez',
		fecha_nacimiento: new Date('1962-03-18'),
		estado: 'activo',
		created_at: new Date('2024-07-01'),
		rol: 'institucion',
		url_foto: '/users/user-default.png',
		nombre_legal: 'Hogar Santa Teresa',
		tipo_institucion: 'Hogar',
		localidad_id: 15,
		localidad: mockLocalidades[14],
		descripcion:
			'Hogar de tránsito en Tandil para mujeres y niños víctimas de violencia. Ofrecemos refugio, contención psicológica y asesoramiento legal para acompañarlas en su proceso de recuperación.',
		contactos: [
			{
				tipo_contacto: 'email',
				valor: 'info@hogarsantateresa.org',
				etiqueta: 'principal'
			}
		],
		consentimientos: []
	} satisfies Institucion,

	refugio_patitas: {
		id_usuario: 16,
		username: 'refugio_patitas',
		password: '123456',
		nombre: 'Clara',
		apellido: 'Benitez',
		fecha_nacimiento: new Date('1990-01-20'),
		estado: 'activo',
		created_at: new Date('2024-08-01'),
		rol: 'institucion',
		url_foto: '/users/user-default.png',
		nombre_legal: 'Asociación Civil Refugio Patitas',
		tipo_institucion: 'Protección Animal',
		localidad_id: 4,
		localidad: mockLocalidades[3],
		descripcion:
			'Refugio de animales en Rosario. Nos dedicamos al rescate, rehabilitación y adopción responsable de perros y gatos abandonados. ¡Ayúdanos a encontrarles un hogar lleno de amor!',
		contactos: [
			{
				tipo_contacto: 'email',
				valor: 'adopciones@patitasfelices.org.ar',
				etiqueta: 'principal'
			}
		],
		consentimientos: []
	} satisfies Institucion,

	ecologistas_cordoba: {
		id_usuario: 17,
		username: 'ecologistas_cba',
		password: '123456',
		nombre: 'Lucas',
		apellido: 'Serrano',
		fecha_nacimiento: new Date('1985-05-05'),
		estado: 'activo',
		created_at: new Date('2024-08-10'),
		rol: 'institucion',
		url_foto: '/users/user-default.png',
		nombre_legal: 'Ecologistas Unidos de Córdoba',
		tipo_institucion: 'Medio Ambiente',
		localidad_id: 5,
		localidad: mockLocalidades[4],
		descripcion:
			'Agrupación ambientalista en Córdoba Capital. Trabajamos en la preservación de bosques nativos, reciclaje y educación ambiental para construir un futuro más verde y sostenible.',
		contactos: [
			{
				tipo_contacto: 'email',
				valor: 'info@ecologistas.org.ar',
				etiqueta: 'principal'
			}
		],
		consentimientos: []
	} satisfies Institucion,

	biblioteca_barrial: {
		id_usuario: 18,
		username: 'biblioread',
		password: '123456',
		nombre: 'Marta',
		apellido: 'Quiroga',
		fecha_nacimiento: new Date('1960-12-01'),
		estado: 'activo',
		created_at: new Date('2024-08-15'),
		rol: 'institucion',
		url_foto: '/users/user-default.png',
		nombre_legal: 'Biblioteca Popular El Saber',
		tipo_institucion: 'Biblioteca',
		localidad_id: 1,
		localidad: mockLocalidades[0],
		descripcion:
			'Centro cultural y biblioteca en Buenos Aires. Un punto de encuentro para vecinos donde fomentamos la lectura, el arte y la cultura barrial mediante talleres y eventos gratuitos.',
		contactos: [
			{
				tipo_contacto: 'email',
				valor: 'contacto@bibliotecasaber.org.ar',
				etiqueta: 'principal'
			}
		],
		consentimientos: []
	} satisfies Institucion,

	fundacion_esperanza_fallida: {
		// creé esta institución que tiene verificación documental "rechazada" para pruebas
		id_usuario: 19,
		username: 'fundacion_fail',
		password: '123456',
		nombre: 'Carlos',
		apellido: 'Díaz',
		fecha_nacimiento: new Date('1980-05-15'),
		estado: 'activo',
		created_at: new Date('2024-09-01'),
		rol: 'institucion',
		url_foto: '/users/user-default.png',
		nombre_legal: 'Fundación Esperanza Fallida',
		tipo_institucion: 'Fundación',
		localidad_id: 3,
		localidad: mockLocalidades[2],
		descripcion:
			'Fundación en proceso de reestructuración en Mendoza. Nuestro foco está en proyectos de innovación social, aunque actualmente estamos revisando nuestros procesos para servir mejor a la comunidad.',
		contactos: [
			{
				tipo_contacto: 'email',
				valor: 'contacto@esperanzafallida.org',
				etiqueta: 'principal'
			}
		],
		consentimientos: []
	} satisfies Institucion,

	ong_nuevo_horizonte: {
		// creé esta institución que tiene verificación documental "pendiente" para pruebas
		id_usuario: 20,
		username: 'ong_horizonte',
		password: '123456',
		nombre: 'Laura',
		apellido: 'Gómez',
		fecha_nacimiento: new Date('1985-11-20'),
		estado: 'activo',
		created_at: new Date('2024-09-10'),
		rol: 'institucion',
		url_foto: '/users/user-default.png',
		nombre_legal: 'ONG Nuevo Horizonte',
		tipo_institucion: 'ONG',
		localidad_id: 7,
		localidad: mockLocalidades[6],
		descripcion:
			'Organización no gubernamental en Mendoza enfocada en el desarrollo comunitario sostenible. Impulsamos proyectos de emprendedurismo y capacitación para empoderar a los líderes del mañana.',
		contactos: [
			{
				tipo_contacto: 'email',
				valor: 'info@nuevohorizonte.org',
				etiqueta: 'principal'
			}
		],
		consentimientos: []
	} satisfies Institucion,

	rotary_club: {
		id_usuario: 21,
		username: 'rotary_club',
		password: '123456',
		nombre: 'Juan',
		apellido: 'Pérez',
		fecha_nacimiento: new Date('1960-02-23'),
		estado: 'activo',
		created_at: new Date('2024-01-10'),
		rol: 'colaborador',
		url_foto: '/instituciones/rotary.png',
		tipo_colaborador: 'organizacion',
		razon_social: 'Rotary Club de Buenos Aires',
		con_fines_de_lucro: false,
		localidad_id: 1, // Buenos Aires
		localidad: mockLocalidades[0],
		descripcion:
			'Organización internacional dedicada a la prestación de servicios humanitarios, la promoción de normas éticas y la contribución al desarrollo de la buena voluntad y la paz en el mundo. Enfoque en liderazgo, educación y salud.',
		contactos: [
			{ tipo_contacto: 'email', valor: 'contacto@rotaryinnovacion.org', etiqueta: 'principal' },
			{ tipo_contacto: 'web', valor: 'https://www.rotary.org', etiqueta: 'oficial' }
		],
		tipos_participacion_preferidas: [{ descripcion: 'Voluntariado' }, { descripcion: 'Monetaria' }],
		consentimientos: [
			{
				id_consentimiento: 24,
				tipo: 'terminos',
				version: '1.0',
				created_at: new Date('2024-01-10')
			}
		]
	} satisfies Organizacion,

	unicef_arg: {
		id_usuario: 22,
		username: 'unicef_arg',
		password: '123456',
		nombre: 'Ana',
		apellido: 'García',
		fecha_nacimiento: new Date('1946-12-11'),
		estado: 'activo',
		created_at: new Date('2024-01-12'),
		rol: 'colaborador',
		url_foto: '/instituciones/unicef.png',
		tipo_colaborador: 'organizacion',
		razon_social: 'UNICEF Argentina',
		con_fines_de_lucro: false,
		localidad_id: 1, // Buenos Aires
		localidad: mockLocalidades[0],
		descripcion:
			'Fondo de las Naciones Unidas para la Infancia. Trabajamos para defender los derechos de los niños y niñas, ayudando a cubrir sus necesidades básicas y ampliando sus oportunidades para alcanzar su pleno potencial.',
		contactos: [
			{ tipo_contacto: 'email', valor: 'contacto@unicef.org.ar', etiqueta: 'principal' },
			{ tipo_contacto: 'web', valor: 'https://www.unicef.org/argentina', etiqueta: 'oficial' }
		],
		tipos_participacion_preferidas: [{ descripcion: 'Monetaria' }, { descripcion: 'Especie' }],
		consentimientos: [
			{
				id_consentimiento: 25,
				tipo: 'terminos',
				version: '1.0',
				created_at: new Date('2024-01-12')
			}
		]
	} satisfies Organizacion,

	cruz_roja_arg: {
		id_usuario: 23,
		username: 'cruz_roja_arg',
		password: '123456',
		nombre: 'Carlos',
		apellido: 'Saavedra',
		fecha_nacimiento: new Date('1880-06-10'),
		estado: 'activo',
		created_at: new Date('2024-01-15'),
		rol: 'colaborador',
		url_foto: '/instituciones/cruz-roja.png',
		tipo_colaborador: 'organizacion',
		razon_social: 'Cruz Roja Argentina',
		con_fines_de_lucro: false,
		localidad_id: 1, // Buenos Aires
		localidad: mockLocalidades[0],
		descripcion:
			'Asociación civil humanitaria y voluntaria. Nuestra misión es contribuir a mejorar la vida de las personas, en especial de aquellas que se encuentran en situación de vulnerabilidad, impulsando acciones humanitarias.',
		contactos: [
			{ tipo_contacto: 'email', valor: 'info@cruzroja.org.ar', etiqueta: 'principal' },
			{ tipo_contacto: 'telefono', valor: '0810 999 2222', etiqueta: 'atención' }
		],
		tipos_participacion_preferidas: [{ descripcion: 'Voluntariado' }, { descripcion: 'Monetaria' }],
		consentimientos: [
			{
				id_consentimiento: 26,
				tipo: 'terminos',
				version: '1.0',
				created_at: new Date('2024-01-15')
			}
		]
	} satisfies Organizacion
} as const;

export type MockUsuarios = typeof mockUsuarios;
