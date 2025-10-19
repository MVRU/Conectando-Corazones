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
	InstitutionIdentity,
	Metric,
	NavItem,
	ObservationItem,
	ProgressSegment,
	ProjectItem,
	ReportingStatus,
	VerificationDocument,
	VerificationSummary,
	ViewMode
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
		name: 'Fundación Sonrisas',
		lastMessage: 'Confirmamos el envío de kits escolares.',
		time: 'Hace 2h',
		statusColor: PRIMARY_500,
		isUnread: false
	},
	{
		id: 3,
		name: 'Equipo Conectando',
		lastMessage: 'Recordatorio de reunión semanal.',
		time: 'Ayer',
		statusColor: WARNING_COLOR,
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
				author: 'Coordinación Conectando',
				content:
					'Hola, ¿cómo avanzan con la revisión del presupuesto? Podemos apoyar si necesitan.',
				sentAt: '2025-02-15T08:30:00-05:00',
				direction: 'incoming'
			},
			{
				id: 102,
				author: 'Institución',
				content:
					'Buenos días, estamos afinando los últimos detalles. Confirmamos hoy antes de las 17:00.',
				sentAt: '2025-02-15T08:41:00-05:00',
				direction: 'outgoing'
			},
			{
				id: 103,
				author: 'Coordinación Conectando',
				content: 'Perfecto, quedamos atentos. ¡Gracias!',
				sentAt: '2025-02-15T08:45:00-05:00',
				direction: 'incoming'
			}
		]
	},
	{
		chatId: 2,
		subject: 'Fundación Sonrisas',
		messages: [
			{
				id: 201,
				author: 'Fundación Sonrisas',
				content: 'Los kits escolares salieron hoy. Llegarán el jueves a primera hora.',
				sentAt: '2025-02-14T15:12:00-05:00',
				direction: 'incoming'
			},
			{
				id: 202,
				author: 'Institución',
				content: 'Muchas gracias por la confirmación. Avisamos al equipo logístico.',
				sentAt: '2025-02-14T15:20:00-05:00',
				direction: 'outgoing'
			}
		]
	},
	{
		chatId: 3,
		subject: 'Equipo Conectando',
		messages: [
			{
				id: 301,
				author: 'Equipo Conectando',
				content: 'Recordatorio: la reunión de seguimiento es mañana a las 10:00.',
				sentAt: '2025-02-14T09:00:00-05:00',
				direction: 'incoming'
			}
		]
	}
];

export const projectItems: ProjectItem[] = [
	{
		id: 1,
		name: 'Luz para Aprender',
		status: 'En Curso',
		date: '30/10/2025',
		statusColor: GREEN
	},
	{
		id: 2,
		name: 'Patio de colores',
		status: 'Borrador',
		date: '25/11/2025',
		statusColor: PRIMARY_500
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
        projects: 'Proyectos',
        chat: 'Mensajes',
        profile: 'Perfil',
        settings: 'Configuración'
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
        lastReview: '12 de octubre de 2025',
        nextReview: '12 de octubre de 2026',
        reviewer: 'Carolina Torres (Administradora de confianza)',
        reliabilityLevel: 'Alta',
        documentsReviewed: 4
};

export const verificationDocuments: VerificationDocument[] = [
        {
                label: 'Acta constitutiva y estatuto actualizado',
                status: 'Aprobado',
                detail: 'Documento firmado y sellado en julio de 2024.'
        },
        {
                label: 'Identificación del representante legal (DNI)',
                status: 'Aprobado',
                detail: 'Fotografía a color verificada manualmente.'
        },
        {
                label: 'Constancia de CUIT',
                status: 'Aprobado',
                detail: 'Número fiscal coincide con la documentación presentada.'
        },
        {
                label: 'Comprobante de domicilio institucional',
                status: 'Aprobado',
                detail: 'Servicio eléctrico emitido en junio de 2025 a nombre de la institución.'
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
			contact: 'Patricia González • Directora'
		},
		collaborators: [
			{
				id: 'colaborador-lumina-cooperativa',
				name: 'Lumina Cooperativa',
				role: 'Colaborador',
				kind: 'empresa',
				description: 'Empresa especialista en soluciones energéticas comunitarias.',
				contact: 'Equipo de proyectos estratégicos'
			},
			{
				id: 'colaborador-sembrar-futuro',
				name: 'Sembrar Futuro',
				role: 'Colaborador',
				kind: 'ong',
				description: 'ONG que dona lámparas LED y acompaña el despliegue comunitario.',
				contact: 'Coordinación de donaciones'
			},
			{
				id: 'voluntario-lucas-utn',
				name: 'Lucas',
				role: 'Colaborador',
				kind: 'voluntario',
				description: 'Estudiante de ingeniería eléctrica de la UTN FRRo.',
				contact: 'Lucas • UTN FRRo'
			},
			{
				id: 'voluntaria-sofia-utn',
				name: 'Sofía',
				role: 'Colaborador',
				kind: 'voluntario',
				description: 'Estudiante de ingeniería eléctrica de la UTN FRRo.',
				contact: 'Sofía • UTN FRRo'
			}
		],
		attachments: [
			{
				id: 'galeria-escuela-exterior',
				name: 'Fachada actual del colegio',
				category: 'galeria',
				fileType: 'image',
				description: 'Fotografía de la entrada principal antes de la instalación eléctrica.',
				uploadedAt: '2025-02-11'
			},
			{
				id: 'galeria-salon-nocturno',
				name: 'Aula iluminada con lámparas LED',
				category: 'galeria',
				fileType: 'image',
				description: 'Registro fotográfico del piloto nocturno realizado con voluntarios.',
				uploadedAt: '2025-02-16'
			},
			{
				id: 'evidencia-factura-led-001',
				name: 'Factura lámparas LED - febrero',
				category: 'evidencia',
				fileType: 'pdf',
				description: 'Factura emitida por proveedor de luminarias homologadas.',
				uploadedAt: '2025-02-12'
			},
			{
				id: 'evidencia-comprobante-transf-002',
				name: 'Comprobante transferencia Sembrar Futuro',
				category: 'evidencia',
				fileType: 'pdf',
				description: 'Documento que acredita la donación recibida para la compra de materiales.',
				uploadedAt: '2025-02-14'
			}
		]
	}
};

export const adminObservations: ObservationItem[] = [
        {
                message: 'Documentación completa y vigente. Mantener copias digitalizadas con firmas visibles.',
                recordedAt: '12/10/2025 10:45 (GMT-3)',
                type: 'info'
        }
];

export const reportingStatus: ReportingStatus = {
        hasReports: false,
        message: 'Sin reportes ni denuncias de la comunidad. La institución está catalogada como confiable.',
        lastUpdate: '12 de octubre de 2025',
        riskLevel: 'none'
};	

export const filtersResetLabel = 'Limpiar';