// -*- DECISIÓN DE DISEÑO: Centralizamos el mock de datos para facilitar reemplazos por peticiones reales.
import {
	Bell,
	Briefcase,
	Gauge,
	LayoutGrid,
	Lightbulb,
	LogOut,
	MessageSquare,
	Plus,
	ShieldCheck,
	TrendingUp,	
	Users
} from 'lucide-svelte';

import type {
        AidType,
        ChatItem,
        ChatMetadataMap,
        ChatThread,
        ActiveCollaborator,
        InstitutionIdentity,
        Metric,
        NavItem,
        ObservationItem,
        ProgressSegment,
        ProjectItem,
        CollaborationRequest,
        ReportingStatus,
        VerificationDocument,
        VerificationSummary,
        ViewMode,
        EvidenceUploadContext,
        ProjectClosureSummary
} from './types';
import { ERROR_COLOR, GREEN, PRIMARY_500, WARNING_COLOR } from './tokens';

export const metrics: Metric[] = [
	{ label: 'Proyectos totales', value: '1', icon: Briefcase, color: PRIMARY_500 },
	{ label: 'Colaboradores totales', value: '0', icon: Users, color: WARNING_COLOR },
	{ label: 'Próx. Finalización', value: '20 días', icon: Gauge, color: ERROR_COLOR }
];

export const navItems: NavItem[] = [
	{ label: 'Mi panel', icon: LayoutGrid, view: 'dashboard' },
	{ label: 'Proyectos', icon: Briefcase, view: 'projects' },
	{ label: 'Mensajes', icon: MessageSquare, view: 'chat' },
	{ label: 'Verificación', icon: ShieldCheck, view: 'profile' }
];

export const quickActionLabels: string[] = [
	'Ver solicitudes',
	'Cargar evidencia',
	'Mis proyectos',
	'Mis chats',
	'Ver progresos',
	'Solicitar cierre'
];

export const chatItems: ChatItem[] = [
	{
		id: 1,
		name: 'Luz para Aprender',
		lastMessage: 'Pendiente de aprobación del presupuesto.',
		time: 'Hace 5m',
		statusColor: ERROR_COLOR,
		isUnread: true
	},
	{
		id: 2,
		name: 'Patio de Colores',
		lastMessage: 'Borrador',
		time: 'Hace 2h',
		statusColor: PRIMARY_500,
		isUnread: false
	}
];

export const chatThreads: ChatThread[] = [
	{
		chatId: 1,
		subject: 'Luz para Aprender',
		messages: [
			{
				id: 101,
				author: 'Mariano Ponce',
				organization: 'Lumina Cooperativa · Empresa',
				role: 'Colaborador',
				content:
					'¡Un gusto, Patricia! Desde Lumina Cooperativa confirmamos la donación de los cables y soportes. Estarán listos para retirar el miércoles por la mañana.',
				sentAt: '2025-11-03T08:30:00-03:00',
				direction: 'incoming',
				avatar: '/users/lumina-cooperativa.svg'
			},
			{
				id: 102,
				author: 'Clara Medina',
				organization: 'Sembrar Futuro · ONG',
				role: 'Colaborador',
				content:
					'Buenos días, nosotros enviaremos las lámparas LED mañana. Son de bajo consumo y larga duración. Les comparto el comprobante de entrega apenas salga el envío!',
				sentAt: '2025-11-03T08:41:00-03:00',
				direction: 'incoming',
				avatar: '/users/sembrar-futuro.svg'
			},
			{
				id: 103,
				author: 'Lucas Ferreyra',
				organization: 'Estudiante UTN FRRo',
				role: 'Colaborador',
				content:
					'Con Sofía podemos pasar el viernes a la escuela para comenzar la instalación. Si todo está en condiciones, en un día dejamos las tres aulas listas.',
				sentAt: '2025-11-03T08:45:00-03:00',
				direction: 'incoming',
				avatar: null
			},
			{
				id: 104,
				author: 'Sofía Mansilla',
				organization: 'Estudiante UTN FRRo',
				role: 'Colaborador',
				content:
					'Sí, y podemos registrar fotos del antes y después para subir como evidencia al sistema. Así queda trazado todo el proceso!',
				sentAt: '2025-11-03T08:47:00-03:00',
				direction: 'incoming',
				avatar: null
			},
			{
				id: 105,
				author: 'Patricia González',
				organization: 'Escuela Esperanza',
				role: 'Institución',
				content:
					'Mil gracias a todos. ❤️ Los chicos van a estar felices. Apenas finalicen los trabajos, validamos el proyecto en la plataforma.',
				sentAt: '2025-11-03T08:50:00-03:00',
				direction: 'outgoing',
				avatar: '/users/escuela-esperanza.jpg'
			}
		]
	},
	{
		chatId: 2,
		subject: 'Patio de Colores',
		messages: [
			{
				id: 201,
				author: 'Conectando Corazones',
				organization: 'Sistema',
				role: 'Colaborador',
				content:
					'¡Este proyecto es un borrador! Recordá completarlo antes de compartirlo con tus contactos.',
				sentAt: '2025-11-10T15:12:00-03:00',
				direction: 'incoming',
				avatar: '/users/admin-default.png'
			}
		]
	}
];

