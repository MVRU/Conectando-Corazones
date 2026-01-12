import type { Evidencia } from '$lib/types/Evidencia';
import type { Archivo } from '$lib/types/Archivo';

// ============================================================================
// ARCHIVOS (EVIDENCIAS) - Organizados por proyecto y tipo
// ============================================================================

// --- PROYECTO 1: "Un libro, un sueño" (Escuela Esperanza - id: 2) ---
// Objetivos: 20 libros (especie), 10 docentes (voluntariado)

export const mockArchivos: Archivo[] = [
	// === EVIDENCIAS DE ENTRADA - Colaboradores donando ===
	
	//  Donación de 5 libros infantiles
	{
		id_archivo: 1,
		descripcion: 'Comprobante de donación de 5 libros infantiles',
		url: 'https://drive.google.com/file/d/1z0OY07s5lmRh3rVzU16KPeA_KEELEPfJ/view?usp=sharing',
		tipo_mime: 'application/pdf',
		tamaño: 245760, // ~240 KB
		created_at: new Date('2025-03-15'),
		usuario_id: 4, 
		evidencia_id: 1
	},
	{
		id_archivo: 2,
		descripcion: 'Fotografía de los libros donados por María',
		url: 'https://drive.google.com/file/d/1l0ltnQ3Ll8hIqObKDiGpNGV9r9JsCMdG/view?usp=sharing',
		tipo_mime: 'image/jpeg',
		tamaño: 1024000, // ~1 MB
		created_at: new Date('2025-03-15'),
		usuario_id: 4, 
		evidencia_id: 1
	},

	// Donación de 7 libros infantiles
	{
		id_archivo: 3,
		descripcion: 'Recibo de donación de 7 libros infantiles de aventuras y cuentos',
		url: 'https://drive.google.com/file/d/1z0OY07s5lmRh3rVzU16KPeA_KEELEPfJ/view',
		tipo_mime: 'application/pdf',
		tamaño: 307200, // ~300 KB
		created_at: new Date('2025-03-20'),
		usuario_id: 5, 
		evidencia_id: 2
	},

	// === EVIDENCIAS DE SALIDA - Institución mostrando recepción y uso ===
	
	//  Recepción de libros y armado de biblioteca
	{
		id_archivo: 4,
		descripcion: 'Fotografía de la biblioteca escolar armada con los libros recibidos',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto1%2Ffoto_biblioteca_armada.jpg?alt=media',
		tipo_mime: 'image/jpeg',
		tamaño: 1536000, // ~1.5 MB
		created_at: new Date('2025-04-10'),
		usuario_id: 2, 
		evidencia_id: 3
	},
	{
		id_archivo: 5,
		descripcion: 'Registro y catálogo de libros recibidos',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto1%2Fregistro_libros_recibidos.xlsx?alt=media',
		tipo_mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		tamaño: 51200, // ~50 KB
		created_at: new Date('2025-04-10'),
		usuario_id: 2, 
		evidencia_id: 3
	},

	// EVIDENCIAS DE ENTRADA - Voluntariado docente 
	
	{
		id_archivo: 6,
		descripcion: 'Selfie de Ana Martínez confirmando su participación como docente voluntaria',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto1%2Fselfie_ana_martinez.jpg?alt=media',
		tipo_mime: 'image/jpeg',
		created_at: new Date('2025-03-18'),
		usuario_id: 8, 
		evidencia_id: 4
	},
	{
		id_archivo: 7,
		descripcion: 'Selfie de María González confirmando su participación como docente voluntaria',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto1%2Fselfie_maria_gonzalez.jpg?alt=media',
		tipo_mime: 'image/jpeg',
		created_at: new Date('2025-03-20'),
		usuario_id: 4, // María González - colaborador
		evidencia_id: 4
	},
	{
		id_archivo: 8,
		descripcion: 'Selfie de Patricia Morales confirmando su participación como docente voluntaria',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto1%2Fselfie_patricia_morales.jpg?alt=media',
		tipo_mime: 'image/jpeg',
		created_at: new Date('2025-03-22'),
		usuario_id: 6, // Patricia Morales (Fundación Manos Unidas) - colaborador
		evidencia_id: 4
	},

	//  EVIDENCIAS DE SALIDA - Docentes trabajando en el taller 
	
	{
		id_archivo: 9,
		descripcion: 'Fotografía de las docentes voluntarias trabajando en el taller de lectura',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto1%2Ffoto_docentes_taller_lectura.jpg?alt=media',
		tipo_mime: 'image/jpeg',
		created_at: new Date('2025-04-15'),
		usuario_id: 2, // Escuela Esperanza - institución
		evidencia_id: 5
	},

	// --- PROYECTO 4: "Equipamiento Médico Hospitalario" (Hospital Central - id: 9) ---
	// Objetivo: $500,000 ARS (donación monetaria)

	// EVIDENCIAS DE ENTRADA - Colaboradores donando dinero 

	{
		id_archivo: 10,
		descripcion: 'Comprobante de transferencia bancaria por $50,000',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto4%2Ftransferencia_bancaria_carlos_50mil.pdf?alt=media',
		tipo_mime: 'application/pdf',
		tamaño: 184320, // ~180 KB
		created_at: new Date('2025-04-15'),
		usuario_id: 7,
		evidencia_id: 5
	},

	{
		id_archivo: 11,
		descripcion: 'Comprobante de donación por MercadoPago - $50,000',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto4%2Fcomprobante_donacion_mercadopago.pdf?alt=media',
		tipo_mime: 'application/pdf',
		tamaño: 163840, // ~160 KB
		created_at: new Date('2025-04-20'),
		usuario_id: 8, 
		evidencia_id: 6
	},

	// === EVIDENCIAS DE SALIDA - Hospital mostrando compra de equipamiento ===
	
	//  Compra e instalación de equipamiento
	{
		id_archivo: 12,
		descripcion: 'Factura de compra de equipamiento médico para sala de urgencias',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto4%2Ffactura_compra_equipamiento_medico.pdf?alt=media',
		tipo_mime: 'application/pdf',
		tamaño: 409600, // ~400 KB
		created_at: new Date('2025-05-10'),
		usuario_id: 9, 
		evidencia_id: 7
	},
	{
		id_archivo: 13,
		descripcion: 'Fotografía del equipamiento médico instalado en sala de urgencias',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto4%2Ffoto_equipamiento_instalado.jpg?alt=media',
		tipo_mime: 'image/jpeg',
		tamaño: 2048000, // ~2 MB
		created_at: new Date('2025-05-15'),
		usuario_id: 9, 
		evidencia_id: 7
	},
	{
		id_archivo: 14,
		descripcion: 'Acta de recepción y conformidad del equipamiento',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto4%2Facta_recepcion_equipamiento.pdf?alt=media',
		tipo_mime: 'application/pdf',
		created_at: new Date('2025-05-15'),
		usuario_id: 9, 
		evidencia_id: 7
	},

	// --- PROYECTO 9: "Luz para aprender" (Escuela Esperanza - id: 2) ---
	// Objetivos: 100 metros de cableado, 20 luminarias LED, 30 personas capacitadas
	

	// === EVIDENCIAS DE ENTRADA - 
	
	// - Donación de materiales eléctricos (cables)
	{
		id_archivo: 15,
		descripcion: 'Fotografías del cableado eléctrico antiguo deteriorado',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto9%2Ffoto_cableado_viejo.jpg?alt=media',
		tipo_mime: 'image/jpeg',
		created_at: new Date('2025-03-01'),
		usuario_id: 10, 
		evidencia_id: 8
	},
	{
		id_archivo: 16,
		descripcion: 'Factura de compra de 100 metros de cable eléctrico',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto9%2Ffactura_compra_cables.pdf?alt=media',
		tipo_mime: 'application/pdf',
		created_at: new Date('2025-03-05'),
		usuario_id: 10, 
		evidencia_id: 8
	},

	//  Donación de luminarias LED
	{
		id_archivo: 17,
		descripcion: 'Fotografías de las luminarias LED donadas (embaladas)',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto9%2Ffoto_lamparas_nuevas_embaladas.jpg?alt=media',
		tipo_mime: 'image/jpeg',
		created_at: new Date('2025-03-10'),
		usuario_id: 4, 
		evidencia_id: 9
	},
	{
		id_archivo: 18,
		descripcion: 'Comprobante de donación de 20 luminarias LED',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto9%2Fcomprobante_donacion_lamparas.pdf?alt=media',
		tipo_mime: 'application/pdf',
		created_at: new Date('2025-03-10'),
		usuario_id: 4, 
		evidencia_id: 9
	},

	// === EVIDENCIAS DE SALIDA - Institución mostrando instalación ===
	
	// Escuela Esperanza (id: 2) - Instalación del nuevo cableado
	{
		id_archivo: 19,
		descripcion: 'Fotografías del nuevo cableado eléctrico instalado en las aulas',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto9%2Ffoto_cableado_nuevo_instalado.jpg?alt=media',
		tipo_mime: 'image/jpeg',
		created_at: new Date('2025-04-20'),
		usuario_id: 2, // Escuela Esperanza - institución
		evidencia_id: 10
	},
	{
		id_archivo: 20,
		descripcion: 'Certificado de electricista matriculado - instalación conforme',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto9%2Fcertificado_electricista_instalacion.pdf?alt=media',
		tipo_mime: 'application/pdf',
		created_at: new Date('2025-04-25'),
		usuario_id: 2, // Escuela Esperanza - institución
		evidencia_id: 10
	},

	// Escuela Esperanza (id: 2) - Instalación de luminarias LED
	{
		id_archivo: 21,
		descripcion: 'Fotografías de las luminarias LED instaladas en aulas y pasillos',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto9%2Ffoto_lamparas_instaladas.jpg?alt=media',
		tipo_mime: 'image/jpeg',
		created_at: new Date('2025-05-10'),
		usuario_id: 2, // Escuela Esperanza - institución
		evidencia_id: 11
	},
	{
		id_archivo: 22,
		descripcion: 'Video recorriendo las instalaciones con la nueva iluminación',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto9%2Fvideo_recorrido_iluminacion.mp4?alt=media',
		tipo_mime: 'video/mp4',
		created_at: new Date('2025-05-10'),
		usuario_id: 2, // Escuela Esperanza - institución
		evidencia_id: 11
	},

	// --- PROYECTO 22: "Apoyo escolar en contraturno" (Escuela Esperanza) ---
	
	// Evidencia 13: Docentes voluntarios confirmándose (ENTRADA)
	{
		id_archivo: 23,
		descripcion: 'Formulario de inscripción de docentes voluntarios',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto22%2Fformulario_docentes.pdf?alt=media',
		tipo_mime: 'application/pdf',
		created_at: new Date('2025-09-22'),
		usuario_id: 4, // Colaborador
		evidencia_id: 13
	},
	{
		id_archivo: 24,
		descripcion: 'Fotografía de reunión inicial con docentes voluntarios',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto22%2Freunion_docentes.jpg?alt=media',
		tipo_mime: 'image/jpeg',
		created_at: new Date('2025-09-22'),
		usuario_id: 4, // Colaborador
		evidencia_id: 13
	},

	// Evidencia 14: Clases de apoyo en marcha (SALIDA)
	{
		id_archivo: 25,
		descripcion: 'Fotografía de clases de apoyo escolar en marcha',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto22%2Fclases_apoyo.jpg?alt=media',
		tipo_mime: 'image/jpeg',
		created_at: new Date('2025-10-15'),
		usuario_id: 2, // Escuela Esperanza - institución
		evidencia_id: 14
	},
	{
		id_archivo: 26,
		descripcion: 'Registro de asistencia de estudiantes a clases de apoyo',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto22%2Fregistro_asistencia.pdf?alt=media',
		tipo_mime: 'application/pdf',
		created_at: new Date('2025-10-15'),
		usuario_id: 2, // Escuela Esperanza - institución
		evidencia_id: 14
	},

	// Evidencia 15: Donación de útiles escolares (ENTRADA)
	{
		id_archivo: 27,
		descripcion: 'Comprobante de donación de útiles escolares',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto22%2Fcomprobante_utiles.pdf?alt=media',
		tipo_mime: 'application/pdf',
		created_at: new Date('2025-10-05'),
		usuario_id: 5, // Colaborador
		evidencia_id: 15
	},
	{
		id_archivo: 28,
		descripcion: 'Fotografía de los útiles escolares donados',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto22%2Ffoto_utiles_donados.jpg?alt=media',
		tipo_mime: 'image/jpeg',
		created_at: new Date('2025-10-05'),
		usuario_id: 5, // Colaborador
		evidencia_id: 15
	},

	// Evidencia 16: Útiles escolares en uso (SALIDA)
	{
		id_archivo: 29,
		descripcion: 'Fotografía de estudiantes utilizando los útiles escolares',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto22%2Festudiantes_con_utiles.jpg?alt=media',
		tipo_mime: 'image/jpeg',
		created_at: new Date('2025-11-10'),
		usuario_id: 2, // Escuela Esperanza - institución
		evidencia_id: 16
	},
	{
		id_archivo: 30,
		descripcion: 'Acta de entrega de útiles escolares a estudiantes',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto22%2Facta_entrega_utiles.pdf?alt=media',
		tipo_mime: 'application/pdf',
		created_at: new Date('2025-11-10'),
		usuario_id: 2, // Escuela Esperanza - institución
		evidencia_id: 16
	}
];

