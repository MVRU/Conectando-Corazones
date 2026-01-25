import type { Evidencia } from '$lib/domain/types/Evidencia';
import type { Archivo } from '$lib/domain/types/Archivo';

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
		nombre_original: 'comprobante_donacion_libros_maria.pdf',
		descripcion: 'Comprobante de donación de 5 libros infantiles',
		url: 'https://drive.google.com/file/d/1z0OY07s5lmRh3rVzU16KPeA_KEELEPfJ/view?usp=sharing',
		tipo_mime: 'application/pdf',
		tamanio_bytes: 245760, // ~240 KB
		created_at: new Date('2025-03-15'),
		usuario_id: 4,
		evidencia_id: 1
	},
	{
		id_archivo: 2,
		nombre_original: 'foto_libros_donados_maria.jpg',
		descripcion: 'Fotografía de los libros donados por María',
		url: 'https://drive.google.com/file/d/1l0ltnQ3Ll8hIqObKDiGpNGV9r9JsCMdG/view?usp=sharing',
		tipo_mime: 'image/jpeg',
		tamanio_bytes: 1024000, // ~1 MB
		created_at: new Date('2025-03-15'),
		usuario_id: 4,
		evidencia_id: 1
	},

	// Donación de 7 libros infantiles
	{
		id_archivo: 3,
		nombre_original: 'recibo_donacion_libros_luis.pdf',
		descripcion: 'Recibo de donación de 7 libros infantiles de aventuras y cuentos',
		url: 'https://drive.google.com/file/d/1z0OY07s5lmRh3rVzU16KPeA_KEELEPfJ/view',
		tipo_mime: 'application/pdf',
		tamanio_bytes: 307200, // ~300 KB
		created_at: new Date('2025-03-20'),
		usuario_id: 5,
		evidencia_id: 2
	},

	// === EVIDENCIAS DE SALIDA - Institución mostrando recepción y uso ===

	//  Recepción de libros y armado de biblioteca
	{
		id_archivo: 4,
		nombre_original: 'foto_biblioteca_armada.jpg',
		descripcion: 'Fotografía de la biblioteca escolar armada con los libros recibidos',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto1%2Ffoto_biblioteca_armada.jpg?alt=media',
		tipo_mime: 'image/jpeg',
		tamanio_bytes: 1536000, // ~1.5 MB
		created_at: new Date('2025-04-10'),
		usuario_id: 2,
		evidencia_id: 3
	},
	{
		id_archivo: 5,
		nombre_original: 'registro_libros_recibidos.xlsx',
		descripcion: 'Registro y catálogo de libros recibidos',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto1%2Fregistro_libros_recibidos.xlsx?alt=media',
		tipo_mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		tamanio_bytes: 51200, // ~50 KB
		created_at: new Date('2025-04-10'),
		usuario_id: 2,
		evidencia_id: 3
	},

	// EVIDENCIAS DE ENTRADA - Voluntariado docente

	{
		id_archivo: 6,
		nombre_original: 'selfie_ana_martinez.jpg',
		descripcion: 'Selfie de Ana Martínez confirmando su participación como docente voluntaria',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto1%2Fselfie_ana_martinez.jpg?alt=media',
		tipo_mime: 'image/jpeg',
		created_at: new Date('2025-03-18'),
		usuario_id: 8,
		evidencia_id: 4
	},
	{
		id_archivo: 7,
		nombre_original: 'selfie_maria_gonzalez.jpg',
		descripcion: 'Selfie de María González confirmando su participación como docente voluntaria',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto1%2Fselfie_maria_gonzalez.jpg?alt=media',
		tipo_mime: 'image/jpeg',
		created_at: new Date('2025-03-20'),
		usuario_id: 4, // María González - colaborador
		evidencia_id: 4
	},
	{
		id_archivo: 8,
		nombre_original: 'selfie_patricia_morales.jpg',
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
		nombre_original: 'foto_docentes_taller_lectura.jpg',
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
		nombre_original: 'transferencia_bancaria_carlos_50mil.pdf',
		descripcion: 'Comprobante de transferencia bancaria por $50,000',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto4%2Ftransferencia_bancaria_carlos_50mil.pdf?alt=media',
		tipo_mime: 'application/pdf',
		tamanio_bytes: 184320, // ~180 KB
		created_at: new Date('2025-04-15'),
		usuario_id: 7,
		evidencia_id: 6
	},

	{
		id_archivo: 11,
		nombre_original: 'comprobante_donacion_mercadopago.pdf',
		descripcion: 'Comprobante de donación por MercadoPago - $50,000',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto4%2Fcomprobante_donacion_mercadopago.pdf?alt=media',
		tipo_mime: 'application/pdf',
		tamanio_bytes: 163840, // ~160 KB
		created_at: new Date('2025-04-20'),
		usuario_id: 8,
		evidencia_id: 6
	},

	// === EVIDENCIAS DE SALIDA - Hospital mostrando compra de equipamiento ===

	//  Compra e instalación de equipamiento
	{
		id_archivo: 12,
		nombre_original: 'factura_compra_equipamiento_medico.pdf',
		descripcion: 'Factura de compra de equipamiento médico para sala de urgencias',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto4%2Ffactura_compra_equipamiento_medico.pdf?alt=media',
		tipo_mime: 'application/pdf',
		tamanio_bytes: 409600, // ~400 KB
		created_at: new Date('2025-05-10'),
		usuario_id: 9,
		evidencia_id: 8 // Corrected to 8
	},
	{
		id_archivo: 13,
		nombre_original: 'foto_equipamiento_instalado.jpg',
		descripcion: 'Fotografía del equipamiento médico instalado en sala de urgencias',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto4%2Ffoto_equipamiento_instalado.jpg?alt=media',
		tipo_mime: 'image/jpeg',
		tamanio_bytes: 2048000, // ~2 MB
		created_at: new Date('2025-05-15'),
		usuario_id: 9,
		evidencia_id: 8
	},
	{
		id_archivo: 14,
		nombre_original: 'acta_recepcion_equipamiento.pdf',
		descripcion: 'Acta de recepción y conformidad del equipamiento',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto4%2Facta_recepcion_equipamiento.pdf?alt=media',
		tipo_mime: 'application/pdf',
		created_at: new Date('2025-05-15'),
		usuario_id: 9,
		evidencia_id: 8
	},

	// --- PROYECTO 9: "Biblioteca Digital Comunitaria" ---
	// Objetivos: 500 libros (especie), $50,000 (monetaria)

	// === EVIDENCIAS DE ENTRADA ===

	// - Donación de licencias de libros (ID 15, 16)
	{
		id_archivo: 15,
		nombre_original: 'comprobante_licencias_libros.pdf',
		descripcion: 'Comprobante de compra/donación de licencias de 50 ebooks',
		url: 'https://drive.google.com/file/d/stub_licencias_libros/view', // Mock URL
		tipo_mime: 'application/pdf',
		created_at: new Date('2025-03-01'),
		usuario_id: 10,
		evidencia_id: 9
	},
	{
		id_archivo: 16,
		nombre_original: 'lista_libros_cedidos.xlsx',
		descripcion: 'Listado de títulos de libros cedidos por editorial',
		url: 'https://drive.google.com/file/d/stub_lista_libros/view',
		tipo_mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		created_at: new Date('2025-03-05'),
		usuario_id: 10,
		evidencia_id: 9
	},

	//  Donación de dinero para servidor (ID 17, 18)
	{
		id_archivo: 17,
		nombre_original: 'comprobante_transferencia_servidor.pdf',
		descripcion: 'Comprobante de transferencia bancaria para compra de servidor',
		url: 'https://drive.google.com/file/d/stub_transferencia_servidor/view',
		tipo_mime: 'application/pdf',
		created_at: new Date('2025-03-10'),
		usuario_id: 4,
		evidencia_id: 10
	},
	{
		id_archivo: 18,
		nombre_original: 'carta_intencion_donacion.pdf',
		descripcion: 'Carta de intención de donación para infraestructura tecnológica',
		url: 'https://drive.google.com/file/d/stub_carta_donacion/view',
		tipo_mime: 'application/pdf',
		created_at: new Date('2025-03-10'),
		usuario_id: 4,
		evidencia_id: 10
	},

	// === EVIDENCIAS DE SALIDA - Institución mostrando resultados ===

	// Compra de servidor (ID 19, 20)
	{
		id_archivo: 19,
		nombre_original: 'factura_compra_servidor_nube.pdf',
		descripcion: 'Factura de servicio de hosting/servidor por 1 año',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto9%2Ffactura_servidor.pdf?alt=media',
		tipo_mime: 'application/pdf',
		created_at: new Date('2025-04-20'),
		usuario_id: 2, // Escuela Esperanza - institución
		evidencia_id: 11
	},
	{
		id_archivo: 20,
		nombre_original: 'configuracion_servidor_log.txt',
		descripcion: 'Log de configuración inicial del servidor de la biblioteca',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto9%2Fconfig_log.txt?alt=media',
		tipo_mime: 'text/plain',
		created_at: new Date('2025-04-25'),
		usuario_id: 2, // Escuela Esperanza - institución
		evidencia_id: 11
	},

	// Plataforma funcionando (ID 21, 22)
	{
		id_archivo: 21,
		nombre_original: 'captura_pantalla_biblioteca_home.png',
		descripcion: 'Captura de pantalla de la página de inicio de la biblioteca digital',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto9%2Fcaptura_home.png?alt=media',
		tipo_mime: 'image/png',
		created_at: new Date('2025-05-10'),
		usuario_id: 2, // Escuela Esperanza - institución
		evidencia_id: 12
	},
	{
		id_archivo: 22,
		nombre_original: 'video_demo_navegacion.mp4',
		descripcion: 'Video demostrativo de navegación por el catálogo de libros',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto9%2Fvideo_demo.mp4?alt=media',
		tipo_mime: 'video/mp4',
		created_at: new Date('2025-05-10'),
		usuario_id: 2, // Escuela Esperanza - institución
		evidencia_id: 12
	},

	// --- PROYECTO 22: "Apoyo escolar en contraturno" (Escuela Esperanza) ---

	// Evidencia 13: Docentes voluntarios confirmándose (ENTRADA)
	{
		id_archivo: 23,
		nombre_original: 'formulario_docentes.pdf',
		descripcion: 'Formulario de inscripción de docentes voluntarios',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto22%2Fformulario_docentes.pdf?alt=media',
		tipo_mime: 'application/pdf',
		created_at: new Date('2025-09-22'),
		usuario_id: 4, // Colaborador
		evidencia_id: 13
	},
	{
		id_archivo: 24,
		nombre_original: 'reunion_docentes.jpg',
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
		nombre_original: 'clases_apoyo.jpg',
		descripcion: 'Fotografía de clases de apoyo escolar en marcha',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto22%2Fclases_apoyo.jpg?alt=media',
		tipo_mime: 'image/jpeg',
		created_at: new Date('2025-10-15'),
		usuario_id: 2, // Escuela Esperanza - institución
		evidencia_id: 14
	},
	{
		id_archivo: 26,
		nombre_original: 'registro_asistencia.pdf',
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
		nombre_original: 'comprobante_utiles.pdf',
		descripcion: 'Comprobante de donación de útiles escolares',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto22%2Fcomprobante_utiles.pdf?alt=media',
		tipo_mime: 'application/pdf',
		created_at: new Date('2025-10-05'),
		usuario_id: 5, // Colaborador
		evidencia_id: 15
	},
	{
		id_archivo: 28,
		nombre_original: 'foto_utiles_donados.jpg',
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
		nombre_original: 'estudiantes_con_utiles.jpg',
		descripcion: 'Fotografía de estudiantes utilizando los útiles escolares',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto22%2Festudiantes_con_utiles.jpg?alt=media',
		tipo_mime: 'image/jpeg',
		created_at: new Date('2025-11-10'),
		usuario_id: 2, // Escuela Esperanza - institución
		evidencia_id: 16
	},
	{
		id_archivo: 30,
		nombre_original: 'acta_entrega_utiles.pdf',
		descripcion: 'Acta de entrega de útiles escolares a estudiantes',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto22%2Facta_entrega_utiles.pdf?alt=media',
		tipo_mime: 'application/pdf',
		created_at: new Date('2025-11-10'),
		usuario_id: 2, // Escuela Esperanza - institución
		evidencia_id: 16
	},

	// --- PROYECTO 15: "Mochilas Solidarias"

	// === EVIDENCIAS DE ENTRADA - Donación de mochilas ===
	{
		id_archivo: 31,
		nombre_original: 'comprobante_donacion_mochilas_30.pdf',
		descripcion: 'Comprobante de donación de 30 mochilas escolares',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto15%2Fcomprobante_donacion_mochilas_30.pdf?alt=media',
		tipo_mime: 'application/pdf',
		tamanio_bytes: 256000, // ~250 KB
		created_at: new Date('2026-02-01'),
		usuario_id: 4, // Colaborador - María González
		evidencia_id: 17
	},
	{
		id_archivo: 32,
		nombre_original: 'foto_mochilas_donadas_30.jpg',
		descripcion: 'Fotografía de las 30 mochilas donadas (embaladas)',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto15%2Ffoto_mochilas_donadas_30.jpg?alt=media',
		tipo_mime: 'image/jpeg',
		tamanio_bytes: 1843200, // ~1.8 MB
		created_at: new Date('2026-02-01'),
		usuario_id: 4, // Colaborador - María González
		evidencia_id: 17
	},

	{
		id_archivo: 33,
		nombre_original: 'comprobante_donacion_mochilas_20.pdf',
		descripcion: 'Comprobante de donación de 20 mochilas escolares',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto15%2Fcomprobante_donacion_mochilas_20.pdf?alt=media',
		tipo_mime: 'application/pdf',
		tamanio_bytes: 230400, // ~225 KB
		created_at: new Date('2026-02-08'),
		usuario_id: 5, // Colaborador - Luis Martínez
		evidencia_id: 18
	},
	{
		id_archivo: 34,
		nombre_original: 'foto_mochilas_donadas_20.jpg',
		descripcion: 'Fotografía de las 20 mochilas donadas con etiquetas',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto15%2Ffoto_mochilas_donadas_20.jpg?alt=media',
		tipo_mime: 'image/jpeg',
		tamanio_bytes: 1536000, // ~1.5 MB
		created_at: new Date('2026-02-08'),
		usuario_id: 5, // Colaborador - Luis Martínez
		evidencia_id: 18
	},

	// === EVIDENCIAS DE SALIDA - Recepción y distribución de mochilas ===

	{
		id_archivo: 35,
		nombre_original: 'acta_recepcion_mochilas.pdf',
		descripcion: 'Acta de recepción de las 50 mochilas en depósito escolar',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto15%2Facta_recepcion_mochilas.pdf?alt=media',
		tipo_mime: 'application/pdf',
		tamanio_bytes: 307200, // ~300 KB
		created_at: new Date('2026-02-20'),
		usuario_id: 2, // Escuela Esperanza - institución
		evidencia_id: 19
	},
	{
		id_archivo: 36,
		nombre_original: 'foto_mochilas_deposito.jpg',
		descripcion: 'Fotografía de las mochilas almacenadas en la escuela',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto15%2Ffoto_mochilas_deposito.jpg?alt=media',
		tipo_mime: 'image/jpeg',
		tamanio_bytes: 2048000, // ~2 MB
		created_at: new Date('2026-02-20'),
		usuario_id: 2, // Escuela Esperanza - institución
		evidencia_id: 19
	},
	{
		id_archivo: 37,
		nombre_original: 'foto_entrega_mochilas_alumnos.jpg',
		descripcion: 'Fotografía del acto de entrega de mochilas a los estudiantes',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto15%2Ffoto_entrega_mochilas_alumnos.jpg?alt=media',
		tipo_mime: 'image/jpeg',
		tamanio_bytes: 2457600, // ~2.4 MB
		created_at: new Date('2026-02-25'),
		usuario_id: 2, // Escuela Esperanza - institución
		evidencia_id: 19
	},

	// === EVIDENCIAS DE ENTRADA - Donación de sets de útiles ===

	{
		id_archivo: 38,
		nombre_original: 'factura_compra_utiles_50.pdf',
		descripcion: 'Factura de compra de 50 sets de útiles escolares completos',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto15%2Ffactura_compra_utiles_50.pdf?alt=media',
		tipo_mime: 'application/pdf',
		tamanio_bytes: 358400, // ~350 KB
		created_at: new Date('2026-02-10'),
		usuario_id: 7, // Colaborador - Carlos Rodríguez
		evidencia_id: 20
	},
	{
		id_archivo: 39,
		nombre_original: 'foto_utiles_embalados.jpg',
		descripcion: 'Fotografía de los 50 sets de útiles escolares (embalados por tipo)',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto15%2Ffoto_utiles_embalados.jpg?alt=media',
		tipo_mime: 'image/jpeg',
		tamanio_bytes: 1945600, // ~1.9 MB
		created_at: new Date('2026-02-10'),
		usuario_id: 7, // Colaborador - Carlos Rodríguez
		evidencia_id: 20
	},
	{
		id_archivo: 40,
		nombre_original: 'detalle_contenido_set_utiles.pdf',
		descripcion: 'Detalle del contenido de cada set de útiles escolares',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto15%2Fdetalle_contenido_set_utiles.pdf?alt=media',
		tipo_mime: 'application/pdf',
		tamanio_bytes: 204800, // ~200 KB
		created_at: new Date('2026-02-10'),
		usuario_id: 7, // Colaborador - Carlos Rodríguez
		evidencia_id: 20
	},

	// === EVIDENCIAS DE SALIDA - Recepción y distribución de sets de útiles ===

	{
		id_archivo: 41,
		nombre_original: 'acta_recepcion_utiles.pdf',
		descripcion: 'Acta de recepción de los 50 sets de útiles en la escuela',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto15%2Facta_recepcion_utiles.pdf?alt=media',
		tipo_mime: 'application/pdf',
		tamanio_bytes: 281600, // ~275 KB
		created_at: new Date('2026-02-22'),
		usuario_id: 2, // Escuela Esperanza - institución
		evidencia_id: 21
	},
	{
		id_archivo: 42,
		nombre_original: 'foto_utiles_organizados.jpg',
		descripcion: 'Fotografía de los sets de útiles organizados para entrega',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto15%2Ffoto_utiles_organizados.jpg?alt=media',
		tipo_mime: 'image/jpeg',
		tamanio_bytes: 1740800, // ~1.7 MB
		created_at: new Date('2026-02-22'),
		usuario_id: 2, // Escuela Esperanza - institución
		evidencia_id: 21
	},
	{
		id_archivo: 43,
		nombre_original: 'foto_ninos_recibiendo_kits.jpg',
		descripcion: 'Fotografía de niños recibiendo sus kits escolares completos',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto15%2Ffoto_ninos_recibiendo_kits.jpg?alt=media',
		tipo_mime: 'image/jpeg',
		tamanio_bytes: 2252800, // ~2.2 MB
		created_at: new Date('2026-02-28'),
		usuario_id: 2, // Escuela Esperanza - institución
		evidencia_id: 21
	},
	{
		id_archivo: 44,
		nombre_original: 'listado_beneficiarios_firmas.pdf',
		descripcion: 'Listado de estudiantes beneficiarios con firma de padres',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto15%2Flistado_beneficiarios_firmas.pdf?alt=media',
		tipo_mime: 'application/pdf',
		tamanio_bytes: 409600, // ~400 KB
		created_at: new Date('2026-02-28'),
		usuario_id: 2, // Escuela Esperanza - institución
		evidencia_id: 21
	},

	// --- PROYECTO 2: "Comedores con alma" ---

	// Evidencia 22: Voluntariado (ENTRADA)
	{
		id_archivo: 45,
		nombre_original: 'lista_voluntarios_comedor.pdf',
		descripcion: 'Lista de voluntarios inscritos para el turno noche',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto2%2Flista_voluntarios.pdf?alt=media',
		tipo_mime: 'application/pdf',
		tamanio_bytes: 102400,
		created_at: new Date('2025-06-15'),
		usuario_id: 8, // Ana Martínez - colaborador
		evidencia_id: 22
	},
	// Evidencia 23: Voluntariado en acción (SALIDA)
	{
		id_archivo: 46,
		nombre_original: 'foto_voluntarios_cocinando.jpg',
		descripcion: 'Voluntarios preparando la cena en el comedor',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto2%2Fvoluntarios_cocinando.jpg?alt=media',
		tipo_mime: 'image/jpeg',
		tamanio_bytes: 2048000,
		created_at: new Date('2025-06-20'),
		usuario_id: 11, // Comedor Los Pinos - institución
		evidencia_id: 23
	},
	// Evidencia 24: Donación de Harina (ENTRADA)
	{
		id_archivo: 47,
		nombre_original: 'comprobante_compra_harina.pdf',
		descripcion: 'Factura de compra de 100kg de harina 000',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto2%2Ffactura_harina.pdf?alt=media',
		tipo_mime: 'application/pdf',
		tamanio_bytes: 156000,
		created_at: new Date('2025-07-01'),
		usuario_id: 21, // Rotary Club - colaborador organizacion
		evidencia_id: 24
	},
	// Evidencia 25: Recepción de Harina (SALIDA)
	{
		id_archivo: 48,
		nombre_original: 'foto_sacos_harina.jpg',
		descripcion: 'Recepción de los sacos de harina en el depósito',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto2%2Fsacos_harina.jpg?alt=media',
		tipo_mime: 'image/jpeg',
		tamanio_bytes: 1800000,
		created_at: new Date('2025-07-05'),
		usuario_id: 11, // Comedor Los Pinos - institución
		evidencia_id: 25
	},

	// --- PROYECTO 7: "Ropa de Abrigo Invernal" ---

	// Evidencia 26: Donación de Abrigo (ENTRADA)
	{
		id_archivo: 49,
		nombre_original: 'foto_camperas_donadas.jpg',
		descripcion: 'Lote de 20 camperas de invierno recolectadas',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto7%2Fcamperas_donadas.jpg?alt=media',
		tipo_mime: 'image/jpeg',
		tamanio_bytes: 2500000,
		created_at: new Date('2025-05-10'),
		usuario_id: 4, // Maria Gonzalez - colaborador
		evidencia_id: 26
	},
	// Evidencia 27: Entrega de Abrigo (SALIDA)
	{
		id_archivo: 50,
		nombre_original: 'foto_entrega_abrigo.jpg',
		descripcion: 'Jornada de entrega de abrigo a personas en situación de calle',
		url: 'https://firebasestorage.googleapis.com/v0/b/conectando-corazones.appspot.com/o/evidencias%2Fproyecto7%2Fentrega_abrigo.jpg?alt=media',
		tipo_mime: 'image/jpeg',
		tamanio_bytes: 3100000,
		created_at: new Date('2025-05-20'),
		usuario_id: 14, // Fundacion Calor - institución
		evidencia_id: 27
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
	},

	// --- PROYECTO 15: "Mochilas Solidarias" (Escuela Esperanza - id: 2) ---

	// Evidencia 17: Donación de 30 mochilas (ENTRADA - colaborador)
	{
		id_evidencia: 17,
		tipo_evidencia: 'entrada',
		created_at: new Date('2026-02-01'),
		archivos_ids: [31, 32],
		id_participacion_permitida: 18, // 50 mochilas
		archivos: [mockArchivos[30], mockArchivos[31]],
		participacion_permitida: {
			id_participacion_permitida: 18,
			id_proyecto: 15,
			id_tipo_participacion: 1,
			unidad_medida: 'mochilas',
			objetivo: 50,
			actual: 50,
			tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
		}
	},

	// Evidencia 18: Donación de 20 mochilas (ENTRADA - colaborador)
	{
		id_evidencia: 18,
		tipo_evidencia: 'entrada',
		created_at: new Date('2026-02-08'),
		archivos_ids: [33, 34],
		id_participacion_permitida: 18, // 50 mochilas
		archivos: [mockArchivos[32], mockArchivos[33]],
		participacion_permitida: {
			id_participacion_permitida: 18,
			id_proyecto: 15,
			id_tipo_participacion: 1,
			unidad_medida: 'mochilas',
			objetivo: 50,
			actual: 50,
			tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
		}
	},

	// Evidencia 19: Recepción y distribución de mochilas (SALIDA - institución)
	{
		id_evidencia: 19,
		tipo_evidencia: 'salida',
		created_at: new Date('2026-02-20'),
		archivos_ids: [35, 36, 37],
		id_participacion_permitida: 18, // 50 mochilas
		archivos: [mockArchivos[34], mockArchivos[35], mockArchivos[36]],
		participacion_permitida: {
			id_participacion_permitida: 18,
			id_proyecto: 15,
			id_tipo_participacion: 1,
			unidad_medida: 'mochilas',
			objetivo: 50,
			actual: 50,
			tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
		}
	},

	// Evidencia 20: Donación de 50 sets de útiles (ENTRADA - colaborador)
	{
		id_evidencia: 20,
		tipo_evidencia: 'entrada',
		created_at: new Date('2026-02-10'),
		archivos_ids: [38, 39, 40],
		id_participacion_permitida: 29, // 50 sets de útiles
		archivos: [mockArchivos[37], mockArchivos[38], mockArchivos[39]],
		participacion_permitida: {
			id_participacion_permitida: 29,
			id_proyecto: 15,
			id_tipo_participacion: 1,
			unidad_medida: 'sets de útiles',
			objetivo: 50,
			actual: 50,
			tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
		}
	},

	// Evidencia 21: Recepción y distribución de sets de útiles (SALIDA - institución)
	{
		id_evidencia: 21,
		tipo_evidencia: 'salida',
		created_at: new Date('2026-02-22'),
		archivos_ids: [41, 42, 43, 44],
		id_participacion_permitida: 29, // 50 sets de útiles
		archivos: [mockArchivos[40], mockArchivos[41], mockArchivos[42], mockArchivos[43]],
		participacion_permitida: {
			id_participacion_permitida: 29,
			id_proyecto: 15,
			id_tipo_participacion: 1,
			unidad_medida: 'sets de útiles',
			objetivo: 50,
			actual: 50,
			tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
		}
	},

	// --- PROYECTO 2: "Comedores con alma" ---

	// Evidencia 22: Voluntariado (ENTRADA)
	{
		id_evidencia: 22,
		tipo_evidencia: 'entrada',
		created_at: new Date('2025-06-15'),
		archivos_ids: [45],
		id_participacion_permitida: 1, // Voluntariado (personas)
		archivos: [mockArchivos[44]],
		participacion_permitida: {
			id_participacion_permitida: 1,
			id_proyecto: 2,
			id_tipo_participacion: 1,
			unidad_medida: 'personas',
			objetivo: 30,
			actual: 18,
			tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Voluntariado' }
		}
	},
	// Evidencia 23: Voluntariado (SALIDA)
	{
		id_evidencia: 23,
		tipo_evidencia: 'salida',
		created_at: new Date('2025-06-20'),
		archivos_ids: [46],
		id_participacion_permitida: 1,
		archivos: [mockArchivos[45]],
		participacion_permitida: {
			id_participacion_permitida: 1,
			id_proyecto: 2,
			id_tipo_participacion: 1,
			unidad_medida: 'personas',
			objetivo: 30,
			actual: 18,
			tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Voluntariado' }
		}
	},
	// Evidencia 24: Harina (ENTRADA)
	{
		id_evidencia: 24,
		tipo_evidencia: 'entrada',
		created_at: new Date('2025-07-01'),
		archivos_ids: [47],
		id_participacion_permitida: 2, // Harina (kg)
		archivos: [mockArchivos[46]],
		participacion_permitida: {
			id_participacion_permitida: 2,
			id_proyecto: 2,
			id_tipo_participacion: 2,
			unidad_medida: 'kg',
			especie: 'de harina',
			objetivo: 10,
			actual: 15,
			tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
		}
	},
	// Evidencia 25: Harina (SALIDA)
	{
		id_evidencia: 25,
		tipo_evidencia: 'salida',
		created_at: new Date('2025-07-05'),
		archivos_ids: [48],
		id_participacion_permitida: 2,
		archivos: [mockArchivos[47]],
		participacion_permitida: {
			id_participacion_permitida: 2,
			id_proyecto: 2,
			id_tipo_participacion: 2,
			unidad_medida: 'kg',
			especie: 'de harina',
			objetivo: 10,
			actual: 15,
			tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
		}
	},

	// --- PROYECTO 7: "Ropa de Abrigo Invernal" ---

	// Evidencia 26: Abrigo (ENTRADA)
	{
		id_evidencia: 26,
		tipo_evidencia: 'entrada',
		created_at: new Date('2025-05-10'),
		archivos_ids: [49],
		id_participacion_permitida: 7, // Abrigo (unidades)
		archivos: [mockArchivos[48]],
		participacion_permitida: {
			id_participacion_permitida: 7,
			id_proyecto: 7,
			id_tipo_participacion: 1,
			unidad_medida: 'unidades',
			especie: 'abrigo',
			objetivo: 50,
			actual: 50, // Assuming target reached for this batch
			tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
		}
	},
	// Evidencia 27: Abrigo (SALIDA)
	{
		id_evidencia: 27,
		tipo_evidencia: 'salida',
		created_at: new Date('2025-05-20'),
		archivos_ids: [50],
		id_participacion_permitida: 7,
		archivos: [mockArchivos[49]],
		participacion_permitida: {
			id_participacion_permitida: 7,
			id_proyecto: 7,
			id_tipo_participacion: 1,
			unidad_medida: 'unidades',
			especie: 'abrigo',
			objetivo: 50,
			actual: 50,
			tipo_participacion: { id_tipo_participacion: 1, descripcion: 'Especie' }
		}
	}
];