export const projectItems: ProjectItem[] = [
        {
                id: 1,
                name: 'Luz para Aprender',
                status: 'En Curso',
                date: '23/11/2025',
                statusColor: GREEN
        },
	{
		id: 2,
		name: 'Patio de Colores',
		status: 'Borrador',
		date: '25/11/2025',
		statusColor: PRIMARY_500
	}
];

export const evidenceUploadContext: EvidenceUploadContext = {
        projectName: 'Luz para Aprender',
        uploadingEntity: 'Patricia González · Escuela Esperanza',
        instructions:
                'Subí la evidencia de salida para confirmar el cierre del proyecto. Asegurate de que los archivos sean legibles y estén completos.',
        maxFileSizeMB: 25,
        allowedFormats: ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'docx', 'xlsx', 'zip'],
        entryEvidence: {
                id: 'entrada-comprobante-transferencia',
                fileName: 'comprobante_transferencia.pdf',
                fileExtension: 'pdf',
                mimeType: 'application/pdf',
                description: 'Comprobante de transferencia para iniciar la compra de lámparas LED.',
                uploadedAt: '2025-11-03T09:20:00-03:00',
                evidenceFlow: 'entrada',
                uploadedBy: 'Clara Medina · Sembrar Futuro',
                previewUrl: '/evidencias/comprobante_transferencia.pdf',
                previewImageUrl: '/evidencias/comprobante_transferencia.webp',
                previewImageAlt:
                        'Recibo bancario firmado que certifica la transferencia realizada para la compra de lámparas LED.'
        }
};


export const projectClosureSummary: ProjectClosureSummary = {
        projectName: 'Luz para Aprender',
        readinessLabel: 'Los 4 colaboradores validaron las evidencias finales.',
        progressPercent: 100,
        lastUpdatedAt: '2025-11-12T19:45:00-03:00',
        objectives: [
                {
                        id: 'tableros-conexion',
                        title: '3 tableros de conexión instalados',
                        approvals: { approved: 4, required: 4 },
                        evidences: [
                        ]
                },
                {
                        id: 'interruptores-seguridad',
                        title: '6 interruptores de seguridad certificados',
                        approvals: { approved: 4, required: 4 },
                        evidences: [
                        ]
                },
                {
                        id: 'cableado-ignifugo',
                        title: '50 metros de cableado ignífugo',
                        approvals: { approved: 4, required: 4 },
                        evidences: [
                        ]
                },
                {
                        id: 'lamparas-led',
                        title: '$180.000 ARS para lámparas LED',
                        approvals: { approved: 4, required: 4 },
                        evidences: [
                        ]
                },
                {
                        id: 'voluntarios-instalacion',
                        title: '2 voluntarios para instalación',
                        approvals: { approved: 4, required: 4 },
                        evidences: [
                        ]
                }
        ],
        aiNotice: {
                headline: 'Reporte inteligente en preparación',
                description:
                        'La IA de Conectando Corazones está sintetizando aprendizajes, métricas de impacto y reseñas de cada colaborador.',
                subcopy:
                        'Lo recibirás minutos después de cerrar el proyecto, listo para compartirlo con tu comunidad.'
        }
};

