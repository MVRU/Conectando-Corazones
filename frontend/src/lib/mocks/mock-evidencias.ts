import type { Evidencia } from '$lib/types/Evidencia';
import type { Archivo } from '$lib/types/Archivo';

// Mock de archivos asociados a evidencias
export const mockArchivos: Archivo[] = [
	// Archivos para evidencia 1 (Proyecto "Un libro, un sueño" - Objetivo: libros)
	{
		id_archivo: 1,
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto1%2Flibros-recibidos-foto1.jpg?alt=media&token=a1b2c3d4-e5f6-7890-abcd-ef1234567890',
		descripcion: 'Foto de libros donados',
		tipo_mime: 'image/jpeg',
		created_at: new Date('2025-09-15'),
		usuario_id: 2,
		evidencia_id: 1,
		proyecto_id: 1
	},
	{
		id_archivo: 2,
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto1%2Flibros-recibidos-foto2.jpg?alt=media&token=b2c3d4e5-f6a7-8901-bcde-f2345678901a',
		descripcion: 'Foto de clasificación de libros',
		tipo_mime: 'image/jpeg',
		created_at: new Date('2025-09-15'),
		usuario_id: 2,
		evidencia_id: 1,
		proyecto_id: 1
	},
	{
		id_archivo: 3,
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto1%2Fcomprobante-donacion.pdf?alt=media&token=c3d4e5f6-a7b8-9012-cdef-34567890123b',
		descripcion: 'Comprobante de donación firmado',
		tipo_mime: 'application/pdf',
		created_at: new Date('2025-09-15'),
		usuario_id: 2,
		evidencia_id: 1,
		proyecto_id: 1
	},

	// Archivos para evidencia 2 (Proyecto "Un libro, un sueño" - Objetivo: docentes)
	{
		id_archivo: 4,
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto1%2Fplanilla-docentes.xlsx?alt=media&token=d4e5f6a7-b8c9-0123-def0-45678901234c',
		descripcion: 'Planilla de asistencia de docentes voluntarios',
		tipo_mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		created_at: new Date('2025-10-05'),
		usuario_id: 2,
		evidencia_id: 2,
		proyecto_id: 1
	},
	{
		id_archivo: 5,
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto1%2Ffoto-taller.jpg?alt=media&token=e5f6a7b8-c9d0-1234-ef01-56789012345d',
		descripcion: 'Foto del taller de lectura',
		tipo_mime: 'image/jpeg',
		created_at: new Date('2025-10-05'),
		usuario_id: 2,
		evidencia_id: 2,
		proyecto_id: 1
	},

	// Archivos para evidencia 3 (Proyecto "Comedores con alma" - Objetivo: personas)
	{
		id_archivo: 6,
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto2%2Fregistro-voluntarios.pdf?alt=media&token=f6a7b8c9-d0e1-2345-f012-67890123456e',
		descripcion: 'Registro de voluntarios con firmas',
		tipo_mime: 'application/pdf',
		created_at: new Date('2025-08-20'),
		usuario_id: 11,
		evidencia_id: 3,
		proyecto_id: 2
	},
	{
		id_archivo: 7,
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto2%2Ffoto-grupo-voluntarios.jpg?alt=media&token=a7b8c9d0-e1f2-3456-0123-78901234567f',
		descripcion: 'Foto grupal de voluntarios',
		tipo_mime: 'image/jpeg',
		created_at: new Date('2025-08-20'),
		usuario_id: 11,
		evidencia_id: 3,
		proyecto_id: 2
	},

	// Archivos para evidencia 4 (Proyecto "Comedores con alma" - Objetivo: harina)
	{
		id_archivo: 8,
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto2%2Ffactura-harina-001.pdf?alt=media&token=b8c9d0e1-f2a3-4567-1234-89012345678a',
		descripcion: 'Factura de compra de harina - Proveedor A',
		tipo_mime: 'application/pdf',
		created_at: new Date('2025-09-10'),
		usuario_id: 11,
		evidencia_id: 4,
		proyecto_id: 2
	},
	{
		id_archivo: 9,
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto2%2Ffactura-harina-002.pdf?alt=media&token=c9d0e1f2-a3b4-5678-2345-90123456789b',
		descripcion: 'Factura de compra de harina - Proveedor B',
		tipo_mime: 'application/pdf',
		created_at: new Date('2025-09-25'),
		usuario_id: 11,
		evidencia_id: 4,
		proyecto_id: 2
	},
	{
		id_archivo: 10,
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto2%2Ffoto-almacenamiento.jpg?alt=media&token=d0e1f2a3-b4c5-6789-3456-01234567890c',
		descripcion: 'Foto del depósito con mercadería',
		tipo_mime: 'image/jpeg',
		created_at: new Date('2025-09-25'),
		usuario_id: 11,
		evidencia_id: 4,
		proyecto_id: 2
	},

	// Archivos para evidencia 5 (Proyecto "Comedores con alma" - Objetivo: huevos)
	{
		id_archivo: 11,
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto2%2Fticket-huevos.jpg?alt=media&token=e1f2a3b4-c5d6-7890-4567-12345678901d',
		descripcion: 'Ticket de compra de huevos',
		tipo_mime: 'image/jpeg',
		created_at: new Date('2025-10-01'),
		usuario_id: 11,
		evidencia_id: 5,
		proyecto_id: 2
	},

	// Archivos para evidencia 6 (Proyecto "Hogar de sonrisas")
	{
		id_archivo: 12,
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto3%2Fregistro-asistencia.xlsx?alt=media&token=f2a3b4c5-d6e7-8901-5678-23456789012e',
		descripcion: 'Registro de asistencia de voluntarios',
		tipo_mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		created_at: new Date('2025-03-15'),
		usuario_id: 3,
		evidencia_id: 6,
		proyecto_id: 3
	},
	{
		id_archivo: 13,
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto3%2Ffotos-actividades.jpg?alt=media&token=a3b4c5d6-e7f8-9012-6789-34567890123f',
		descripcion: 'Fotos de actividades con los niños',
		tipo_mime: 'image/jpeg',
		created_at: new Date('2025-03-15'),
		usuario_id: 3,
		evidencia_id: 6,
		proyecto_id: 3
	},
	{
		id_archivo: 14,
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto3%2Finforme-mensual.pdf?alt=media&token=b4c5d6e7-f8a9-0123-7890-45678901234a',
		descripcion: 'Informe mensual de actividades',
		tipo_mime: 'application/pdf',
		created_at: new Date('2025-03-15'),
		usuario_id: 3,
		evidencia_id: 6,
		proyecto_id: 3
	}
];

