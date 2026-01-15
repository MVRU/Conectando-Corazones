// TODO: corregir direcciones por ubicaciones

import type { Administrador, Institucion, Organizacion, Unipersonal } from '$lib/types/Usuario';

import { getLocalidad } from '$lib/utils/util-ubicaciones';

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

		contactos: [
			{ tipo_contacto: 'email', valor: 'direccion@escuelaesperanza.edu.ar', etiqueta: 'principal' },
			{
				tipo_contacto: 'email',
				valor: 'direccion2@escuelaesperanza.edu.ar',
				etiqueta: 'secundario'
			},
			{ tipo_contacto: 'telefono', valor: '341 XXXXXXX', etiqueta: 'celular' }
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
		contactos: [
			{
				tipo_contacto: 'email',
				valor: 'maria.gonzalez@gmail.com',
				etiqueta: 'principal'
			}
		],
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

		contactos: [{ tipo_contacto: 'email', valor: 'info@bploslibros.org', etiqueta: 'principal' }],

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

		contactos: [
			{ tipo_contacto: 'email', valor: 'contacto@manosunidas.org.ar', etiqueta: 'principal' }
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

		contactos: [
			{
				tipo_contacto: 'email',
				valor: 'rse@empresasolidaria.com.ar',
				etiqueta: 'principal'
			}
		],

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
		contactos: [
			{
				tipo_contacto: 'email',
				valor: 'ana.martinez@outlook.com',
				etiqueta: 'principal'
			}
		],
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
		contactos: [
			{
				tipo_contacto: 'email',
				valor: 'contacto@bibliotecasaber.org.ar',
				etiqueta: 'principal'
			}
		],
		consentimientos: []
	} satisfies Institucion,

	fundacion_esperanza_fallida: { // creé esta institución que tiene verificación documental "rechazada" para pruebas
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
		contactos: [
			{
				tipo_contacto: 'email',
				valor: 'contacto@esperanzafallida.org',
				etiqueta: 'principal'
			}
		],
		consentimientos: []
	} satisfies Institucion,

	ong_nuevo_horizonte: { // creé esta institución que tiene verificación documental "pendiente" para pruebas
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
		contactos: [
			{
				tipo_contacto: 'email',
				valor: 'info@nuevohorizonte.org',
				etiqueta: 'principal'
			}
		],
		consentimientos: []
	} satisfies Institucion
} as const;

export type MockUsuarios = typeof mockUsuarios;