export const collaborationRequests: CollaborationRequest[] = [
];

export const activeCollaborators: ActiveCollaborator[] = [
        {
                id: 'active-lumina-cooperativa',
                name: 'Lumina Cooperativa',
                role: 'Mariano Ponce · Empresa eléctrica',
                email: 'alianzas@luminacooperativa.com.ar',
                joinedAt: '03/11/2025',
                contribution:
                        'Instalación del cableado principal y supervisión de soportes en los pabellones A y B conforme a normas IRAM.'
        },
 {
                id: 'active-sembrar-futuro',
                name: 'Sembrar Futuro',
                role: 'Clara Medina · ONG',
                email: 'coordinacion@sembrarfuturo.org',
                joinedAt: '03/11/2025',
                contribution:
                        'Donación de 60 lámparas LED y coordinación del transporte hasta la Escuela Esperanza.'
        },
        {
                id: 'active-lucas-ferreyra',
                name: 'Lucas Ferreyra',
                role: 'Voluntario UTN FRRo · Ing. Eléctrica',
                email: 'lucas.ferreyra@frro.utn.edu.ar',
                joinedAt: '03/11/2025',
                contribution:
                        'Asistencia en tendido interno, pruebas de seguridad y mentoría para el personal de mantenimiento.'
        },
        {
                id: 'active-sofia-mansilla',
                name: 'Sofía Mansilla',
                role: 'Voluntaria UTN FRRo · Ing. Eléctrica',
                email: 'sofia.mansilla@frro.utn.edu.ar',
                joinedAt: '03/11/2025',
                contribution:
                        'Coordinación de instalación de luminarias y talleres básicos de mantenimiento para docentes.'
        }
];



export const luzParaAprenderProgress: ProgressSegment[] = [
	{ label: 'Donación monetaria', percent: 15, grad: 'green' },
	{ label: 'Lámparas LED', percent: 40, grad: 'blue' },
	{ label: 'Electricistas', percent: 80, grad: 'purple' }
];

export const ayudaTypes: AidType[] = [
	{
		label: 'Voluntariado',
		percent: 32,
		grad: 'purple',
		insight: '2 voluntarios activos'
	},
	{
		label: 'Monetaria',
		percent: 33,
		grad: 'green',
		insight: '$50.000 ARS comprometidos'
	},
	{
		label: 'En especie',
		percent: 35,
		grad: 'blue',
		insight: 'Cables y lámparas de luz LED'
	}
];

export const filterLabels = ['Período', 'Categoría', 'Estado', 'Tipo de ayuda', 'Ubicación'];

export const profileHighlights = {
        verification: {
                icon: ShieldCheck,
                title: 'Verificación Exitosa'
        },
        pendingReview: {
                icon: Lightbulb,
                title: 'Aspectos a mejorar'
        },
        logout: LogOut
};

export const callToActionIcon = Plus;
export const notificationIcon = Bell;
export const trendingIcon = TrendingUp;

export const quickActionIcon = LayoutGrid;

export const viewModeLabels: Record<ViewMode, string> = {
        dashboard: 'Mi panel',
        collaborations: 'Colaboraciones',
        projects: 'Proyectos',
        chat: 'Mensajes',
        profile: 'Perfil',
        settings: 'Configuración',
        evidence: 'Carga de evidencias',
        closure: 'Solicitud de cierre'
};

export const institutionIdentity: InstitutionIdentity = {
	name: 'Escuela Esperanza',
	registrationId: 'CUIT 30-71234567-4',
	sector: 'Educación primaria',
	location: 'Rosario, Santa Fe, Argentina',
	legalRepresentative: {
		name: 'Patricia González',
		idType: 'DNI',
		idNumber: '23.456.789',
		email: 'patricia.gonzalez@escuelaesperanza.org'
	},
	contactPhone: '+54 9 341 555 1234',
	website: 'https://escuelaesperanza.org'
};