// Mock de evidencias
export const mockEvidencias: Evidencia[] = [
	// Evidencias para Proyecto 1: "Un libro, un sueño"
	{
		id_evidencia: 1,
		created_at: new Date('2025-09-15'),
		archivos_ids: [1, 2, 3],
		archivos: mockArchivos.filter((a) => [1, 2, 3].includes(a.id_archivo!)),
		id_participacion_permitida: 1,
		participacion_permitida: {
			id_participacion_permitida: 1,
			id_proyecto: 1,
			id_tipo_participacion: 1,
			unidad_medida: 'libros',
			objetivo: 20,
			actual: 12,
			tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
		},
		id_proyecto: 1
	},
	{
		id_evidencia: 2,
		created_at: new Date('2025-10-05'),
		archivos_ids: [4, 5],
		archivos: mockArchivos.filter((a) => [4, 5].includes(a.id_archivo!)),
		id_participacion_permitida: 2,
		participacion_permitida: {
			id_participacion_permitida: 2,
			id_proyecto: 1,
			id_tipo_participacion: 1,
			unidad_medida: 'docentes',
			objetivo: 10,
			actual: 2,
			tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Voluntariado' }
		},
		id_proyecto: 1
	},

	// Evidencias para Proyecto 2: "Comedores con alma"
	{
		id_evidencia: 3,
		created_at: new Date('2025-08-20'),
		archivos_ids: [6, 7],
		archivos: mockArchivos.filter((a) => [6, 7].includes(a.id_archivo!)),
		id_participacion_permitida: 1,
		participacion_permitida: {
			id_participacion_permitida: 1,
			id_proyecto: 2,
			id_tipo_participacion: 1,
			unidad_medida: 'personas',
			objetivo: 30,
			actual: 18,
			tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Voluntariado' }
		},
		id_proyecto: 2
	},
	{
		id_evidencia: 4,
		created_at: new Date('2025-09-25'),
		archivos_ids: [8, 9, 10],
		archivos: mockArchivos.filter((a) => [8, 9, 10].includes(a.id_archivo!)),
		id_participacion_permitida: 2,
		participacion_permitida: {
			id_participacion_permitida: 2,
			id_proyecto: 2,
			id_tipo_participacion: 2,
			unidad_medida: 'kg de harina',
			objetivo: 10,
			actual: 15,
			tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
		},
		id_proyecto: 2
	},
	{
		id_evidencia: 5,
		created_at: new Date('2025-10-01'),
		archivos_ids: [11],
		archivos: mockArchivos.filter((a) => [11].includes(a.id_archivo!)),
		id_participacion_permitida: 3,
		participacion_permitida: {
			id_participacion_permitida: 3,
			id_proyecto: 2,
			id_tipo_participacion: 3,
			unidad_medida: 'docenas de huevos',
			objetivo: 6,
			actual: 3,
			tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
		},
		id_proyecto: 2
	},

	// Evidencias para Proyecto 3: "Hogar de sonrisas"
	{
		id_evidencia: 6,
		created_at: new Date('2025-03-15'),
		archivos_ids: [12, 13, 14],
		archivos: mockArchivos.filter((a) => [12, 13, 14].includes(a.id_archivo!)),
		id_participacion_permitida: 3,
		participacion_permitida: {
			id_participacion_permitida: 3,
			id_proyecto: 3,
			id_tipo_participacion: 1,
			unidad_medida: 'personas',
			objetivo: 10,
			actual: 7,
			tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Voluntariado' }
		},
		id_proyecto: 3
	}
];