// ============================================================================
// EVIDENCIAS 
// ============================================================================

export const mockEvidencias: Evidencia[] = [
	// --- PROYECTO 1: "Un libro, un sueño" ---
	
	// Evidencia 1: Donación de libros (ENTRADA - colaborador)
	{
		id_evidencia: 1,
		tipo_evidencia: 'entrada',
		created_at: new Date('2025-03-15'),
		archivos_ids: [1, 2],
		id_participacion_permitida: 1, // 20 libros (especie)
		archivos: [mockArchivos[0], mockArchivos[1]],
		participacion_permitida: {
			id_participacion_permitida: 1,
			id_proyecto: 1,
			id_tipo_participacion: 1,
			unidad_medida: 'unidades',
			especie: 'libros',
			objetivo: 20,
			actual: 12,
			tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
		}
	},

	// Evidencia 2: Donación de libros (ENTRADA - colaborador)
	{
		id_evidencia: 2,
		tipo_evidencia: 'entrada',
		created_at: new Date('2025-03-20'),
		archivos_ids: [3],
		id_participacion_permitida: 1, // 20 libros (especie)
		archivos: [mockArchivos[2]],
		participacion_permitida: {
			id_participacion_permitida: 1,
			id_proyecto: 1,
			id_tipo_participacion: 1,
			unidad_medida: 'unidades',
			especie: 'libros',
			objetivo: 20,
			actual: 12,
			tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
		}
	},

	// Evidencia 3: Recepción y catalogación de libros (SALIDA - institución)
	{
		id_evidencia: 3,
		tipo_evidencia: 'salida',
		created_at: new Date('2025-04-10'),
		archivos_ids: [4, 5],
		id_participacion_permitida: 1, // 20 libros (especie)
		archivos: [mockArchivos[3], mockArchivos[4]],
		participacion_permitida: {
			id_participacion_permitida: 1,
			id_proyecto: 1,
			id_tipo_participacion: 1,
			unidad_medida: 'unidades',
			especie: 'libros',
			objetivo: 20,
			actual: 12,
			tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
		}
	},

	// Evidencia 4: Inscripción de docentes voluntarias (ENTRADA - colaboradores)
	{
		id_evidencia: 4,
		tipo_evidencia: 'entrada',
		created_at: new Date('2025-03-18'),
		archivos_ids: [6, 7, 8],
		id_participacion_permitida: 2, // 10 docentes voluntarios
		archivos: [mockArchivos[5], mockArchivos[6], mockArchivos[7]],
		participacion_permitida: {
			id_participacion_permitida: 2,
			id_proyecto: 1,
			id_tipo_participacion: 1,
			unidad_medida: 'docentes',
			objetivo: 10,
			actual: 2,
			tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Voluntariado' }
		}
	},

	// Evidencia 5: Docentes trabajando en taller (SALIDA - institución)
	{
		id_evidencia: 5,
		tipo_evidencia: 'salida',
		created_at: new Date('2025-04-15'),
		archivos_ids: [9],
		id_participacion_permitida: 2, // 10 docentes voluntarios
		archivos: [mockArchivos[8]],
		participacion_permitida: {
			id_participacion_permitida: 2,
			id_proyecto: 1,
			id_tipo_participacion: 1,
			unidad_medida: 'docentes',
			objetivo: 10,
			actual: 2,
			tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Voluntariado' }
		}
	},

	// --- PROYECTO 4: "Equipamiento Médico Hospitalario" ---
	
	// Evidencia 6: Donación monetaria 
	{
		id_evidencia: 6,
		tipo_evidencia: 'entrada',
		created_at: new Date('2025-04-15'),
		archivos_ids: [8],
		id_participacion_permitida: 4, // $500,000 ARS (monetaria)
		archivos: [mockArchivos[7]],
		participacion_permitida: {
			id_participacion_permitida: 4,
			id_proyecto: 4,
			id_tipo_participacion: 1,
			unidad_medida: 'ARS',
			objetivo: 500000,
			actual: 100000,
			tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Monetaria' }
		}
	},

	// Evidencia 7: Donación monetaria 
	{
		id_evidencia: 7,
		tipo_evidencia: 'entrada',
		created_at: new Date('2025-04-20'),
		archivos_ids: [11],
		id_participacion_permitida: 4, // $500,000 ARS (monetaria)
		archivos: [mockArchivos[10]],
		participacion_permitida: {
			id_participacion_permitida: 4,
			id_proyecto: 4,
			id_tipo_participacion: 1,
			unidad_medida: 'ARS',
			objetivo: 500000,
			actual: 100000,
			tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Monetaria' }
		}
	},

	// Evidencia 8: Compra de equipamiento médico (SALIDA - institución)
	{
		id_evidencia: 8,
		tipo_evidencia: 'salida',
		created_at: new Date('2025-05-10'),
		archivos_ids: [12, 13, 14],
		id_participacion_permitida: 4, 
		archivos: [mockArchivos[11], mockArchivos[12], mockArchivos[13]],
		participacion_permitida: {
			id_participacion_permitida: 4,
			id_proyecto: 4,
			id_tipo_participacion: 1,
			unidad_medida: 'ARS',
			objetivo: 500000,
			actual: 100000,
			tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Monetaria' }
		}
	},

	// --- PROYECTO 9: "Luz para aprender" ---
	
	// Evidencia 9: Donación de cableado eléctrico 
	{
		id_evidencia: 9,
		tipo_evidencia: 'entrada',
		created_at: new Date('2025-03-01'),
		archivos_ids: [15, 16],
		id_participacion_permitida: 8, 
		archivos: [mockArchivos[14], mockArchivos[15]],
		participacion_permitida: {
			id_participacion_permitida: 8,
			id_proyecto: 9,
			id_tipo_participacion: 1,
			unidad_medida: 'metros',
			objetivo: 100,
			actual: 100,
			tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
		}
	},

	// Evidencia 10: Donación de luminarias LED 
	{
		id_evidencia: 10,
		tipo_evidencia: 'entrada',
		created_at: new Date('2025-03-10'),
		archivos_ids: [17, 18],
		id_participacion_permitida: 9, 
		archivos: [mockArchivos[16], mockArchivos[17]],
		participacion_permitida: {
			id_participacion_permitida: 9,
			id_proyecto: 9,
			id_tipo_participacion: 1,
			unidad_medida: 'unidades',
			objetivo: 20,
			actual: 20,
			tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
		}
	},

	// Evidencia 11: Instalación del nuevo cableado (SALIDA - institución)
	{
		id_evidencia: 11,
		tipo_evidencia: 'salida',
		created_at: new Date('2025-04-20'),
		archivos_ids: [19, 20],
		id_participacion_permitida: 8, 
		archivos: [mockArchivos[18], mockArchivos[19]],
		participacion_permitida: {
			id_participacion_permitida: 8,
			id_proyecto: 9,
			id_tipo_participacion: 1,
			unidad_medida: 'metros',
			objetivo: 100,
			actual: 100,
			tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
		}
	},

	// Evidencia 12: Instalación de luminarias LED (SALIDA - institución)
	{
		id_evidencia: 12,
		tipo_evidencia: 'salida',
		created_at: new Date('2025-05-10'),
		archivos_ids: [21, 22],
		id_participacion_permitida: 9, 
		archivos: [mockArchivos[20], mockArchivos[21]],
		participacion_permitida: {
			id_participacion_permitida: 9,
			id_proyecto: 9,
			id_tipo_participacion: 1,
			unidad_medida: 'unidades',
			objetivo: 20,
			actual: 20,
			tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
		}
	},

	// --- PROYECTO 22: "Apoyo escolar en contraturno" (Escuela Esperanza - id: 2) ---

	// Evidencia 13: Docentes voluntarios confirmándose (ENTRADA - colaboradores)
	{
		id_evidencia: 13,
		tipo_evidencia: 'entrada',
		created_at: new Date('2025-09-22'),
		archivos_ids: [23, 24],
		id_participacion_permitida: 36,
		archivos: [mockArchivos[22], mockArchivos[23]],
		participacion_permitida: {
			id_participacion_permitida: 36,
			id_proyecto: 22,
			id_tipo_participacion: 1,
			unidad_medida: 'docentes voluntarios',
			objetivo: 5,
			actual: 5,
			tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Voluntariado' }
		}
	},

	// Evidencia 14: Clases de apoyo en marcha (SALIDA - institución)
	{
		id_evidencia: 14,
		tipo_evidencia: 'salida',
		created_at: new Date('2025-10-15'),
		archivos_ids: [25, 26],
		id_participacion_permitida: 36,
		archivos: [mockArchivos[24], mockArchivos[25]],
		participacion_permitida: {
			id_participacion_permitida: 36,
			id_proyecto: 22,
			id_tipo_participacion: 1,
			unidad_medida: 'docentes voluntarios',
			objetivo: 5,
			actual: 5,
			tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Voluntariado' }
		}
	},

	// Evidencia 15: Donación de útiles escolares (ENTRADA - colaboradores)
	{
		id_evidencia: 15,
		tipo_evidencia: 'entrada',
		created_at: new Date('2025-10-05'),
		archivos_ids: [27, 28],
		id_participacion_permitida: 37,
		archivos: [mockArchivos[26], mockArchivos[27]],
		participacion_permitida: {
			id_participacion_permitida: 37,
			id_proyecto: 22,
			id_tipo_participacion: 1,
			unidad_medida: 'unidades',
			especie: 'útiles escolares',
			objetivo: 40,
			actual: 38,
			tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
		}
	},

	// Evidencia 16: Útiles escolares en uso (SALIDA - institución)
	{
		id_evidencia: 16,
		tipo_evidencia: 'salida',
		created_at: new Date('2025-11-10'),
		archivos_ids: [29, 30],
		id_participacion_permitida: 37,
		archivos: [mockArchivos[28], mockArchivos[29]],
		participacion_permitida: {
			id_participacion_permitida: 37,
			id_proyecto: 22,
			id_tipo_participacion: 1,
			unidad_medida: 'unidades',
			especie: 'útiles escolares',
			objetivo: 40,
			actual: 38,
			tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
		}
	}
];