export const verificationSummary: VerificationSummary = {
	status: 'Verificada',
	description:
		'La identidad institucional y del representante legal fueron confirmadas manualmente por el equipo administrador.',
	method: 'Validación manual de documentación oficial',
	lastReview: '12 de noviembre de 2025',
	nextReview: '12 de noviembre de 2026',
	reviewer: 'Carolina Torres (Administradora de confianza)',
	reliabilityLevel: 'Alta',
	documentsReviewed: 4
};

export const verificationDocuments: VerificationDocument[] = [
	{
		label: 'Acta constitutiva y estatuto actualizado',
		status: 'Aprobado',
		detail: 'Documento firmado y sellado en noviembre de 2025.'
	},
	{
		label: 'Identificación del representante legal (DNI)',
		status: 'Aprobado',
		detail: 'Fotografía a color verificada manualmente.'
	},
	{
		label: 'Constancia de CUIT',
		status: 'Aprobado',
		detail: 'Número fiscal coincide con la documentación presentada en noviembre de 2025.'
	},
	{
		label: 'Comprobante de domicilio institucional',
		status: 'Aprobado',
		detail: 'Servicio eléctrico emitido en noviembre de 2025 a nombre de la institución.'
	}
];

export const chatMetadata: ChatMetadataMap = {
	1: {
		chatId: 1,
		institution: {
			id: 'institucion-escuela-esperanza',
			name: 'Escuela Esperanza',
			role: 'Institución',
			kind: 'institucion',
			description: 'Comunidad educativa liderada por Patricia González, directora del plantel.',
			contact: 'Patricia González • Directora',
			avatar: '/users/escuela-esperanza.jpg'
		},
		collaborators: [
			{
				id: 'colaborador-lumina-cooperativa',
				name: 'Lumina Cooperativa',
				role: 'Colaborador',
				kind: 'empresa',
				description: 'Empresa especialista en soluciones energéticas comunitarias.',
				contact: 'Equipo de proyectos estratégicos',
				avatar: '/users/lumina-cooperativa.svg'
			},
			{
				id: 'colaborador-sembrar-futuro',
				name: 'Sembrar Futuro',
				role: 'Colaborador',
				kind: 'ong',
				description: 'ONG que dona lámparas LED y acompaña el despliegue comunitario.',
				contact: 'Coordinación de donaciones',
				avatar: '/users/sembrar-futuro.svg'
			},
			{
				id: 'voluntario-lucas-utn',
				name: 'Lucas Ferreyra',
				role: 'Colaborador',
				kind: 'voluntario',
				description: 'Estudiante de ingeniería eléctrica de la UTN FRRo.',
				contact: 'Lucas Ferreyra • UTN FRRo',
				avatar: '/users/avatar-generico.svg'
			},
			{
				id: 'voluntaria-sofia-utn',
				name: 'Sofía Mansilla',
				role: 'Colaborador',
				kind: 'voluntario',
				description: 'Estudiante de ingeniería eléctrica de la UTN FRRo.',
				contact: 'Sofía Mansilla • UTN FRRo',
				avatar: '/users/avatar-generico.svg'
			}
		],
		attachments: [
			// GALERÍA (soporte visual del relato)
			{
				id: 'galeria-escuela-exterior',
				name: 'Fachada actual del colegio',
				category: 'galeria',
				fileType: 'image',
				fileExtension: 'png',
				description: 'Fotografía de la entrada principal antes de la instalación eléctrica.',
				uploadedAt: '2025-11-11',
				previewImage: '/img/escuela-esperanza-antes.png'
			},
			{
				id: 'galeria-salon-nocturno',
				name: 'Foto de aula iluminada',
				category: 'galeria',
				fileType: 'image',
				fileExtension: 'jpg',
				description: 'Fotografía nocturna realizada por voluntarios.',
				uploadedAt: '2025-11-16',
				previewImage: '/img/aula-iluminada.png'
			},

			// ——— OBJETIVO MONETARIO (Sembrar Futuro) ———
			{
					id: 'evidencia-comprobante-transf-002',
					name: 'comprobante_transferencia.pdf',
					category: 'evidencia',
					fileType: 'pdf',
					fileExtension: 'pdf',
					description:
							'Comprobante de transferencia realizada por la ONG para la compra de lámparas.',
					uploadedAt: '2025-11-14',
					previewImage: '/img/pdf-portada.svg',
					evidenceFlow: 'entrada',
					relatedEvidenceId: ['evidencia-acuse-recepcion-donacion-001'],
					uploadedBy: 'Sembrar Futuro',
					downloadUrl: '/docs/evidencias/comprobante-transf-002.pdf'
			},
			{
				id: 'evidencia-factura-asociada-compra-002',
				name: 'factura_compra_lamparas.pdf',
				category: 'evidencia',
				fileType: 'pdf',
				fileExtension: 'pdf',
				description: 'Factura final asociada a la donación monetaria (uso del dinero).',
				uploadedAt: '2025-11-16',
				previewImage: '/img/pdf-portada.svg',
				evidenceFlow: 'salida',
				relatedEvidenceId: ['evidencia-factura-led-001'],
				uploadedBy: 'Patricia González',
				downloadUrl: '/docs/evidencias/factura-asociada-compra-002.pdf'
                        },

			// ——— OBJETIVO EN ESPECIE (Lumina Cooperativa) ———
			{
				id: 'evidencia-remito-lumina-001',
				name: 'remito_entrega_lumina.pdf',
				category: 'evidencia',
				fileType: 'pdf',
				fileExtension: 'pdf',
				description: 'Remito de entrega de materiales: cableado, tableros e interruptores.',
                                uploadedAt: '2025-11-13',
                                previewImage: '/img/pdf-portada.svg',
                                evidenceFlow: 'entrada',
                                relatedEvidenceId: ['evidencia-foto-materiales-001'],
                                uploadedBy: 'Lumina Cooperativa',
                                downloadUrl: '/docs/evidencias/remito-lumina-001.pdf'
                        },
			{
				id: 'evidencia-foto-materiales-001',
				name: 'materiales_recibidos.jpg',
				category: 'evidencia',
				fileType: 'image',
				fileExtension: 'jpg',
				description: 'Fotografía de materiales donados al momento de la entrega.',
                                uploadedAt: '2025-11-13',
                                previewImage: '/img/jpg-portada.svg',
                                evidenceFlow: 'salida',
                                relatedEvidenceId: ['evidencia-remito-lumina-001'],
                                uploadedBy: 'Patricia González',
                                downloadUrl: '/docs/evidencias/materiales-entrada-001.jpg'
                        },

			// ——— OBJETIVO VOLUNTARIADO (Lucas y Sofía) ———
			{
				id: 'evidencia-plan-trabajo-voluntarios-001',
				name: 'plan_trabajo_voluntariado.pdf',
				category: 'evidencia',
				fileType: 'pdf',
				fileExtension: 'pdf',
				description:
					'Plan de trabajo de instalación presentado por Lucas y Sofía (cronograma y tareas).',
                                uploadedAt: '2025-11-15',
                                previewImage: '/img/pdf-portada.svg',
                                evidenceFlow: 'entrada',
                                relatedEvidenceId: ['evidencia-antes-despues-001'],
                                uploadedBy: 'Lucas Ferreyra',
                                downloadUrl: '/docs/evidencias/plan-trabajo-voluntariado-001.pdf'
                        },
			{
				id: 'evidencia-registro-fotografico',
				name: 'foto_instalación.jpg',
				category: 'evidencia',
				fileType: 'image',
				fileExtension: 'jpg',
				description: 'Fotos de los trabajos en progreso compartidas por voluntariado.',
                                uploadedAt: '2025-11-18',
                                previewImage: '/img/jpg-portada.svg',
                                evidenceFlow: 'entrada',
                                relatedEvidenceId: ['evidencia-antes-despues-001'],
                                uploadedBy: 'Sofía Mansilla',
                                downloadUrl: '/docs/evidencias/registro-fotografico.jpg'
                        },
			{
				id: 'evidencia-antes-despues-001',
				name: 'antes_despues_aulas.zip',
				category: 'evidencia',
				fileType: 'archive',
				fileExtension: 'zip',
				description: 'Paquete de fotos antes/después de las tres aulas iluminadas.',
                                uploadedAt: '2025-11-19',
                                previewImage: '/img/zip-portada.svg',
                                evidenceFlow: 'salida',
                                relatedEvidenceId: ['evidencia-plan-trabajo-voluntarios-001', 'evidencia-registro-fotografico'],
                                uploadedBy: 'Patricia González',
                                downloadUrl: '/docs/evidencias/antes-despues-aulas-001.zip'
                        },

			// ——— CIERRE DEL PROYECTO ———
			{
				id: 'evidencia-reporte-cierre-ia-001',
				name: 'reporte_cierre_IA.pdf',
				category: 'evidencia',
				fileType: 'pdf',
				fileExtension: 'pdf',
				description:
					'Reporte de cierre con IA: resumen de impacto, hallazgos y sugerencias de mejora.',
                                uploadedAt: '2025-11-20',
                                previewImage: '/img/pdf-portada.svg',
                                evidenceFlow: 'salida',
                                relatedEvidenceId: null,
                                isAiGenerated: true,
                                uploadedBy: 'Conectando Corazones',
                                downloadUrl: '/docs/evidencias/reporte-cierre-ia-001.pdf'
                        }
		],
		project: {
			name: 'Luz para Aprender',
			location: 'Escuela Esperanza · Calle José Ingenieros 1842, Barrio Ludueña, Rosario, Santa Fe',
			tentativeClosure: '23/11/2025',
			remainingDays: 20,
			evidenceArchiveUrl: '/docs/evidencias/luz-para-aprender-evidencias.zip',
                        objectives: [
                                {
                                        id: 'objetivo-tableros-conexion',
                                        progressLabel: '0/3 tableros de conexión instalados',
                                        resourceType: 'en especie',
                                        sponsors: ['Lumina Cooperativa'],
                                        status: 'pending'
                                },
                                {
                                        id: 'objetivo-interruptores-seguridad',
                                        progressLabel: '3/6 interruptores de seguridad certificados',
                                        resourceType: 'en especie',
                                        sponsors: ['Lumina Cooperativa'],
                                        status: 'in_progress'
                                },
                                {
                                        id: 'objetivo-cableado-ignifugo',
                                        progressLabel: '50/50 metros de cableado ignífugo',
                                        resourceType: 'en especie',
                                        sponsors: ['Lumina Cooperativa'],
                                        status: 'completed'
                                },
                                {
                                        id: 'objetivo-lamparas-led',
                                        progressLabel: '$0 / $180.000 ARS para lámparas LED',
                                        resourceType: 'monetaria',
                                        sponsors: ['Sembrar Futuro'],
                                        status: 'pending'
                                },
                                {
                                        id: 'objetivo-voluntariado-instalacion',
                                        progressLabel: '2/2 voluntarios para instalación',
                                        resourceType: 'voluntariado',
                                        sponsors: ['Lucas', 'Sofía'],
                                        status: 'completed'
                                }
                        ]
                }
        }
};

export const adminObservations: ObservationItem[] = [
	{
		message: 'Documentación completa y vigente. Mantener copias digitalizadas con firmas visibles.',
		recordedAt: '12/11/2025 10:45 (GMT-3)',
		type: 'info'
	}
];

export const reportingStatus: ReportingStatus = {
	hasReports: false,
	message:
		'Sin reportes ni denuncias de la comunidad. La institución está catalogada como confiable.',
	lastUpdate: '12 de noviembre de 2025',
	riskLevel: 'none'
};

export const filtersResetLabel = 'Limpiar';